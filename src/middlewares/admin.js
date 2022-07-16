module.exports = function(req, res, next) {
  //401:数据验证错误
  //403:不含有权限
  if (!req.userToken.isAdmin) return res.status(403).send("拒绝访问!您没有管理员权限");
  next();
};
