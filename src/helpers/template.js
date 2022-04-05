const constants = require("../constants/constants");
const sendMailForTutor = (subject, body, to) => {
  return {
    from: "tranhuunam23022000@gmail.com", // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    text: subject, // plain text body
    html: `<p>${body}</p>`, // html body
  };
};

const sendMailForgotPassword = (code, to, subject = "Fotgot password") => {
  return {
    from: process.env.SYSTEM_URL, // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    text: subject, // plain text body
    html: `<p> Bạn quên mật khẩu. Xin hãy ấn vào link dưới đây để đặt lại mật khẩu!
      <p>${constants.FE_RESET_PASSWORD}?token=${code}</p>`, // html body
  };
};

const sendMailCreateUser = (code, to, subject = "Xác thực tài khoản") => {
  return {
    from: process.env.SYSTEM_URL || "tranhuunam23022000@gmail.com", // sender address
    to: to,
    subject: subject,
    text: subject,
    html: `<div><p>Ấn vào link dưới để xác thực</p><p>${constants.BE_ENDPOINT}/api/users/confirm-register?token=${code}</p></div>`,
  };
};

module.exports = {
  sendMailForTutor,
  sendMailForgotPassword,
  sendMailCreateUser,
};
