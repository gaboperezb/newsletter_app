// NPM
import dotenv from 'dotenv'
dotenv.config();// NPM
import express from 'express'

import mongoose from 'mongoose'
import aws from 'aws-sdk'
import routes from './api/routes.js';

mongoose.connect("mongodb://mongo:27017/newdock", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

aws.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

let app = express();
let port = 4000;

app.listen(port, function () {
    console.log('Listening on port: ' + port);
    routes(app);
});
