import express from 'express';
import path from 'path';
import { __dirname } from "./utils.js";
import { connectMongo } from "./db.js";
import MongoStore from 'connect-mongo';
import productRouter from "./routes/product.router.js";

const app = express();
const port = 5000;

const httpServer = app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});

connectMongo();

// connectSocket(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/products', productRouter);

app.get('*', (req, res) => {
  return res.status(404).json({
    status: 'error',
    msg: 'no encontrado',
    data: {},
  });
});