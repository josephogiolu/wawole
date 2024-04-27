const fetch = require('node-fetch');
const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');
const pug = require('pug');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.userName;
    this.firstName = user.firstName;
    this.url = url;
    //this.from = `Rasheed Arije <${process.env.EMAIL_FROM}>`;
    this.from = `Sulaiman Oladimeji <${process.env.EMAIL_FROM2}>`;

  }

  newTransport() {
    console.log(process.env.NODE_ENV);
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid
      return nodemailer.createTransport({
        //service: 'SendGrid',
        host: 'smtp.mailtrap.io',
        port: 2525,
        auth: {
          user: process.env.MAILTRAP_USERNAME,
          pass: process.env.MAILTRAP_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    //  1) Render HTML based on a pug template
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );
    // 2) Define email optionsstep
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
      //html:
    };
    // 3) Create a transport and send email
    this.newTransport().sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });
  }

  async sendWelcome() {
    await this.send('Welcome', 'Welcome to the Wawole Family!!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)!!'
    );
  }

  async verifyMail() {
    await this.send(
      'verifyMail',
      'This is Your verification token (valid for only 10 minutes)!!'
    );
  }

  async createNotif(mailType, subject) {
    const url = 'http://localhost:8090/api/v1/notifications';
    const data = {
      receiver: this.to,
      content: this.firstName,
      subject,
      mailType,
    };
    console.log(data);

    const fetchResult = await fetch(url, {
      method: 'post',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
    // const response = await fetchResult;
    const jsonData = await fetchResult.json();
    console.log(`this is the reponse${jsonData}`);
  }

  catch(e) {
    throw Error(e);
  }
};
