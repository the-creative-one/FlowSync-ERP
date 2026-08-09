const { BrevoClient } = require("@getbrevo/brevo");

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
  timeoutInSeconds: 30,
  maxRetries: 2,
});

const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.BREVO_API_KEY) {
    throw new Error("BREVO_API_KEY is not configured");
  }

  if (!process.env.BREVO_SENDER_EMAIL) {
    throw new Error("BREVO_SENDER_EMAIL is not configured");
  }

  try {
    const response = await brevo.transactionalEmails.sendTransacEmail({
      sender: {
        name: process.env.BREVO_SENDER_NAME || "FlowSync ERP",
        email: process.env.BREVO_SENDER_EMAIL,
      },

      to: [
        {
          email: to,
        },
      ],

      subject,
      htmlContent: html,
    });

    console.log("Email sent successfully:", response.messageId);

    return response;
  } catch (error) {
    console.error("Brevo email error:", error);

    throw new Error(error?.message || "Failed to send email");
  }
};

module.exports = sendEmail;
