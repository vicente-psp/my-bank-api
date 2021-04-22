import express from 'express';
import mongoose from 'mongoose';
import * as fs from'fs';

import {accountRouter} from './routes/AccountRouter.js'

const app = express();


app.use(express.json());
app.use('/accounts', accountRouter);

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

const connectMongoDB = async () => {
    await mongoose.connect(urlMongoDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log('Conectado ao MongDB')
}


app.listen(3000, () => {
    console.log('API iniciada');
})