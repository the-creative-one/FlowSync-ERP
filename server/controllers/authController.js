// Authentication controller that handles registration, email verification, login, and password recovery.

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

// Email verification settings.
const VERIFICATION_CODE_EXPIRY = 3 * 60 * 1000;
const VERIFICATION_SEND_LIMIT = 3;
const VERIFICATION_SEND_LIMIT_PERIOD = 24 * 60 * 60 * 1000;

// Password reset settings.
const RESET_PASSWORD_EXPIRY = 15 * 60 * 1000;

// Password validation rule.
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

// Generate a new six-digit verification code.
const generateVerificationCode = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

// Check whether a password follows the required password policy.
const isValidPassword = (password) => {
  return PASSWORD_REGEX.test(password);
};

// Get the remaining seconds before the current OTP expires.
const getRemainingVerificationSeconds = (expireAt) => {
  if (!expireAt) {
    return 0;
  }

  const remainingMilliseconds = new Date(expireAt).getTime() - Date.now();

  return Math.max(0, Math.ceil(remainingMilliseconds / 1000));
};

// Check and reset the OTP send limit when the 24-hour period has ended.
const resetVerificationSendLimitIfNeeded = (user) => {
  if (
    user.emailVerificationSendCountResetAt &&
    new Date(user.emailVerificationSendCountResetAt).getTime() <= Date.now()
  ) {
    user.emailVerificationSendCount = 0;
    user.emailVerificationSendCountResetAt = undefined;
  }
};

// Verification email template.
const verificationEmailTemplate = (verificationCode, isResend = false) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />
  <title>${isResend ? "New Verification Code" : "Verify Your Email"}</title>
</head>

<body
  style="
    margin:0;
    padding:0;
    background:#F4F7FA;
    font-family:Arial, Helvetica, sans-serif;
  "
>
  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    style="padding:40px 20px;"
  >
    <tr>
      <td align="center">

        <table
          width="650"
          cellpadding="0"
          cellspacing="0"
          style="
            max-width:650px;
            background:#ffffff;
            border-radius:24px;
            overflow:hidden;
            box-shadow:0 10px 30px rgba(0,0,0,0.08);
          "
        >

          <tr>
            <td
              align="center"
              style="
                background:#0C2B4E;
                padding:40px 35px;
                border-bottom:4px solid #1D546C;
              "
            >
              <img
                src="https://res.cloudinary.com/dsbwtn2lu/image/upload/v1781344316/White-Logo_vpyxsw.png"
                alt="FlowSync ERP"
                width="220"
              />

              <p
                style="
                  margin-top:18px;
                  color:#CBD5E1;
                  font-size:14px;
                  letter-spacing:0.5px;
                "
              >
                Secure Email Verification
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:50px 45px;">

              <div style="text-align:center;">
                <img
                  src="https://res.cloudinary.com/dsbwtn2lu/image/upload/v1781344316/Favicon-Color_jgnbzp.png"
                  width="80"
                  alt="FlowSync"
                />
              </div>

              <h1
                style="
                  text-align:center;
                  color:#0C2B4E;
                  margin-top:25px;
                  margin-bottom:15px;
                  font-size:30px;
                  line-height:40px;
                "
              >
                ${isResend ? "New Verification Code" : "Verify Your Email"}
              </h1>

              <p
                style="
                  text-align:center;
                  color:#64748B;
                  font-size:16px;
                  line-height:26px;
                "
              >
                ${
                  isResend
                    ? "You requested a new verification code for your FlowSync ERP account."
                    : "Welcome to FlowSync ERP!"
                }
              </p>

              ${
                !isResend
                  ? `
              <p
                style="
                  text-align:center;
                  color:#64748B;
                  font-size:16px;
                  line-height:26px;
                "
              >
                Use the verification code below to complete
                your account registration.
              </p>
              `
                  : ""
              }

              <div
                style="
                  margin:35px auto;
                  background:#F8FAFC;
                  border:1px solid #E2E8F0;
                  border-radius:16px;
                  padding:25px;
                  text-align:center;
                  max-width:300px;
                "
              >
                <p
                  style="
                    margin:0 0 10px;
                    color:#64748B;
                    font-size:14px;
                  "
                >
                  Your verification code
                </p>

                <div
                  style="
                    color:#1D546C;
                    font-size:36px;
                    font-weight:bold;
                    letter-spacing:8px;
                  "
                >
                  ${verificationCode}
                </div>
              </div>

              <div
                style="
                  background:#FFF7ED;
                  border:1px solid #FED7AA;
                  border-radius:14px;
                  padding:18px;
                  text-align:center;
                  color:#9A3412;
                  font-size:15px;
                "
              >
                This verification code will expire in
                <strong>3 minutes</strong>.
              </div>

              <div
                style="
                  margin-top:30px;
                  background:#F0FDF4;
                  border:1px solid #BBF7D0;
                  border-radius:14px;
                  padding:20px;
                "
              >
                <h3
                  style="
                    color:#166534;
                    margin:0 0 8px;
                  "
                >
                  Didn't create this account?
                </h3>

                <p
                  style="
                    color:#475569;
                    line-height:24px;
                    margin:0;
                  "
                >
                  If you did not attempt to create a FlowSync ERP
                  account, you can safely ignore this email.
                </p>
              </div>

            </td>
          </tr>

          <tr>
            <td
              style="
                background:#0C2B4E;
                color:white;
                padding:30px;
                text-align:center;
              "
            >
              <p
                style="
                  margin:0;
                  font-size:18px;
                  font-weight:bold;
                "
              >
                FlowSync ERP
              </p>

              <p
                style="
                  margin-top:10px;
                  color:#CBD5E1;
                  font-size:14px;
                "
              >
                Smart. Fast. Connected.
              </p>

              <p
                style="
                  margin-top:20px;
                  color:#94A3B8;
                  font-size:13px;
                "
              >
                © ${new Date().getFullYear()} FlowSync ERP.
                All rights reserved.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
