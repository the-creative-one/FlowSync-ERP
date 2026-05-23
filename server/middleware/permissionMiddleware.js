const checkPermission = (permission) => {
  return (req, res, next) => {
    // Admin bypass
    if (req.user.role === "admin") {
      return next();
    }

    // Permission check
    if (req.user?.permissions?.[permission]) {
      return next();
    }

    return res.status(403).json({
      message: "Access denied",
    });
  };
};

module.exports = {
  checkPermission,
};