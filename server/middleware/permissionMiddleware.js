const checkPermission = (permission) => {
  return (req, res, next) => {
    // Admin has full access.
    if (req.user?.role === "admin") {
      return next();
    }

    if (!req.user?.permissions?.[permission]) {
      return res.status(403).json({
        message: "Permission denied",
      });
    }
    next();
  };
};
module.exports = {
  checkPermission,
};
