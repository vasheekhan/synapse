import bcrypt from "bcrypt";
import { Response } from "express";

import prisma from "../../config/database";
import { env } from "../../config/env";

import { RegisterDto } from "../../dto/auth/register.dto";
import { VerifyRegisterDto } from "../../dto/auth/verify-register.dto";
import { AuthResponseDto } from "../../dto/auth/auth-response.dto";

import { generateOtp } from "../../utils/otp";
import { sendOtpMail } from "../../utils/sendmail";

import sessionService from "./session.service";

class RegisterService {
  async register(data: RegisterDto) {
    console.log("\n========== REGISTER START ==========");
    console.log("📧 Email:", data.email);
    console.log("👤 Name:", data.name);
    console.log("🕐 Time:", new Date().toISOString());

    // 1. Check if user already exists
    console.log("1️⃣ Checking if user already exists...");

    let existingUser;

    try {
      existingUser = await prisma.user.findUnique({
        where: {
          email: data.email,
        },
      });

      console.log("✅ User lookup completed");
      console.log("Existing user:", existingUser ? "YES" : "NO");
    } catch (error) {
      console.error("❌ User lookup failed:", error);
      throw error;
    }

    if (existingUser) {
      console.log("❌ Registration stopped: user already exists");
      throw new Error("User already exists");
    }

    // 2. Hash password
    console.log("2️⃣ Hashing password...");

    let passwordHash: string;

    try {
      passwordHash = await bcrypt.hash(
        data.password,
        Number(env.BCRYPT_SALT_ROUNDS)
      );

      console.log("✅ Password hashed");
    } catch (error) {
      console.error("❌ Password hashing failed:", error);
      throw error;
    }

    // 3. Generate OTP
    console.log("3️⃣ Generating OTP...");

    const otp = generateOtp();

    console.log("✅ OTP generated:", otp);

    // 4. Hash OTP
    console.log("4️⃣ Hashing OTP...");

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

    // 5. Delete previous OTP
    console.log("5️⃣ Deleting previous OTP...");

    try {
      const deleted = await prisma.verificationCode.deleteMany({
        where: {
          email: data.email,
        },
      });

      console.log(
        `✅ Previous OTP deleted. Count: ${deleted.count}`
      );
    } catch (error) {
      console.error("❌ Failed to delete previous OTP:", error);
      throw error;
    }

    // 6. Save verification
    console.log("6️⃣ Saving OTP verification to database...");

    try {
      const verification = await prisma.verificationCode.create({
        data: {
          email: data.email,
          name: data.name,
          passwordHash,
          codeHash,
          type: "REGISTER",
          expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
      });

      console.log("✅ OTP saved to database");
      console.log("Verification ID:", verification.id);
      console.log(
        "OTP expires:",
        verification.expiresAt.toISOString()
      );
    } catch (error) {
      console.error("❌ Failed to save OTP:", error);
      throw error;
    }

    // 7. Send email
    console.log("7️⃣ Preparing to send OTP email...");
    console.log("📧 Recipient:", data.email);
    console.log("📧 Calling sendOtpMail()...");

    try {
      const mailResult = await sendOtpMail(
        data.email,
        data.name,
        otp
      );

      console.log("✅ sendOtpMail() completed");
      console.log("📨 Mail result:", mailResult);
      console.log("📨 OTP email sent successfully");
    } catch (error) {
      console.error("❌ EMAIL SENDING FAILED");

      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error name:", error.name);
        console.error("Error stack:", error.stack);
      } else {
        console.error("Unknown error:", error);
      }

      throw new Error(
        `Failed to send OTP email: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }

    console.log("========== REGISTER SUCCESS ==========\n");

    return {
      success: true,
      message: "OTP sent successfully",
    };
  }

  async verifyRegister(
    data: VerifyRegisterDto,
    res: Response
  ): Promise<AuthResponseDto> {
    console.log("\n========== VERIFY REGISTER START ==========");
    console.log("📧 Email:", data.email);
    console.log("🔢 OTP received:", data.otp);

    // 1. Find verification code
    console.log("1️⃣ Looking for verification code...");

    let verification;

    try {
      verification = await prisma.verificationCode.findFirst({
        where: {
          email: data.email,
          type: "REGISTER",
        },
      });

      console.log(
        verification
          ? "✅ Verification code found"
          : "❌ Verification code not found"
      );
    } catch (error) {
      console.error(
        "❌ Failed to find verification code:",
        error
      );
      throw error;
    }

    if (!verification) {
      throw new Error("OTP not found");
    }

    // 2. Check OTP
    console.log("2️⃣ Comparing OTP...");

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

    // 3. Check expiration
    console.log("3️⃣ Checking OTP expiration...");

    if (verification.expiresAt < new Date()) {
      console.log("❌ OTP has expired");
      throw new Error("OTP has expired");
    }

    console.log("✅ OTP is still valid");

    // 4. Create user
    console.log("4️⃣ Creating user...");

    let user;

    try {
      user = await prisma.user.create({
        data: {
          email: verification.email,
          name: verification.name,
          passwordHash: verification.passwordHash,
        },
      });

      console.log("✅ User created");
      console.log("User ID:", user.id);
    } catch (error) {
      console.error("❌ User creation failed:", error);
      throw error;
    }

    // 5. Delete verification code
    console.log("5️⃣ Deleting verification code...");

    try {
      await prisma.verificationCode.delete({
        where: {
          id: verification.id,
        },
      });

      console.log("✅ Verification code deleted");
    } catch (error) {
      console.error(
        "❌ Failed to delete verification code:",
        error
      );
      throw error;
    }

    // 6. Create session
    console.log("6️⃣ Creating session...");

    try {
      const session = await sessionService.createSession(user);

      console.log("✅ Session created");
      console.log("========== VERIFY REGISTER SUCCESS ==========\n");

      return session;
    } catch (error) {
      console.error("❌ Session creation failed:", error);
      throw error;
    }
  }
}

export default new RegisterService();