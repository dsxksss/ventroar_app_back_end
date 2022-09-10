/*
此文件的主要目的是为了判断使用了该中间件的routers
是否在请求头部添加了x-auth-token的token内容
然后做出相应的操作
*/

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token"); //检查是否存在长期token
  if (!token) {
    const token = req.header("x-auth-tokenT"); //检查是否存在短期token
    if (!token) {
      return res.status(401).send("拒绝访问!请求头部缺少token");
    }
  }
  next(); //必须要有next()函数结尾，不然服务会被阻塞到这里
};
