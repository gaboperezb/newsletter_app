 import mongoose from "mongoose";


 const schema = new mongoose.Schema({ 
    title: 'string',
    description: 'string',
    sentEmails: {type: 'number', default: 0},
    totalSubscribers: {type: 'number', default: 0}
}, { timestamps: true });

const Newsletter = mongoose.model('Newsletter', schema);

export { Newsletter };
