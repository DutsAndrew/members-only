exports.index = (req, res, next) => {
  res.render("index", {
    title: "Members Only Chat",
    welcome: "Check out the latest messages:",
    userMessage: "Welcome back, ",
    user: req.user,
  });
};