`;
};

// Password reset email template.
const passwordResetEmailTemplate = (resetUrl) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />
  <title>Password Reset</title>
</head>

<body
  style="
    margin:0;
    padding:0;
    background:#F4F7FA;
    font-family:Arial, Helvetica, sans-serif;
  "
>
  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    style="padding:40px 20px;"
  >
    <tr>
      <td align="center">

        <table
          width="650"
          cellpadding="0"
          cellspacing="0"
          style="
            max-width:650px;
            background:#ffffff;
            border-radius:24px;
            overflow:hidden;
            box-shadow:0 10px 30px rgba(0,0,0,0.08);
          "
        >

          <tr>
            <td
              align="center"
              style="
                background:#0C2B4E;
                padding:40px 35px;
                border-bottom:4px solid #1D546C;
              "
            >
              <img
                src="https://res.cloudinary.com/dsbwtn2lu/image/upload/v1781344316/White-Logo_vpyxsw.png"
                alt="FlowSync ERP"
                width="220"
              />

              <p
                style="
                  margin-top:18px;
                  color:#CBD5E1;
                  font-size:14px;
                  letter-spacing:0.5px;
                "
              >
                Secure Password Recovery
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:50px 45px;">

              <div style="text-align:center;">
                <img
                  src="https://res.cloudinary.com/dsbwtn2lu/image/upload/v1781344316/Favicon-Color_jgnbzp.png"
                  width="90"
                  alt="FlowSync"
                />
              </div>

              <h1
                style="
                  text-align:center;
                  color:#0C2B4E;
                  margin-top:25px;
                  margin-bottom:15px;
                  font-size:30px;
                  line-height:40px;
                "
              >
                Password Reset Request
              </h1>

              <p
                style="
                  text-align:center;
                  color:#64748B;
                  font-size:16px;
                  line-height:26px;
                "
              >
                We received a request to reset the password
                for your FlowSync ERP account.
              </p>

              <p
                style="
                  text-align:center;
                  color:#64748B;
                  font-size:17px;
                  line-height:28px;
                "
              >
                Click the button below to create a new password.
              </p>

              <div
                style="
                  text-align:center;
                  margin-top:40px;
                  margin-bottom:40px;
                "
              >
                <a
                  href="${resetUrl}"
                  style="
                    background:#1D546C;
                    color:white;
                    text-decoration:none;
                    padding:16px 38px;
                    border-radius:14px;
                    font-size:17px;
                    box-shadow:0 6px 18px rgba(29,84,108,0.25);
                    display:inline-block;
                    font-weight:bold;
                  "
                >
                  Reset Password
                </a>
              </div>

              <div
                style="
                  background:#F8FAFC;
                  border:1px solid #E2E8F0;
                  border-radius:14px;
                  padding:18px;
                  text-align:center;
                  color:#0C2B4E;
                  font-size:16px;
                "
              >
                This reset link will expire in
                <strong style="color:#2563EB;">
                  15 minutes
                </strong>
              </div>

              <div
                style="
                  margin-top:35px;
                  background:#F0FDF4;
                  border:1px solid #BBF7D0;
                  border-radius:14px;
                  padding:22px;
                "
              >
                <h3
                  style="
                    color:#166534;
                    margin:0 0 10px;
                  "
                >
                  Didn't request this?
                </h3>

                <p
                  style="
                    color:#475569;
                    line-height:24px;
                    margin:0;
                  "
                >
                  If you did not request a password reset,
                  you can safely ignore this email.
                  Your account will remain secure.
                </p>
              </div>

            </td>
          </tr>

          <tr>
            <td
              style="
                background:#0C2B4E;
                color:white;
                padding:30px;
                text-align:center;
              "
            >
              <p
                style="
                  margin:0;
                  font-size:18px;
                  font-weight:bold;
                "
              >
                FlowSync ERP
              </p>

              <p
                style="
                  margin-top:10px;
                  color:#CBD5E1;
                  font-size:14px;
                "
              >
                Smart. Fast. Connected.
              </p>

              <p
                style="
                  margin-top:20px;
                  color:#94A3B8;
                  font-size:13px;
                "
              >
                © ${new Date().getFullYear()} FlowSync ERP.
                All rights reserved.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
`;
};

