const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });

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

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      permissions: defaultPermissions,
    });

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

    res.status(201).json({
      message: "User registered successfully",
      user: safeUser,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

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

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d", //Token validity duration
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

const getMe = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
};
