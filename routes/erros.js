exports._404 = (req, resp, next) => {
  resp
    .status(404)
    .render("errors/404", { pageTitle: "Page Not Found", path: "/" });
};

exports._500 = (error, req, res, nex) => {
  // We'll log the error in error.log file
  console.log(error);

  res
    .status(500)
    .render("errors/500", { pageTitle: "Internal Error", path: "/" });
};
