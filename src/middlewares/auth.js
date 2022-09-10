/*
此文件的主要目的是为了判断使用了该中间件的routers
是否在请求头部添加了x-auth-token的token内容
然后做出相应的操作
*/

const jwt = require("jsonwebtoken");
const config = require("config");
const { UserDB } = require("../databases/userDB");

module.exports = async function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("拒绝访问!请求头部缺少token");

  //verify函数会解析传入的token是否合法,如果不合法会抛出一个异常,合法的话返回token里的内容
  try {
    const tokenData = jwt.verify(token, config.get("jwtKey"));
    let user = await UserDB.findById(tokenData._id);
    if (!user) {
      res.status(404).send({ msg: "数据库不存在此用户" });
    }
    if (user.authToken == "null") {
      return res.status(403).send({ msg: "用户数据库token不存在,请重新登录后继续操作" });
    }
    // if (user.authToken != token) {
    //   return res.status(403).send({ msg: "该token与数据库token不一致,请重新登录后继续操作" });
    // }
    req.userToken = tokenData;
    next(); //必须要有next()函数结尾，不然服务会被阻塞到这里
  } catch (error) {
    res.status(400).send("数据不正确 非法的token令牌!");
  }
};
