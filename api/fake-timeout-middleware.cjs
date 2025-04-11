module.exports = (req, res, next) => {
  if (req.method !== "GET") {
    setTimeout(() => {
      res.status(401).json({
        error: "Unauthorized",
      });
    }, 15000); // 15 seconds delay to force timeout
  } else {
    next();
  }
};
