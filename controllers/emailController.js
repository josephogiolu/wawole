const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');
//const mongoose = require('mongoose');
// const fs = require('fs');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
//const Email = require('../utils/email');
const Notification = require('../models/notificationModel');

exports.sendMail = catchAsync(async (req, res, next) => {
  const notification = await Notification.findOne({
    mailType: req.body.mailType,
    externalNotifRequired: true,
    receiver: req.params.userName,
  });
  console.log(notification.receiver);

  if (notification.isSent === true) {
    res.send('mail has already been sent');
  }
  const html = pug.renderFile(
    `${__dirname}/../views/emails/${req.body.mailType}.pug`
  );
  const from = `Sulaiman Oladimeji <${process.env.EMAIL_FROM2}>`;
  const mailOptions = {
    from: from,
    to: notification.receiver,
    subject: notification.subject,
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
      Notification.findByIdAndUpdate(notification._id, {
        noOfTrials: notification.noOfTrials + 1,
      });
      res.send(error);
    }
    console.log(`Email sent: ${info.response}`);
    Notification.findByIdAndUpdate(
      notification._id,
      { isSent: true, noOfTrials: notification.noOfTrials + 1 },
      function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          console.log('Updated User : ', docs);
        }
      }
    );
    res.send(`Email sent: ${info.response}`);
  });
});
