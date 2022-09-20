#!/usr/bin/env node
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import debug from 'debug';
debug('backend:server');
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from 'morgan';
import chalk from 'chalk';
import helmet from 'helmet';
import connectToDatbase from './db/mongo_db_connector.js';

// ROUTER IMPORTS
import searchRouter from './routes/search.js';
import cartRouter from './routes/cart.js';
import bookingsRouter from './routes/bookings.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || '8000';
const STATIC = path.join(__dirname, 'public');
const app = express();

// DATABASE CONNECTOR
connectToDatbase().catch((err) => console.log(err));

// EXPRESS CONFIG
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(STATIC));
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
  })
);

// ROUTERS
app.use('/search', searchRouter);
app.use('/cart', cartRouter);
app.use('/bookings', bookingsRouter);

// PORT LISTENER
app.listen(PORT, () => {
  console.log(`
${chalk.cyanBright('SERVER LISTENING ON PORT:')} ${chalk.whiteBright(PORT)}
`);
});
