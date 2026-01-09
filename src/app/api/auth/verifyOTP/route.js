import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return Response.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    const record = await prisma.passwordResetOTP.findFirst({
      where: {
        email,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!record) {
      return Response.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    const isValid = await bcrypt.compare(otp, record.otpHash);

    if (!isValid) {
      return Response.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // Mark OTP as used
    await prisma.passwordResetOTP.update({
      where: { id: record.id },
      data: { used: true },
    });

    // ✅ Return email for redirect
    return Response.json({ email: record.email });
  } catch (err) {
    console.error("OTP verification error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
