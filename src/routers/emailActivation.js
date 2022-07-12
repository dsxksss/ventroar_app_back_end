/**
 * @import express
 * @import jsonwebtoken jwtToken验证
 * @import config 配置信息读取
 */
const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("config");

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
    if (!user) return res.status(404).send(`<h1>数据库不存在此账号!!!</h1>`);
    if (user.isValidate)
      //检查账号是否已经激活
      return res
        .status(400) //服务器理解请求客户端的请求，但是拒绝执行此请求
        .send(`<h1>用户账号已经激活,请勿重复验证!!!</h1>`);
    user.isValidate = true;
    user.save();
    return res.status(200).send(`<h1>账户激活成功,请返回登录</h1>`); //注册成功后反馈给客户端一个头部token
  } catch (error) {
    return res.status(400).send({ msg: "传入的数据数据非法,token令牌错误!" });
  }
});

module.exports = router;
