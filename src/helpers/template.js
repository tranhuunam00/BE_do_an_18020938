const sendMailForTutor = (subject, body, to) => {
  return {
    from: "tranhuunam23022000@gmail.com", // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    text: subject, // plain text body
    html: `<p>${body}</p>`, // html body
  };
};

const sendMailForgotPassword = (subject, code, to) => {
  return {
    from: process.env.SYSTEM_URL || "tranhuunam23022000@gmail.com", // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    text: subject, // plain text body
    html: `<p>${code}</p>`, // html body
  };
};

const sendMultiMailForTypeSupport = (to, bcc, title, body) => {
  return {
    personalizations: [
      {
        to: to,
        bcc: bcc, // Array include object with key: email and value: email name
      },
    ],
    from: process.env.SYSTEM_URL || "tranhuunam23022000@gmail.com", // sender address
    subject: `${title}`, // Subject line
    text: `${body}`, // plain text body
    html: `<b>${body}</b>`, // html body
  };
};

const sendMultiMailForTypeResponse = (to, bcc, title, body) => {
  return {
    personalizations: [
      {
        to: to,
        bcc: bcc, // Array include object with key: email and value: email name
      },
    ],
    from: process.env.SYSTEM_URL || "tranhuunam23022000@gmail.com", // sender address
    subject: `${title}`, // Subject line
    text: `${body}`, // plain text body
    html: `<b>${body}</b>`, // html body
  };
};

module.exports = {
  sendMailForTutor,
  sendMailForgotPassword,
  sendMultiMailForTypeSupport,
  sendMultiMailForTypeResponse,
};