// Register a new user or restart verification for an unverified user.
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    // Validate password before doing any email or database work.
    if (!isValidPassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    let user = await User.findOne({
      email: normalizedEmail,
    });

    // A verified account cannot be registered again.
    if (user && user.isEmailVerified) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // If an unverified account already exists, allow the user to continue
    // registration instead of blocking them permanently.
    if (user && !user.isEmailVerified) {
      resetVerificationSendLimitIfNeeded(user);

      const remainingSeconds = getRemainingVerificationSeconds(
        user.emailVerificationExpire,
      );

      // The existing OTP is still valid.
      if (remainingSeconds > 0) {
        return res.status(429).json({
          message:
            "A verification code has already been sent. Please wait until it expires before requesting a new code.",
          retryAfter: remainingSeconds,
        });
      }

      // Check the 24-hour send limit.
      if (user.emailVerificationSendCount >= VERIFICATION_SEND_LIMIT) {
        const resetAt = user.emailVerificationSendCountResetAt;

        return res.status(429).json({
          message:
            "You have reached the verification code limit. Please try again later.",
          retryAt: resetAt,
        });
      }
    }

    // Set permissions based on the selected role.
    let defaultPermissions = {};

    if (role === "admin" || role === "manager") {
      defaultPermissions = {
        canCreateOrders: true,
        canUpdateOrders: true,
        canDeleteOrders: true,
        canManageEmployees: true,
        canViewAdvancedAnalytics: true,
        canExportReports: true,
        canAccessSettings: true,
      };
    } else {
      defaultPermissions = {
        canCreateOrders: false,
        canUpdateOrders: false,
        canDeleteOrders: false,
        canManageEmployees: false,
        canViewAdvancedAnalytics: false,
        canExportReports: false,
        canAccessSettings: false,
      };
    }

    // Generate a new verification code.
    const verificationCode = generateVerificationCode();

    const verificationExpire = new Date(Date.now() + VERIFICATION_CODE_EXPIRY);

    // Hash the verification code before storing it.
    const hashedVerificationCode = await bcrypt.hash(verificationCode, 10);

    // Send the email before changing the database.
    await sendEmail({
      to: normalizedEmail,
      subject: "Verify Your FlowSync ERP Account",
      html: verificationEmailTemplate(verificationCode),
    });

    // Update an existing unverified user.
    if (user) {
      user.name = name.trim();
      user.password = await bcrypt.hash(password, 10);
      user.role = role || user.role;
      user.permissions = defaultPermissions;

      user.emailVerificationCode = hashedVerificationCode;
      user.emailVerificationExpire = verificationExpire;
      user.emailVerificationLastSentAt = new Date();

      resetVerificationSendLimitIfNeeded(user);

      user.emailVerificationSendCount =
        (user.emailVerificationSendCount || 0) + 1;

      if (!user.emailVerificationSendCountResetAt) {
        user.emailVerificationSendCountResetAt = new Date(
          Date.now() + VERIFICATION_SEND_LIMIT_PERIOD,
        );
      }

      await user.save();

      console.log(`Verification restarted for unverified user: ${user.email}`);

      return res.status(201).json({
        message: "Verification code sent to your email",
        email: normalizedEmail,
      });
    }

    // Create a new user after Brevo accepts the email.
    user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: await bcrypt.hash(password, 10),
      role,
      permissions: defaultPermissions,

      isEmailVerified: false,

      emailVerificationCode: hashedVerificationCode,
      emailVerificationExpire: verificationExpire,
      emailVerificationLastSentAt: new Date(),
      emailVerificationSendCount: 1,
      emailVerificationSendCountResetAt: new Date(
        Date.now() + VERIFICATION_SEND_LIMIT_PERIOD,
      ),
    });

    console.log(
      `Verification email sent and unverified user created: ${user.email}`,
    );

    return res.status(201).json({
      message: "Verification code sent to your email",
      email: normalizedEmail,
    });
  } catch (error) {
    console.error("Registration Error:", error);

    return res.status(500).json({
      message: error.message || "Unable to complete registration",
    });
  }
};

