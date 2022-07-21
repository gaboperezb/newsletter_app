import mongoose from "mongoose";


const schema = new mongoose.Schema({ 
    newsletter: { type: mongoose.Schema.Types.ObjectId, ref: 'Newsletter'},
    email: 'string'
}, { timestamps: true });

const Subscription = mongoose.model('Subscription', schema);

export { Subscription };
