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

    // Check which table the user belongs to
    const superAdmin = await prisma.superAdmin.findUnique({ where: { email } });
    const user = await prisma.user.findUnique({ where: { email } });

    if (superAdmin) {
      // Update SuperAdmin password
      await prisma.superAdmin.update({
        where: { email },
        data: { password: hashedPassword },
      });
    } else if (user) {
      // Update User password
      await prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
      });
    } else {
      return Response.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return Response.json({
      message: "Password reset successful",
    });
  } catch (err) {
    console.error("Reset password error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}