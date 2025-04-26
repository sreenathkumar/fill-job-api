import sendEmail from "@/config/email";


export const sendResetPasswordEmail = async ({ email, name, link }: { email: string, name: string, link: string }) => {
  try {
    //send the email
    const isSuccess = await sendEmail({
      to: email,
      subject: 'Reset your password',
      html: `<html><body>
          <div>
            <h2>Password Reset</h2>
            <p>Hi ${name},</p>
            <p>We received a request to reset your password. Click the link below to set a new password:</p>
            <a href="${link}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
        </body>
      </html>`
    });

    return isSuccess;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log('error in sendResetPasswordEmail: ', error.message);
    return false;
  }
}

/** 
 * This function sends a verification email to the user with a link to verify their email address.
 * 
 * @param name - Name of the user to whom the email is sent.
 * @param email - The email address to which the email will be sent.
 * @param link - The link to verify the email address.
 * @returns Returns true if the email was sent successfully, false otherwise.
 * 
 */
export async function sendVerificationEmail({ email, name, link }: { email: string, name: string, link: string }) {
  try {
    //send the email
    const isSuccess = await sendEmail({
      to: email,
      subject: 'Please verify your email address',
      html: `<html><body>
          <div>
            <h2>Email Verification</h2>
            <p>Hi ${name},</p>
            <p>Thank you for signing up! Please verify your email address by clicking the link below:</p>
            <a href="${link}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
            <p>If you did not create an account, please ignore this email.</p>
          </div>
        </body>
      </html>
          `
    });

    return isSuccess;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log('error in sendVerificationEmail: ', error.message);
    return false;
  }
}

/**
 * This function sends an OTP email to the user for verification.
 * 
 * @param email - Email address in which the OTP will be sent.
 * @param otp - OTP to be sent in the email.
 * @returns Returns true if the email was sent successfully, false otherwise.
 * 
 */
export async function sendOTPMail({ email, otp, expiryTime }: { email: string, otp: string, expiryTime: string }): Promise<boolean> {
  try {
    //send the email
    const isSuccess = await sendEmail({
      to: email,
      subject: 'Please verify your email address',
      html: ` <html>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Your Login Code</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 5px;
            }
            .code {
              font-size: 32px;
              font-weight: bold;
              text-align: center;
              margin: 20px 0;
              padding: 10px;
              background-color: #f0f0f0;
              border-radius: 5px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Your One-Time Password</h2>
            <p>Hello,</p>
            <p>You've requested to log in to your account. Please use the following one-time password (OTP) to complete your login:</p>
            <div class="code">${otp}</div>
            <p>This code will expire in ${expiryTime} for security reasons. If you didn't request this code, please ignore this email.</p>
            <p>Thank you for using our service!</p>
            <p>Best regards,<br />The CoseCloset Team</p>
          </div>
        </body>
      </html>
          `
    });

    return isSuccess;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log('error in sendOTPMail: ', error.message);
    return false;
  }
}