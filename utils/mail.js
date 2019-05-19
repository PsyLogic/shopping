const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "fbc4b5e190c058",
    pass: "66ee9d0846c270"
  }
});

module.exports = mailOptions => {
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    }
    console.log("Info: ", info);
  });
};
