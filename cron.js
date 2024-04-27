const cron = require('node-cron');
const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const catchAsync = require('./utils/catchAsync');
const Notification = require('./models/notificationModel');

const fs = require('fs');

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful!'));

const cronMail = async () => {
  const notification = await Notification.find({
    isSent: false,
    externalNotifRequired: true,
  });
  if (notification) {
    console.log('Success');
  }
  if (notification.length === 0) {
    console.log('All mails are sent');
  }
  console.log(notification.length);
  notification.forEach((element) => {
    const html = pug.renderFile(
      `${__dirname}/./views/emails/${element.mailType}.pug`
    );
    const from = `Sulaiman Oladimeji <${process.env.EMAIL_FROM2}>`;
    const mailOptions = {
      from: from,
      to: element.receiver,
      subject: element.subject,
      html: html,
      text: htmlToText.fromString(html),
    };
    function transporter() {
      if (process.env.NODE_ENV === 'production') {
        // Sendgrid
        return nodemailer.createTransport({
          //service: 'SendGrid',`
          host: process.env.EMAIL_HOST,
          port: 2525,
          auth: {
            user: process.env.MAILTRAP_USERNAME,
            pass: process.env.MAILTRAP_PASSWORD,
          },
        });
      }

      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 2525,
        auth: {
          user: process.env.MAILTRAP_USERNAME,
          pass: process.env.MAILTRAP_PASSWORD,
        },
      });
    }

    transporter().sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        Notification.findByIdAndUpdate(element._id, {
          noOfTrials: element.noOfTrials + 1,
        });
      }
      console.log(`Email sent: ${info.response}`);
      // console.log(element._id);
      Notification.findByIdAndUpdate(
        element._id,
        { isSent: true, noOfTrials: element.noOfTrials + 1 },
        function (err, docs) {
          if (err) {
            console.log(err);
          } else {
            console.log('Updated User : ', docs);
          }
        }
      );
    });
  });
};

cron.schedule('* * * * *', cronMail);

// cron.schedule('* * * * *', Test
// );
