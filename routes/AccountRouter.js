import express from 'express';

import {accountModel} from '../models/AccountModel.js'

const app = express();

// Task item four.
app.patch('/deposit/:agencia/:conta/:valor', async (req, res) => {
    try {
        const {agencia, conta, valor} = req.params;
        const account = await accountModel.findOne({$and: [{agencia}, {conta}]});
        if (!account) {
            res.status(404).send('Account not found');
        } else {
            account.balance += (valor * 1);
            await account.save();
            res.status(200).send(`Current balance: ${account.balance}`);
        }
    } catch  (error) {
        console.log('error => ', error)
        res.status(500).send();
    }
})

// Task item five.
app.patch('/withdraw/:agencia/:conta/:valor', async (req, res) => {
    try {
        const {agencia, conta, valor} = req.params;
        const account = await accountModel.findOne({$and: [{agencia}, {conta}]});
        if (!account) {
            res.status(404).send('Account not found');
        } else {
            const TARIFA = 1;
            account.balance -= ((valor * 1) + TARIFA);
            if (account.balance >= 0) {
                await account.save();
                res.status(200).send(`Current balance: ${account.balance}`);
            } else {
                res.status(401).send(`Insufficient balance`);
            }
        }
    } catch  (error) {
        console.log('error => ', error)
        res.status(500).send();
    }
})

export {app as accountRouter};