/** 第三方库
 * @import express
 * @import jsonwebtoken
 * @import config
 */
const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("config"); //读取配置文件信息库

/**
 * 本地包 全局变量
 */
const { UserDB } = require("../databases/userDB");
const checkHeaderToken = require("../middlewares/checkHeaderToken");
const router = express.Router();
const PATHNAME = "/";

router.post(`${PATHNAME}`, [checkHeaderToken], async (req, res) => {
  try {
    const token = jwt.verify(req.header("x-auth-token"), config.get("jwtkey"));
    let user = await UserDB.findById(token._id).select({
      name: 1,
      email: 1,
      friends: 1,
      inBox: 1,
      createDate: 1,
      avatarUrl: 1,
      isOnline: 1,
      isAdmin: 1
    });
    if (!user) return res.status(404).send({ msg: `数据库不存在此账号!!!` });
    return res.status(200).send({ msg: `登录成功`, ...user._doc }); //注册成功后反馈给客户端一个头部token
  } catch (error) {
    return res
      .status(400)
      .send({ msg: `已失效的登录,请重新登录账号! error ${error.message}` });
  }
});

module.exports = router;
