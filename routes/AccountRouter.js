import express from 'express';

import {accountModel} from '../models/AccountModel.js'

const app = express();


app.post('', async (req, res) => {
    try {
        const account = new accountModel(req.body);
        await account.save();
        res.status(200).send(account);
    } catch  (error) {
        console.log('error => ', error)
        res.status(500).send();
    }
})

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

// Task item six.
app.get('/balance/:agencia/:conta', async (req, res) => {
    try {
        const {agencia, conta} = req.params;
        const account = await accountModel.findOne({$and: [{agencia}, {conta}]});
        if (!account) {
            res.status(404).send('Account not found');
        } else {
            res.status(200).send(account.balance.toString());
        }
    } catch  (error) {
        console.log('error => ', error)
        res.status(500).send();
    }
})

// Task item seven.
app.delete('/:agencia/:conta', async (req, res) => {
    try {
        const {agencia, conta} = req.params;
        const account = await accountModel.findOneAndDelete({$and: [{agencia}, {conta}]});
        if (!account) {
            res.status(404).send('Account not found');
        } else {
            const count = await accountModel.countDocuments({agencia}, (_err, count) => count);
            res.status(200).send(count.toString());
        }
    } catch  (error) {
        console.log('error => ', error)
        res.status(500).send();
    }
})

// Task item eight.
app.patch('/transfer-account/:from/:to/:valor', async (req, res) => {
    try {
        const {from, to, valor} = req.params;
        const contaFrom = await accountModel.findOne({conta: from});
        const contaTo = await accountModel.findOne({conta: to});
        
        if (!contaFrom) {
            res.status(404).send('Source account not found.');
        } else if (!contaTo) {
            res.status(404).send('Destination account not found..');
        } else {
            let tarifa = 0;
            if (contaFrom.agencia != contaTo.agencia) {
                tarifa = 8;
            }
            contaFrom.balance -= ((valor * 1) + tarifa);
            if (contaFrom.balance < 0) {
                res.status(401).send(`Insufficient balance`);
            } else {
                contaTo.balance += (valor * 1);
                await contaFrom.save();
                await contaTo.save();
                res.status(200).send(`Current balance: ${contaFrom.balance}`);
            }
        }
    } catch  (error) {
        console.log('error => ', error)
        res.status(500).send();
    }
})

// Task item nine.
app.get('/balance-average/:agencia', async (req, res) => {
    try {
        const {agencia} = req.params;
        const count = await accountModel.countDocuments({agencia}, (_err, count) => count);
        
        if (count > 0) {
            const accounts = await accountModel.find({agencia});
            const sum = accounts.reduce((acc, curr) => acc + curr.balance, 0);
            const average = sum / count;
            res.status(200).send(`Average: ${average}`);
        } else {
            res.status(404).send();
        }
    } catch  (error) {
        console.log('error => ', error)
        res.status(500).send();
    }
})

// Task item ten.
app.get('/lowest-balances/:limit', async (req, res) => {
    try {
        const {limit} = req.params;
        
        let accounts = await accountModel
                                .find({}, {_id: 0, agencia: 1, conta: 1, balance: 1})
                                .sort({balance: 1})
                                .limit((limit * 1));
        accounts = accounts
            .filter(obj => !isNullOrUndefined(obj));
        res.status(200).send(accounts);
    } catch  (error) {
        console.log('error => ', error)
        res.status(500).send();
    }
})

// Task item eleven.
app.get('/biggest-balances/:limit', async (req, res) => {
    try {
        const {limit} = req.params;
        
        let accounts = await accountModel
            .find({}, {_id: 0, agencia: 1, conta: 1, name: 1, balance: 1})
            .sort({balance: -1})
            .limit((limit * 1));
        accounts = accounts.filter(obj => !isNullOrUndefined(obj));
        res.status(200).send(accounts);
    } catch  (error) {
        console.log('error => ', error)
        res.status(500).send();
    }
})

// Task item twelve.
app.get('/migrate-larger-balances', async (req, res) => {
    try {
        const agencias = await accountModel.distinct('agencia', {});

        for (const agencia of agencias) {
            const account = await accountModel
                .findOne({agencia}, {})
                .sort({balance: -1})
                .limit(1);

            if (!isNullOrUndefined(account)) {
                account.agencia = 99;
                await account.save();
            }
        }
        
        const accounts = await accountModel.find({agencia: 99}, {});

        res.status(200).send(accounts);
    } catch  (error) {
        console.log('error => ', error)
        res.status(500).send();
    }
})


// find by name.
app.get('/:name', async (req, res) => {
    try {
        const {name} = req.params;
        
        let accounts = await accountModel.find({name}, {});
        accounts = accounts
            .filter(obj => !isNullOrUndefined(obj));
        res.status(200).send(accounts);
    } catch  (error) {
        console.log('error => ', error)
        res.status(500).send();
    }
})



const isNullOrUndefined = (obj) => {
    return obj.agencia === null || obj.agencia === undefined;
}



export {app as accountRouter};