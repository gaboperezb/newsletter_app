import dotenv from 'dotenv'
dotenv.config();// NPM
import schedule from 'node-schedule'
import aws from 'aws-sdk'
import mail from 'nodemailer'
import { promises as fs } from 'fs'
import bodyParser from 'body-parser'
import { replaceHTML, validateEmail } from '../util.js'
import mongoose from 'mongoose'

// Models
import * as Newsletter from '../models/newsletter.model.js';
import * as Subscription from '../models/subscription.model.js';
let jsonParser = bodyParser.json();

function routes(app) {

    app.get('/api/unsubscribe/:email/newsletter/:newsletterId', async (req, res) => {
        // Unsubscribe email
        if (typeof req.params.email !== "undefined") {
            // When we unsubscribe, check for an email
            let findEmail = await Subscription.Subscription.find({ "email": req.params.email, 'newsletter': mongoose.Types.ObjectId(req.params.newsletterId) });
    
            if (findEmail.length > 0) {
                // If it exists, remove it
                await Subscription.Subscription.deleteOne({ "email": req.params.email, 'newsletter': mongoose.Types.ObjectId(req.params.newsletterId) });
                await Newsletter.Newsletter.findOneAndUpdate(req.params.newsletterId, { $inc: { 'totalSubscribers': -1 }})
                res.send({ "message": "Unsubscribed succesfully." });
            }
            else {
                // Otherwise the user wasn't even subscribed to begin with
                res.send({ "message": "Subscription does not exist." })
            }
        }
    });
    
    app.post('/api/send', jsonParser, async function (req, res) {
    
        let date;
        if (req.body.date && req.body.time) {
            const dateString = req.body.date + " " + req.body.time;
            const [dateValues, timeValues] = dateString.split(" ");
            const [year, month, day] = dateValues.split('-');
            const [hours, minutes] = timeValues.split(':');
        
            date = new Date(+year, +month - 1, +day, +hours, +minutes, 0);
    
        } else {
            date = new Date(Date.now() + 1000);
        }
        

        schedule.scheduleJob(date, async function () {

            try {
                mailer({
                    'file': req.body.fileURL,
                    'title': req.body.title,
                    'newsletterId': req.body.newsletterId
                });
            } catch (e) {
                console.log(e);
            }
        });
       
    });
    
    app.post('/api/subscribe', jsonParser, async function (req, res) {
        try {

            let checkSubscription = await Subscription.Subscription.find({'email': req.body.email, 'newsletter': mongoose.Types.ObjectId(req.body.newsletterId)});
            console.log(checkSubscription.length)
            if (checkSubscription.length === 0) {
                
                if (validateEmail(req.body.email)) {
                   
                    const newSubscription = new Subscription.Subscription({
                        email: req.body.email,
                        newsletter: req.body.newsletterId
                    });

                    let newsletter = await Newsletter.Newsletter.findByIdAndUpdate(req.body.newsletterId, { $inc: { 'totalSubscribers': 1 }})
                    newSubscription.save(function (err) {
                        if (err) {
                            res.status(400).send({ "message": "Error saving the email.", "code": "0"});
                        } else {
                         
                            res.status(200).send({ "message": "Email added to newsletter!", "code": "1" });
                        }
                    })
                } else {
                    
                    res.status(400).send({ "message": "Error saving the email." });
                }
            } else {
                res.status(201).send({ "message": "User Already Subscribed." });
            }
        } catch (e) {
           
            console.log(e);
        }
    });
    
    app.post('/api/newsletters', jsonParser, async function (req, res) {
        try {
            const newNewsletter = new Newsletter.Newsletter({
                title: req.body.title,
                description: req.body.description,
            });
            newNewsletter.save(function (err, newsletter) {
                if (err) {
                    res.status(400).send({ "message": "Error publishsing your newsletter." });
                } else {
                    console.log(newsletter)
                    res.status(200).json({ newsletter: newsletter });
                }
            })
        } catch (e) {
            console.log(e);
        }
    });
    
    app.get('/api/newsletters', async (req, res) => {

        try {
            let newsletters = await Newsletter.Newsletter.find().sort({ createdAt: -1 });
            res.json({ newsletters });
        } catch (e) {
            console.log(e);
        }
        
    });
    
    app.get('/api/s3/sign-s3', async (req, res) => {
    
        const s3 = new aws.S3();
        const S3_BUCKET = process.env.AWS_BUCKET_NAME;
        const fileName = req.query['file-name'];
        const fileType = req.query['file-type'];

        if (fileType != "application/pdf" && fileType != "image/png" ) {
            return res.status(400).send({ "message": "Server only accepts .pdf or .png files." });
        } 
        //Empty folder
        const s3Params = {
            Bucket: S3_BUCKET,
            Key: `newsletters/${fileName}`,
            Expires: 60 * 60,
            ContentType: fileType
        };
    
        s3.getSignedUrl('putObject', s3Params, (err, data) => {
            if (err) {
    
                console.log(err)
                return res.status(400).send({ "message": "Error saving object." });
            }
    
            const returnData = {
                signedRequest: data,
                url: `https://${S3_BUCKET}.s3.amazonaws.com/newsletters/${fileName}`
            };
    
            res.json(returnData);
    
        });
    });
    
    const mailer = async function (obj) {
        try {
            let emailHTML = await fs.readFile('./templates/mail.html', { encoding:'utf-8' } );
            let transporter = mail.createTransport({
                host: process.env.contactHost,
                port: 465,
                maxMessages: Infinity,
                debug: true,
                secure: true,
                auth: {
                    user: process.env.contactEmail,
                    pass: process.env.contactPassword
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
    
            let allSubs = await Subscription.Subscription.find({ 'newsletter': mongoose.Types.ObjectId(obj.newsletterId) });
            allSubs.forEach(function (item) {
                if (typeof item.email !== "undefined") {
    
                    let replace = {
                        'email': item.email,
                        'newsletterId': obj.newsletterId
                    }
                    
                    let text = replaceHTML(emailHTML, replace);
                    console.log(text)
                    transporter.sendMail({
                        from: `${process.env.contactEmail} <${process.env.contactEmail}>`,
                        to: item.email,
                        subject: obj.title,
                        html: text,
                        replyTo: process.env.contactEmail,
                        attachments: [{   // use URL as an attachment
                            path: obj.file
                        }]
                    }, async (err, info) => {
                        if (err !== null) {
                            console.log(err);
                        }
                        else { 
                            let newsletter = await Newsletter.Newsletter.findByIdAndUpdate(obj.newsletterId, { $inc: { 'sentEmails': 1 }})
                            console.log(`Email sent to ${item.email} at ${new Date().toISOString()}`);
                        }
                    });
                }
            });
    
        } catch (e) {
            console.log(e);
        }
    }

}


export default routes;

