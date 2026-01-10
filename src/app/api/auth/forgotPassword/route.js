// src/app/api/auth/forgotPassword/route.js
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    // Check both SuperAdmin and User tables
    const superAdmin = await prisma.superAdmin.findUnique({ where: { email } });
    const user = await prisma.user.findUnique({ where: { email } });

    // Security best practice: always respond the same even if account doesn't exist
    if (!superAdmin && !user) {
      return Response.json({
        message: "If an account exists, an OTP has been sent",
      });
    }

    // Invalidate previous OTPs for this email
    await prisma.passwordResetOTP.updateMany({
      where: { email, used: false },
      data: { used: true },
    });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP before saving
    const otpHash = await bcrypt.hash(otp, 10);

    // Expiry in 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.passwordResetOTP.create({
      data: {
        email,
        otpHash,
        expiresAt,
      },
    });

    // --- Nodemailer Setup ---
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email Content
    const mailOptions = {
      from: `"RSA Construction" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Password Reset OTP",
      html: `
        <p>Hello,</p>
        <p>You requested to reset your password. Your OTP is:</p>
        <h2>${otp}</h2>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <br />
        <p>RSA Construction</p>
      `,
    };

    // Send Email
    await transporter.sendMail(mailOptions);

    return Response.json({
      message: "If an account exists, an OTP has been sent",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}