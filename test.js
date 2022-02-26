const sendGridMail = require("@sendgrid/mail");
sendGridMail.setApiKey(
  "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"
);

function getMessage() {
  const body = "This is a test email using SendGrid from Node.js";
  return {
    to: "18020938@vnu.edu.vn",
    from: "tranhuunam23022000@gmail.com",
    subject: "test cai lun",
    text: body,
    html: `<strong>${body}</strong>`,
  };
}

async function sendEmail() {
  try {
    await sendGridMail.send(getMessage());
    console.log("Test email sent successfully");
  } catch (error) {
    console.error("Error sending test email");
    console.error(error);
    if (error.response) {
      console.error(error.response.body);
    }
  }
}

(async () => {
  console.log("Sending test email");
  await sendEmail();
})();
