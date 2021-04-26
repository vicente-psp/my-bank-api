import express from 'express';
import mongoose from 'mongoose';
import * as fs from'fs';
import dotenv from 'dotenv';

import {accountRouter} from './routes/AccountRouter.js'

const app = express();
dotenv.config();

app.use(express.json());
app.use('/accounts', accountRouter);

/*
let urlMongoDB = '';
const fileUrl = async () => {
    await fs.readFile('config.json', (err, data) => {
        if (err) {
            console.log(err);
        }
        const fileConfig = JSON.parse(data);
        urlMongoDB = fileConfig.urlMongoDB;
        connectMongoDB();
    });
}
fileUrl();
*/

let urlMongoDB = `mongodb+srv://${process.env.USER_DB}:${process.env.PASSWORD_DB}@cluster0.8nhao.mongodb.net/desafio01?retryWrites=true&w=majority`;
const connectMongoDB = async () => {
    await mongoose.connect(urlMongoDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log('Conectado ao MongDB')
}
connectMongoDB();


app.listen(process.env.PORT, () => {
    console.log('API iniciada');
})