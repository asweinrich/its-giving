// testEmail.js

const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const OAuth2 = google.auth.OAuth2;

// Load environment variables
require('dotenv').config();


const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground' // Redirect URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.NEXT_PUBLIC_GMAIL_REFRESH_TOKEN,
});

async function testSendEmail() { 
  console.log('variable: ', process.env.NEXT_PUBLIC_CONVERTKIT_API_KEY)
  try {
    const accessToken = await oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.VERIFICATION_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.NEXT_PUBLIC_GMAIL_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from: `"It’s Giving" <${process.env.VERIFICATION_USER}>`,
      to: process.env.VERIFICATION_USER, // Test email to yourself
      subject: 'Test Email',
      text: 'This is a test email from the Nodemailer setup.',
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent:', result);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}

testSendEmail();
