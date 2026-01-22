import { Request,Response } from "express";
import bcrypt from 'bcrypt'
import { prisma } from "../config/db";
import { signToken, verifyToken } from "../utils/jwt";
import { Role } from "../generated/prisma";
import { validateEmail, validatePassword, validateUsername, validateName, sanitizeInput } from "../utils/validation";

const SALT = 12

export const signupUser = async (req: Request, res: Response) => {
  try {
    let { name, username, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    // Sanitize inputs
    name = sanitizeInput(name);
    email = sanitizeInput(email).toLowerCase();

    // Generate username from name if not provided
    if (!username) {
      username = name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_|_$/g, "");
      
      // Ensure username is at least 3 characters
      if (username.length < 3) {
        username = username + "_" + Math.random().toString(36).substring(2, 5);
      }
    } else {
      username = sanitizeInput(username);
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        message: passwordValidation.message,
      });
    }

    // Validate username
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.valid) {
      return res.status(400).json({
        message: usernameValidation.message,
      });
    }

    // Validate name
    const nameValidation = validateName(name);
    if (!nameValidation.valid) {
      return res.status(400).json({
        message: nameValidation.message,
      });
    }

    // Check if user already exists
    const exists = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (exists) {
      return res.status(400).json({
        message: "Email or username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, SALT);

    await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({
      message: "User created successfully",
    });
  } catch (err) {
    console.error(err);
    // Don't leak database errors to client
    return res.status(500).json({
      message: "Signup failed",
    });
  }
};


export const signupBrand = async (req:Request, res:Response) =>{
    try{
        let {name,username,email,password} = req.body

        // Validate required fields
        if (!name || !username || !email || !password) {
          return res.status(400).json({ message: 'All fields are required' });
        }

        // Sanitize inputs
        name = sanitizeInput(name);
        username = sanitizeInput(username);
        email = sanitizeInput(email).toLowerCase();

        // Validate email format
        if (!validateEmail(email)) {
          return res.status(400).json({ message: 'Invalid email format' });
        }

        // Validate password strength
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
          return res.status(400).json({ message: passwordValidation.message });
        }

        // Validate username
        const usernameValidation = validateUsername(username);
        if (!usernameValidation.valid) {
          return res.status(400).json({ message: usernameValidation.message });
        }

        // Validate name
        const nameValidation = validateName(name);
        if (!nameValidation.valid) {
          return res.status(400).json({ message: nameValidation.message });
        }

        // Check if brand already exists
        const exists = await prisma.brand.findFirst({
          where: {
            OR: [{ email }, { username }],
          },
        });

        if (exists) {
          return res.status(400).json({ message: 'Email or username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, SALT);

        await prisma.brand.create({
          data: {
            name,
            username,
            email,
            password: hashedPassword,
          },
        });

        return res.status(201).json({ message: 'Brand created successfully' });
    } catch (err) {
        console.error(err);
        // Don't leak database errors to client
        return res.status(500).json({ message: 'Signup failed' });
    }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Validate email format
    const sanitizedEmail = sanitizeInput(email).toLowerCase();
    if (!validateEmail(sanitizedEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    let account: any = null;
    let role: Role | null = null;

    // Check user first, then brand
    const user = await prisma.user.findUnique({ where: { email: sanitizedEmail } });

    if (user) {
      account = user;
      role = Role.USER;
    } else {
      const brand = await prisma.brand.findUnique({ where: { email: sanitizedEmail } });
      if (brand) {
        account = brand;
        role = Role.BRAND;
      }
    }

    // Use consistent error message to prevent user enumeration
    if (!account || !role) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password (timing-safe)
    const match = await bcrypt.compare(password, account.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate new session token
    const sessionToken = crypto.randomUUID();
    const token = signToken({ id: account.id, role });

    // Update session token in database
    if (role === Role.USER) {
      await prisma.user.update({
        where: { id: account.id },
        data: { sessionToken },
      });
    } else {
      await prisma.brand.update({
        where: { id: account.id },
        data: { sessionToken },
      });
    }

    return res.json({
      token,
      sessionToken,
      role,
    });
  } catch (err) {
    console.error(err);
    // Don't leak error details
    return res.status(500).json({ message: "Login failed" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token) as { id: string; role: Role };

    // Invalidate session token
    if (decoded.role === Role.USER) {
      await prisma.user.update({
        where: { id: decoded.id },
        data: { sessionToken: null },
      });
    } else if (decoded.role === Role.BRAND) {
      await prisma.brand.update({
        where: { id: decoded.id },
        data: { sessionToken: null },
      });
    }

    return res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Logout failed" });
  }
};
