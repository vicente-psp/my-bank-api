import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const accountSchema = new Schema({
  agencia: { 
    type: Number,
    require: true
  },
  conta: { 
    type: Number,
    require: true
  },
  name: {
    type: String,
    require: true
  },
  balance: {
     type: Number,
     min: 0,
     require: true
  }
});

const accountModel = mongoose.model('accounts', accountSchema, 'accounts');

export {accountModel};