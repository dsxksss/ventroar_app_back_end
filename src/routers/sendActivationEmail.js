//第三方库
const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("config"); //读取配置文件信息库

//本地库及全局变量
const { emailValidation } = require("../functions/validateFuntions");
const { UserDB } = require("../databases/userDB");
const { sendEmail } = require("../functions/sendEmail");
const { timeFormat } = require("../functions/timeFormat");
const router = express.Router();
const DEBUG_HOST = config.get("dbConfig.debugDbConfig.host");
const DEBUG_PORT = config.get("dbConfig.debugDbConfig.port");
const RELEASE_HOST = config.get("dbConfig.releaseDbConfig.host");
const RELEASE_PORT = config.get("dbConfig.releaseDbConfig.port");
const PATHNAME = "/";

router.post(PATHNAME, async (req, res) => {
  try {
    //接受数据并且先用现有模型验证格式是否正确;
    const { error } = emailValidation(req.body);
    if (error)
      return res
        .status(400) //客户端请求的语法错误，服务器无法理解
        .send({ msg: `客户端传入的邮箱格式不正确 错误信息: ${error.details[0].message}` });
    let user = await UserDB.findOne({ email: req.body.email });
    if (!user)
      return res
        .status(404) //服务器理解请求客户端的请求，但是拒绝执行此请求
        .send({ msg: "数据库不存在此邮箱,请检查邮箱格式后重试" });

    const emailToken = jwt.sign(
      {
        _id: user._id, //用户id
        exp: Math.floor(Date.now() / 1000) + 60 * 30 //token失效时间为三十分钟
      },
      config.get("jwtkey")
    );

    //测试环境下发送验证邮件
    if (config.get("runMode") === "development") {
      sendEmail({
        to: user.email,
        title: `🎉验证邮箱加入VentRoar🎉`,
        body: `<head>
        <link rel="icon" href="#"/>
      </head>
      <div>
      <p>您于${timeFormat()}发送的账号验证邮件</p>
        <a href="http://${DEBUG_HOST}:${DEBUG_PORT}/emailactivation/${emailToken}" >点击我验证账号</a>
        <p><b>有效时长30分钟</b></p>
      </div>`
      });
    }

    //发布环境下发送验证邮件
    if (config.get("runMode") === "production") {
      sendEmail({
        to: user.email,
        title: `🎉验证邮箱加入VentRoar🎉`,
        body: `
        <head>
          <link rel="icon" href="#"/>
        </head>
        <div>
        <p>您于${timeFormat()}发送的账号验证邮件</p>
          <a href="http://${RELEASE_HOST}:${RELEASE_PORT}/emailactivation/${emailToken}" >点击我验证账号</a>
          <p><b>有效时长30分钟</b></p>
        </div>
        `
      });
    }

    return res.status(202).send({ msg: "发送成功,请前往注册邮箱验证并激活账号" }); //注册成功后反馈给客户端一个头部token
  } catch (e) {
    return res
      .status(408) //请求超时。客户端没有在服务器预备等待的时间内完成一个请求的发送。客户端可以随时再次提交这一请求而无需进行任何更改。
      .send({ msg: `发送邮件请求超时,请检查后重试,错误信息: ${e}` });
  }
});

module.exports = router;
