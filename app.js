import express from 'express';
import mongoose from 'mongoose';

import {accountRouter} from './routes/AccountRouter.js'

const app = express();


app.use(express.json());
app.use('/accounts', accountRouter);


const URL =
 'mongodb+srv://vicente:2021@cluster0.8nhao.mongodb.net/desafio01?retryWrites=true&w=majority';
const connect = async () => {
    await mongoose.connect(URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log('Conectado ao MongDB')
}
connect();


app.listen(3000, () => {
    console.log('API iniciada');
})