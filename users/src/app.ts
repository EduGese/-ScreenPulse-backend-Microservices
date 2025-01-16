import express from 'express';
import cors from 'cors';
import connectDB from './config/db';
import config from './config/config';
import userRoutes from './routes/userRoutes';

//execute express
const app = express();
const port = config.server.port;

//CORS
var corsOptions = {
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
  maxAge: 500,
  origin: config.client.url,
}

//middlewares
app.use(cors(corsOptions));
app.use(express.json());

//routes
app.use('/api/users', userRoutes);

// server listenening on config.server.port
app.listen(port, () => {
  console.log('Server is running on port', port);
});

// Mongodb conection
connectDB();
