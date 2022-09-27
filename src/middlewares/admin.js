module.exports = function (req, res, next) {
  if (!req.userToken.isAdmin) return res.status(401).send("拒绝访问!您没有管理员权限");
  return next();
};
