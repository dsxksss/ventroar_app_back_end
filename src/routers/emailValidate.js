//第三方库
const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("config"); //读取配置文件信息库

//本地库及全局变量
const { UserDB } = require("../databases/userDB");
const router = express.Router();
const PATHNAME = "/";

router.get(`${PATHNAME}:emailtoken`, async (req, res) => {
  try {
    let token = jwt.verify(req.params.emailtoken, config.get("jwtkey"));
    const time = Math.round(new Date() / 1000); //生成当前时间的时间戳
    if (
      time - token.iat >=
      1800 //1800时间戳半个小时差值
    )
      return res
        .status(400) //服务器理解请求客户端的请求，但是拒绝执行此请求
        .send(`<h1>验证链接已超时,请重新发送邮箱验证!!!</h1>`);
    let user = await UserDB.findById(token._id);
    if (!user)
      return res
        .status(404) //服务器理解请求客户端的请求，但是拒绝执行此请求
        .send(`<h1>数据库不存在此账号!!!</h1>`);
    user.isValidate = true;
    user.save();
    return res.status(200).send(`<h1>邮箱验证成功</h1>`); //注册成功后反馈给客户端一个头部token
  } catch (error) {
    return res.status(400).send({ msg: "数据不正确 非法的token令牌!" });
  }
});

module.exports = router;
