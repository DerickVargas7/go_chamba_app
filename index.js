import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
//import cors from 'cors';
import authRoutes from './src/routes/auth.routes.js';
import workRoutes from './src/routes/service.routes.js';
import workerRoutes from './src/routes/worker.routes.js';
import clientRoutes from './src/routes/client.routes.js';

dotenv.config();


const app = express();
const port = process.env.PORT;

app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('<title>Gochamba</title><h1>Bienvenido al backend de Gochamba</h1>');
});


app.use("/api", authRoutes);

app.use("/api", workRoutes);

app.use("/api", workerRoutes);

app.use("/api", clientRoutes);



app.listen(port, () => {
  console.log(`Servidor de Gochamba escuchando en http://localhost:${port}`);
});