const checkEmail = () => {
  return function (req, res, next) {
    try {
      let work_email = req.body.work_email;
      let invalidEmails = [
        "@hotmail.com",
        "@yahoo.com",
        "@msn.com",
        "@outlook.com",
        "@icloud.com",
        "@aol.com",
      ];
      if (invalidEmails.some((v) => work_email.includes(v))) {
        return res.json({
          message:
            "You cannot use your personal email to book a meal. Please register with your work email",
        });
      }
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid " });
    }
  };
};

module.exports = checkEmail;
