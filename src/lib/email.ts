import nodemailer from 'nodemailer';
import { google } from 'googleapis';

const OAuth2 = google.auth.OAuth2;

// Initialize OAuth2 client with environment variables
const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground' // Redirect URI used when generating the refresh token
);

oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

export async function sendVerificationEmail(to: string, token: string, userId: string) {
  try {
    // Generate access token
    const accessToken = await oauth2Client.getAccessToken();

    // Set up Nodemailer with Gmail OAuth2
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.VERIFICATION_USER, // Primary account email
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken: accessToken.token, // Access token generated from refresh token
      },
    });

    // Create the verification URL
    const verificationUrl = `https://itsgiving.org/api/verify-email?token=${token}`;

    // Define email options
    const mailOptions = {
      from: `"It’s Giving Verification" <verify@itsgiving.org>`, // Show alias as "from" email
      to,
      subject: 'Verify Your Email Address',
      html: `
        <h2>Welcome to It's Giving!</h2>
        <p>To complete your registration, please verify your email by clicking the link below:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>If you didn’t sign up, please ignore this email.</p>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent to:', to);
  } catch (error) {
    console.error('Failed to send verification email:', error);
  }
}
