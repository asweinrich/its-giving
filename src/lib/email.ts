import nodemailer from 'nodemailer';
import { google } from 'googleapis';


export async function sendVerificationEmail(to: string, token: string, userId: string) {
  try {
    // Generate access token

    // Set up Nodemailer with Gmail OAuth2
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NEXT_PUBLIC_VERIFICATION_USER,
        pass: 'ucsg awfb nxfo cibc',
      },
    });

    // Create the verification URL
    const verificationUrl = `http://localhost:3000/api/verify-email?token=${token}`;

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
