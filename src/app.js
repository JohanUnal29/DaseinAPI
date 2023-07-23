import express from 'express';
import path from 'path';
import { __dirname } from "./utils.js";
import { connectMongo } from "./db.js";
import MongoStore from 'connect-mongo';
import productRouter from "./routes/product.router.js";
import orderRouter from "./routes/order.router.js";
import { sessionGoogleRouter } from './routes/sessionGoogle.router.js';
import passport from 'passport';
import { iniPassport } from './config/passport.config.js';
import session from 'express-session';
import cors from 'cors';

const app = express();
const port = 5000;
app.use(cors());

const httpServer = app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});

connectMongo();

// connectSocket(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://johanardilah:Bmth2018.@dasein.q4myj6u.mongodb.net/?retryWrites=true&w=majority', ttl: 86400 * 7 }),
    secret: 'un-re-secreto',
    resave: true,
    saveUninitialized: true,
  })
);

iniPassport();
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.use('/api/sessionsGoogle', sessionGoogleRouter);

app.get('*', (req, res) => {
  return res.status(404).json({
    status: 'error',
    msg: 'no encontrado',
    data: {},
  });
});