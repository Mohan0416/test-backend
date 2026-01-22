import express from 'express'
import cors from 'cors'
import healthRoutes from './routes/health.routes'
import authRoutes from './routes/auth.routes'
import postRoutes from './routes/post.routes'
import feedRoutes from './routes/feed.route'
import followRoutes from './routes/follow.routes'
import likeRoutes from './routes/like.routes'
import commentRoutes from './routes/comment.routes'
import conversationRoutes from './routes/conversation.routes'
import notificationRoutes from './routes/notification.routes'
import leadRoutes from './routes/leadForm.routes'
import searchRoutes from './routes/search.routes'
import savedPostRoutes from './routes/savedPost.routes'
import collectionRoutes from './routes/collections.routes'
import galleryRoutes from './routes/gallery.routes'
import quicksite from './routes/quicksite.routes'
import reviewRoutes from './routes/review.routes'
import testimonialRoutes from './routes/testimonial.routes'
import cron from 'node-cron'
import { updateTrendingScores } from './jobs/trendingScore.job'

const app = express()

// Configure CORS with proper security settings
const corsOptions = {
  origin: process.env.FRONTEND_URL || process.env.CORS_ORIGIN || '*' || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};  
app.use(cors({
  origin: 'http://localhost:3000',  // Change from '*'
  credentials: true
}));

// Limit JSON payload size to prevent DoS attacks
app.use(express.json({ limit: '10mb' }))

// Update trending scores every 10 minutes
cron.schedule("*/10 * * * *", () => {
  updateTrendingScores();
});

app.use('/api/health',healthRoutes)

app.use('/api/auth', authRoutes)

app.use('/api/posts', postRoutes)

app.use('/api/feed', feedRoutes)

app.use('/api/follow', followRoutes)

app.use('/api/likes', likeRoutes)

app.use("/api", commentRoutes);

app.use('/api/conversations', conversationRoutes)

app.use('/api/notifications', notificationRoutes)

app.use('/api/lead-form',leadRoutes)

app.use("/api/search", searchRoutes);

app.use('/api/saved-posts', savedPostRoutes)

app.use('/api/collections', collectionRoutes)

app.use('/api/gallery', galleryRoutes)

app.use('/api/quicksite', quicksite)

app.use('/api/reviews', reviewRoutes)

app.use("/api/testimonials", testimonialRoutes);



export default app