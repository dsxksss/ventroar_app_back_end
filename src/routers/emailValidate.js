//验证邮箱后创建数据
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
    console.log(token._id);
    let user = await UserDB.findById(token);
    if (!user)
      return res
        .status(404) //服务器理解请求客户端的请求，但是拒绝执行此请求
        .send(`<h1>数据库不存在此账号!!!</h1>`);
    user.isValidate = true;
    user.save();
    res.status(200).send(`<h1>邮箱验证成功</h1>`); //注册成功后反馈给客户端一个头部token
  } catch (error) {
    res.status(400).send("数据不正确 非法的token令牌!");
  }
});

module.exports = router;
