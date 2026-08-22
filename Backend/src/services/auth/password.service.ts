import bcrypt from "bcrypt";

import prisma from "../../config/database";
import { env } from "../../config/env";

import { ForgotPasswordDto } from "../../dto/auth/forgot-password.dto";
import { ResetPasswordDto } from "../../dto/auth/reset-password.dto";

import { generateOtp } from "../../utils/otp";
import { sendPasswordResetMail } from "../../utils/sendmail";

class PasswordService {
  async forgotPassword(data: ForgotPasswordDto) {
    console.log("\n==========================================");
    console.log("🔐 FORGOT PASSWORD START");
    console.log("==========================================");
    console.log("📧 Email:", data.email);
    console.log("🕐 Time:", new Date().toISOString());

    console.log("\n1️⃣ Finding user...");

    let user;

    try {
      user = await prisma.user.findUnique({
        where: {
          email: data.email,
        },
      });

      console.log(user ? "✅ User found" : "❌ User not found");
    } catch (error) {
      console.error("❌ Database user lookup failed:", error);
      throw error;
    }

    if (!user) {
      throw new Error("User not found");
    }

    console.log("👤 User:", user.name);

    console.log("\n2️⃣ Generating OTP...");

    const otp = generateOtp();

    console.log("✅ OTP generated:", otp);

    console.log("\n3️⃣ Hashing OTP...");

    let codeHash: string;

    try {
      codeHash = await bcrypt.hash(
        otp,
        Number(env.BCRYPT_SALT_ROUNDS)
      );

      console.log("✅ OTP hashed");
    } catch (error) {
      console.error("❌ OTP hashing failed:", error);
      throw error;
    }

    console.log("\n4️⃣ Removing previous password reset OTP...");

    try {
      const deleted = await prisma.verificationCode.deleteMany({
        where: {
          email: data.email,
          type: "FORGOT_PASSWORD",
        },
      });

      console.log(`✅ Previous OTP records deleted: ${deleted.count}`);
    } catch (error) {
      console.error("❌ Failed to delete previous OTP:", error);
      throw error;
    }

    console.log("\n5️⃣ Saving OTP to database...");

    let verification;

    try {
      verification = await prisma.verificationCode.create({
        data: {
          email: data.email,
          name: user.name,
          passwordHash: user.passwordHash ?? "",
          codeHash,
          type: "FORGOT_PASSWORD",
          expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
      });

      console.log("✅ OTP saved to database");
      console.log("🆔 Verification ID:", verification.id);
      console.log(
        "⏰ Expires:",
        verification.expiresAt.toISOString()
      );
    } catch (error) {
      console.error("❌ Failed to save OTP:", error);
      throw error;
    }

    console.log("\n6️⃣ Sending password reset email...");
    console.log("📧 To:", data.email);
    console.log("👤 Name:", user.name);

    try {
      const mailResult = await sendPasswordResetMail(
        data.email,
        user.name,
        otp
      );

      console.log("✅ Password reset email sent successfully");
      console.log("📨 Mail result:", mailResult);
    } catch (error) {
      console.error("\n❌ PASSWORD RESET EMAIL FAILED");

      if (error instanceof Error) {
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      } else {
        console.error("Unknown error:", error);
      }

      throw new Error(
        `Failed to send password reset email: ${
          error instanceof Error
            ? error.message
            : "Unknown email error"
        }`
      );
    }

    console.log("\n==========================================");
    console.log("✅ FORGOT PASSWORD COMPLETED");
    console.log("==========================================\n");

    return {
      success: true,
      message: "OTP sent successfully",
    };
  }

  async resetPassword(data: ResetPasswordDto) {
    console.log("\n==========================================");
    console.log("🔑 RESET PASSWORD START");
    console.log("==========================================");
    console.log("📧 Email:", data.email);
    console.log("🔢 OTP:", data.otp);

    console.log("\n1️⃣ Finding password reset OTP...");

    let verification;

    try {
      verification = await prisma.verificationCode.findFirst({
        where: {
          email: data.email,
          type: "FORGOT_PASSWORD",
        },
      });

      console.log(
        verification
          ? "✅ Verification record found"
          : "❌ Verification record not found"
      );
    } catch (error) {
      console.error(
        "❌ Failed to find verification record:",
        error
      );
      throw error;
    }

    if (!verification) {
      throw new Error("OTP not found");
    }

    console.log("\n2️⃣ Comparing OTP...");

    let isValidOtp: boolean;

    try {
      isValidOtp = await bcrypt.compare(
        data.otp,
        verification.codeHash
      );

      console.log(
        isValidOtp
          ? "✅ OTP is valid"
          : "❌ OTP is invalid"
      );
    } catch (error) {
      console.error("❌ OTP comparison failed:", error);
      throw error;
    }

    if (!isValidOtp) {
      throw new Error("Invalid OTP");
    }

    console.log("\n3️⃣ Checking OTP expiration...");

    if (verification.expiresAt < new Date()) {
      console.log("❌ OTP has expired");
      throw new Error("OTP has expired");
    }

    console.log("✅ OTP is still valid");

    console.log("\n4️⃣ Hashing new password...");

    let passwordHash: string;

    try {
      passwordHash = await bcrypt.hash(
        data.newPassword,
        Number(env.BCRYPT_SALT_ROUNDS)
      );

      console.log("✅ New password hashed");
    } catch (error) {
      console.error("❌ New password hashing failed:", error);
      throw error;
    }

    console.log("\n5️⃣ Updating user password...");

    try {
      await prisma.user.update({
        where: {
          email: data.email,
        },
        data: {
          passwordHash,
        },
      });

      console.log("✅ Password updated successfully");
    } catch (error) {
      console.error("❌ Failed to update password:", error);
      throw error;
    }

    console.log("\n6️⃣ Deleting used OTP...");

    try {
      await prisma.verificationCode.delete({
        where: {
          id: verification.id,
        },
      });

      console.log("✅ OTP deleted");
    } catch (error) {
      console.error("❌ Failed to delete OTP:", error);
      throw error;
    }

    console.log("\n==========================================");
    console.log("✅ PASSWORD RESET SUCCESSFUL");
    console.log("==========================================\n");

    return {
      success: true,
      message: "Password reset successfully",
    };
  }
}

export default new PasswordService();