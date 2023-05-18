const axios = require('axios');
const nodemailer = require('nodemailer');

const websiteUrl = "http://hie2.moh.gov.zm:8088/login/";

// Configuration for email notifications
const emailConfig = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: '',
    pass: ''
  }
};

// Counter for consecutive failures
let consecutiveFailures = 0;

function checkWebsite() {
  axios.get(websiteUrl)
    .then(response => {
      if (response.status === 200) {
        console.log(`[${new Date().toLocaleString()}] The website ${websiteUrl} is online.`);
        consecutiveFailures = 0; // Reset the counter
        setTimeout(checkWebsite, 10 * 60 * 1000); // Schedule next check after 10 minutes
      } else {
        console.log(`[${new Date().toLocaleString()}] The website ${websiteUrl} returned a non-200 status code: ${response.status}`);
        consecutiveFailures++;
        if (consecutiveFailures === 3) {
          sendEmailNotification(); // Send email notification after 3 consecutive failures
        } else {
          setTimeout(checkWebsite, 10 * 1000); // Schedule next check after 10 seconds
        }
      }
    })
    .catch(error => {
      console.log(`[${new Date().toLocaleString()}] An error occurred while accessing ${websiteUrl}: ${error.message}`);
      consecutiveFailures++;
      if (consecutiveFailures === 3) {
        sendEmailNotification(); // Send email notification after 3 consecutive failures
      } else {
        setTimeout(checkWebsite, 10 * 1000); // Schedule next check after 10 seconds
      }
    });
}

function sendEmailNotification() {
  const transporter = nodemailer.createTransport(emailConfig);

  const mailOptions = {
    from: '',
    to: ' ',
    subject: 'Website Down Notification',
    text: `The website ${websiteUrl} is down. Please investigate.`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(`Failed to send email notification: ${error}`);
    } else {
      console.log(`Email notification sent: ${info.response}`);
    }
  });
}

checkWebsite();
