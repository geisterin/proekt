
  function authorizeRoll(requiredRoll) {
    return (req, res, next) => {
      if (!req.user || req.user.roll !== requiredRoll) {
        return res.status(403).json({ message: 'Access denied' });
      }
      next();
    };
  }
  