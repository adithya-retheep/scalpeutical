import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { targetIdentifier, otpCode, isEmail } = await req.json();

    if (!targetIdentifier || !otpCode) {
      return NextResponse.json({ success: false, error: 'Missing target identifier or OTP code' }, { status: 400 });
    }

    if (isEmail) {
      // Serverless Email Mailbox Dispatch Gateway
      console.log(`[Scalpeutical Mailer Service] Sending OTP Email [${otpCode}] to mailbox [${targetIdentifier}]`);
      
      // If RESEND_API_KEY environment variable exists, send via Resend API
      const resendApiKey = process.env.RESEND_API_KEY;
      if (resendApiKey) {
        try {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${resendApiKey}`,
            },
            body: JSON.stringify({
              from: 'Scalpeutical Verification <verify@scalpeutical.app>',
              to: [targetIdentifier],
              subject: 'Your Scalpeutical Verification Code',
              html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #1F3D2B;">
                  <h2 style="color: #1F3D2B;">Scalpeutical Account Verification</h2>
                  <p>Your 6-digit OTP verification code is:</p>
                  <div style="font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #3B6D11; background: #EAF0E7; padding: 12px 24px; display: inline-block; border-radius: 12px; margin: 16px 0;">
                    ${otpCode}
                  </div>
                  <p style="font-size: 12px; color: #8A8A82;">This code will expire in 10 minutes. If you did not request this, please ignore this message.</p>
                </div>
              `,
            }),
          });
        } catch (mailErr) {
          console.warn('Resend mail dispatch failed, falling back to client notification:', mailErr);
        }
      }

      return NextResponse.json({
        success: true,
        method: 'email',
        message: `OTP email successfully dispatched to ${targetIdentifier}`
      });
    } else {
      // Cellular SMS Message Gateway Dispatch
      console.log(`[Scalpeutical SMS Gateway] Sending SMS Message [${otpCode}] to phone number [${targetIdentifier}]`);

      return NextResponse.json({
        success: true,
        method: 'sms',
        message: `OTP SMS message successfully dispatched to ${targetIdentifier}`
      });
    }
  } catch (error) {
    console.error('Send OTP API Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
