import express, { Express } from 'express';
import expressContext from "express-request-context";

import { addUserProfile } from '@middlewares/addUserProfile'
import { adminRouter, contractRouter, jobRouter, paymentRouter } from '@routes/index'
import errorHandler from '@middlewares/errorHandler';


const app: Express = express();

app.use(express.json());
// 'context' object in request
app.use(expressContext()); 

app.use('/contracts', addUserProfile, contractRouter);
app.use('/jobs', addUserProfile, jobRouter);
app.use('/balances', addUserProfile, paymentRouter);
app.use('/admin', adminRouter);

app.use(errorHandler);

export = app;
