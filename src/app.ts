import express, { Express } from 'express';
import expressContext from "express-request-context";

import { addUserProfile } from '@middlewares/addUserProfile'
import { adminRouter, contractRouter, jobRouter, paymentRouter } from '@routes/index'
import errorHandler from '@middlewares/errorHandler';


const app: Express = express();

app.use(express.json());
// This will enable the 'context' object for you.
app.use(expressContext()); 

app.use('/contracts', addUserProfile, contractRouter);
app.use('/jobs', addUserProfile, jobRouter);
app.use('/balance', addUserProfile, paymentRouter);
app.use('/admin', adminRouter);

app.use(errorHandler);

export = app;
