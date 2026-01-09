import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { email, newPassword } = await req.json();

    if (!email || !newPassword) {
      return Response.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return Response.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    return Response.json({
      message: "Password reset successful",
    });
  } catch (err) {
    console.error("Reset password error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
