const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");


// REGISTER USER


const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const userExists = await User.findOne({
      email: normalizedEmail,
    });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let defaultPermissions = {};

    if (role === "admin") {
      defaultPermissions = {
        canCreateOrders: true,
        canUpdateOrders: true,
        canDeleteOrders: true,
        canManageEmployees: true,
        canViewAdvancedAnalytics: true,
        canExportReports: true,
        canAccessSettings: true,
      };
    } else if (role === "manager") {
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

    
    // Generate 6-digit verification code
    

    const verificationCode = crypto.randomInt(100000, 1000000).toString();

    
    // Code expires after 3 minutes
    

    const verificationExpire = new Date(Date.now() + 3 * 60 * 1000);

    
    // Send verification email FIRST
    //
    // We intentionally do NOT create the user yet.
    // If Resend fails, no user will be created.
    

    await sendEmail({
      to: normalizedEmail,
      subject: "Verify Your FlowSync ERP Account",
      html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0"
/>
<title>Verify Your Email</title>
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

          <!-- HEADER -->

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

          <!-- CONTENT -->

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
                Verify Your Email
              </h1>

              <p
                style="
                  text-align:center;
                  color:#64748B;
                  font-size:16px;
                  line-height:26px;
                "
              >
                Welcome to FlowSync ERP!
              </p>

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

              <!-- OTP -->

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

              <!-- EXPIRY -->

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

              <!-- SECURITY -->

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

          <!-- FOOTER -->

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
      `,
    });

    
    // ONLY CREATE THE USER AFTER EMAIL WAS ACCEPTED
    

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role,
      permissions: defaultPermissions,

      isEmailVerified: false,
      emailVerificationCode: verificationCode,
      emailVerificationExpire: verificationExpire,
    });

    console.log(`Verification email sent and user created: ${user.email}`);

    res.status(201).json({
      message: "Verification code sent to your email",
    });
  } catch (error) {
    console.error("Registration Error:", error);

    res.status(500).json({
      message: error.message || "Unable to send verification email",
    });
  }
};

// VERIFY EMAIL

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

    // Check whether code has expired
    if (
      !user.emailVerificationExpire ||
      user.emailVerificationExpire.getTime() < Date.now()
    ) {
      return res.status(400).json({
        message: "Verification code has expired. Please request a new code.",
      });
    }

    // Check code
    if (user.emailVerificationCode !== code.trim()) {
      return res.status(400).json({
        message: "Invalid verification code",
      });
    }

    // Verify account
    user.isEmailVerified = true;

    // Remove verification data
    user.emailVerificationCode = undefined;
    user.emailVerificationExpire = undefined;

    await user.save();

    res.status(200).json({
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Email Verification Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// RESEND VERIFICATION CODE

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

    // Generate new 6-digit code
    const verificationCode = crypto.randomInt(100000, 1000000).toString();

    const verificationExpire = new Date(Date.now() + 3 * 60 * 1000);

    user.emailVerificationCode = verificationCode;
    user.emailVerificationExpire = verificationExpire;

    await user.save();

    await sendEmail({
      to: user.email,
      subject: "Your New FlowSync ERP Verification Code",
      html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Verification Code</title>
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
                "
              >
                Email Verification
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:50px 45px;">

              <h1
                style="
                  text-align:center;
                  color:#0C2B4E;
                  font-size:30px;
                "
              >
                New Verification Code
              </h1>

              <p
                style="
                  text-align:center;
                  color:#64748B;
                  font-size:16px;
                  line-height:26px;
                "
              >
                You requested a new verification code
                for your FlowSync ERP account.
              </p>

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
                This code will expire in
                <strong>3 minutes</strong>.
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

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });

    res.status(200).json({
      message: "New verification code sent",
    });
  } catch (error) {
    console.error("Resend Verification Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// LOGIN

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

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

    // IMPORTANT:
    // Do not allow an unverified email to log in.

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

    res.status(200).json({
      message: "Login successful",
      token,
      user: safeUser,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// FORGOT PASSWORD

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email,
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

    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "Reset Your FlowSync ERP Password",
      html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
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

          <!-- HEADER -->

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

          <!-- CONTENT -->

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

              <!-- BUTTON -->

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

              <!-- EXPIRY CARD -->

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

              <!-- SECURITY -->

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

          <!-- FOOTER -->

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
      `,
    });

    res.status(200).json({
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// RESET PASSWORD

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

    user.password = await bcrypt.hash(password, 10);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ME

const getMe = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

// EXPORTS

module.exports = {
  registerUser,
  verifyEmail,
  resendVerificationCode,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
};
