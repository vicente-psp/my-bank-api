import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const accountSchema = new Schema({
  agencia: { 
    type: Number,
    required: true
  },
  conta: { 
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  balance: {
     type: Number,
     min: 0,
     required: true
  }
});

const accountModel = mongoose.model('accounts', accountSchema, 'accounts');

export {accountModel};