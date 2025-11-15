import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
//import cors from 'cors';
import authRoutes from './src/routes/auth.routes.js';
import workRoutes from './src/routes/service.routes.js';
import workerRoutes from './src/routes/worker.routes.js';
import clientRoutes from './src/routes/client.routes.js';
import  requestRoutes  from "./src/routes/request.routes.js"
import reviewRoutes from "./src/routes/review.routes.js"

dotenv.config();


const app = express();
const port = process.env.PORT;

app.use(morgan('dev'));
app.use(express.json());


app.use("/api", authRoutes);

app.use("/api", workRoutes);

app.use("/api", workerRoutes);

app.use("/api", clientRoutes);

app.use("/api", requestRoutes);

app.use("/api", reviewRoutes);



app.listen(port, () => {
  console.log(`Servidor de Gochamba escuchando en http://localhost:${port}`);
});