//Verify a user's email using the six-digit verification code
const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        message: "Email and verification code are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        message: "Email is already verified",
      });
    }

    //Check verification code expiry

    if (
      !user.emailVerificationExpire ||
      user.emailVerificationExpire.getTime() < Date.now()
    ) {
      return res.status(400).json({
        message: "Verification code has expired. Please request a new code.",
      });
    }

    //Check verification code

    const isCodeValid = await bcrypt.compare(
      code.trim(),
      user.emailVerificationCode,
    );

    if (!isCodeValid) {
      return res.status(400).json({
        message: "Invalid verification code",
      });
    }

    //Verify email

    user.isEmailVerified = true;

    user.emailVerificationCode = undefined;
    user.emailVerificationExpire = undefined;

    await user.save();

    //Create login token after successful verification

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    //Return safe user data

    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      avatar: user.avatar,
      avatarType: user.avatarType,
      avatarSeed: user.avatarSeed,
    };

    return res.status(200).json({
      message: "Email verified successfully",
      token,
      user: safeUser,
    });
  } catch (error) {
    console.error("Email Verification Error:", error);

    return res.status(500).json({
      message: error.message || "Unable to verify email",
    });
  }
};

// Send another verification code after the current code expires.
const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        message: "Email is already verified",
      });
    }

    resetVerificationSendLimitIfNeeded(user);

    // Do not allow another OTP while the current one is active.
    const remainingSeconds = getRemainingVerificationSeconds(
      user.emailVerificationExpire,
    );

    if (remainingSeconds > 0) {
      return res.status(429).json({
        message:
          "Your current verification code is still active. Please wait until it expires before requesting a new code.",
        retryAfter: remainingSeconds,
      });
    }

    // Do not allow more than three OTP emails in 24 hours.
    if (user.emailVerificationSendCount >= VERIFICATION_SEND_LIMIT) {
      return res.status(429).json({
        message:
          "You have reached the verification code limit. Please try again later.",
        retryAt: user.emailVerificationSendCountResetAt,
      });
    }

    // Generate a new verification code.
    const verificationCode = generateVerificationCode();

    const verificationExpire = new Date(Date.now() + VERIFICATION_CODE_EXPIRY);

    const hashedVerificationCode = await bcrypt.hash(verificationCode, 10);

    // Send the email before updating the database.
    await sendEmail({
      to: normalizedEmail,
      subject: "Your New FlowSync ERP Verification Code",
      html: verificationEmailTemplate(verificationCode, true),
    });

    user.emailVerificationCode = hashedVerificationCode;
    user.emailVerificationExpire = verificationExpire;
    user.emailVerificationLastSentAt = new Date();

    user.emailVerificationSendCount =
      (user.emailVerificationSendCount || 0) + 1;

    if (!user.emailVerificationSendCountResetAt) {
      user.emailVerificationSendCountResetAt = new Date(
        Date.now() + VERIFICATION_SEND_LIMIT_PERIOD,
      );
    }

    await user.save();

    console.log(`New verification code sent: ${user.email}`);

    return res.status(200).json({
      message: "New verification code sent",
      retryAfter: VERIFICATION_CODE_EXPIRY / 1000,
    });
  } catch (error) {
    console.error("Resend Verification Error:", error);

    return res.status(500).json({
      message: error.message || "Unable to resend verification code",
    });
  }
};

// Log a verified user into the application.
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      permissions: user.permissions,

      avatar: user.avatar,
      avatarType: user.avatarType,
      avatarSeed: user.avatarSeed,
    };

    return res.status(200).json({
      message: "Login successful",
      token,
      user: safeUser,
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      message: error.message || "Unable to login",
    });
  }
};

// Send a password reset email.
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;

    user.resetPasswordExpire = Date.now() + RESET_PASSWORD_EXPIRY;

    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "Reset Your FlowSync ERP Password",
      html: passwordResetEmailTemplate(resetUrl),
    });

    return res.status(200).json({
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);

    return res.status(500).json({
      message: error.message || "Unable to send password reset email",
    });
  }
};

// Reset the user's password using the reset token.
const resetPassword = async (req, res) => {
  try {
    const resetToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpire: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    // Apply the same password policy used during registration.
    if (!isValidPassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      });
    }

    user.password = await bcrypt.hash(password, 10);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);

    return res.status(500).json({
      message: error.message || "Unable to reset password",
    });
  }
};

// Return the currently authenticated user's information.
const getMe = async (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    console.error("Get Me Error:", error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

// Export authentication controllers.
module.exports = {
  registerUser,
  verifyEmail,
  resendVerificationCode,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
};
