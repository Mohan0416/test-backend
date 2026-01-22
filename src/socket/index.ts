import { Server } from "socket.io";
import jwt from "jsonwebtoken";

let io: Server;

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const payload: any = jwt.verify(token, process.env.JWT_SECRET!);
      socket.data.user = payload;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", socket => {
    const user = socket.data.user;

    if (user.role === "USER") {
  socket.join(`USER:${user.id}`);
}

if (user.role === "BRAND") {
  socket.join(`BRAND:${user.id}`);
}


    console.log("Socket connected:", user.id);

    socket.on("join_conversation", conversationId => {
      socket.join(conversationId);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", user.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};
