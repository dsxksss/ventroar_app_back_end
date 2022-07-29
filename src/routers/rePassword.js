/** 第三方库
 * @import express 
 * @import config
 * @import jsonwebtoken
 * @import bcryptjs
 */
const express = require("express");
const config = require("config");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

/**
 * 本地包 全局变量
 */
const { emailValidation } = require("../functions/validateFuntions");
const { passwordValidation } = require("../functions/validateFuntions");
const { UserDB } = require("../databases/userDB");
const { sendEmail } = require("../functions/sendEmail");
const { timeFormat } = require("../functions/timeFormat");
const checkHeaderToken = require("../middlewares/checkHeaderToken");
const { msgType } = require("../functions/sendBoxMsg");
const router = express.Router();
const PATHNAME = "/";
const MI = 10;

router.post(PATHNAME, async (req, res) => {
  //接受数据并且先用现有模型验证格式是否正确;
  const { error } = emailValidation(req.body);
  if (error)
    return res
      .status(400) //客户端请求的语法错误，服务器无法理解
      .send({ msg: `邮箱格式不正确 错误信息: ${error.details[0].message}` });
  let user = await UserDB.findOne({ email: req.body.email });
  if (!user)
    return res
      .status(404) //服务器理解请求客户端的请求，但是拒绝执行此请求
      .send({ msg: "数据库数据库没找到此邮箱,请检查邮箱是否错误!" });
  const emailToken = jwt.sign(
    {
      _id: user._id, //用户id
      exp: Math.floor(Date.now() / 1000) + 60 * 30 //token失效时间为三十分钟
    },
    config.get("jwtKey")
  );
  //测试环境下发送验证邮件
  if (config.get("runMode") === "development") {
    sendEmail({
      to: user.email,
      title: `📢VentRoar:修改密码邮箱提醒`,
      body: `
      <head>
      <link rel="icon" href="#"/>
    </head>
    <div>
        <p>您于${timeFormat()}发送的修改密码验证邮件</p>
        <p>修改权限的token为:<b>${emailToken}</b></p>
        <p><b>有效时长30分钟</b>复制后返回填写修改,如不是本人务必忽略!⚠️</p>
    </div>
          `
    });
  }

  //发布环境下发送验证邮件
  if (config.get("runMode") === "production") {
    sendEmail({
      to: user.email,
      title: `📢VentRoar:修改密码邮箱提醒`,
      body: `
      <head>
      <link rel="icon" href="#"/>
    </head>
    <div>
        <p>您于${timeFormat()}发送的修改密码验证邮件</p>
        <p>修改权限的token为:<b>${emailToken}</b></p>
        <p><b>有效时长30分钟</b>复制后返回填写修改,如不是本人务必忽略!⚠️</p>
    </div>
          `
    });
  }
  return res
    .status(202) //202表示已经接受请求，但未处理完成
    .send({ msg: "已发送邮箱验证,请检查邮箱修改密码" }); //注册成功后反馈给客户端一个头部token
});

router.put(`${PATHNAME}:validate`, [checkHeaderToken], async (req, res) => {
  try {
    //接受数据并且先用现有模型验证格式是否正确;
    const { error } = passwordValidation(req.body);
    if (error)
      return res
        .status(400) //客户端请求的语法错误，服务器无法理解
        .send({ msg: `密码格式不正确 错误信息: ${error.details[0].message}` });
    const token = jwt.verify(req.header("x-auth-token"), config.get("jwtKey"));
    let user = await UserDB.findById(token._id);

    if (!user) return res.status(404).send({ msg: `数据库不存在此账号!!!` });

    bcryptjs.genSalt(MI, function(_err, salt) {
      bcryptjs.hash(req.body.password, salt, async function(err, hash) {
        if (err)
          return res.status(400).send({ msg: `用户信息加密失败,请重新注册 error: ${err}` });
        user.password = hash;
        user.inBox.sendBoxMsg({
          msg: `您于${timeFormat()}修改密码`,
          msgType: msgType.error
        });
        await user.save(); //保存用户加密数据
      });
    });

    return res.status(200).send({ msg: `密码修改成功,请返回登录` }); //注册成功后反馈给客户端一个头部token
  } catch (error) {
    return res
      .status(400)
      .send({ msg: `已失效的邮箱验证链接,请检查后重试!!! error: ${error}` });
  }
});

module.exports = router;
