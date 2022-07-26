//第三方库
const express = require("express");
const bcryptjs = require("bcryptjs");
const lodash = require("lodash"); //对象操作工具库
const jwt = require("jsonwebtoken");
const config = require("config"); //读取配置文件信息库

//本地库及全局变量
const { createUserValidation } = require("../functions/validateFuntions");
const { UserDB } = require("../databases/userDB");
const { sendEmail } = require("../functions/sendEmail");
const router = express.Router();
const DEBUG_HOST = config.get("dbConfig.debugDbConfig.host");
const DEBUG_PORT = config.get("dbConfig.debugDbConfig.port");
const RELEASE_HOST = config.get("dbConfig.releaseDbConfig.host");
const RELEASE_PORT = config.get("dbConfig.releaseDbConfig.port");
const PATHNAME = "/";
const MI = 10;

router.post(PATHNAME, async (req, res) => {
  try {
    //接受数据并且先用现有模型验证格式是否正确;
    const { error } = createUserValidation(req.body);
    if (error)
      return res
        .status(400) //客户端请求的语法错误，服务器无法理解
        .send({
          msg: `客户端传入的注册信息格式不正确 错误信息: ${error.details[0].message}`
        });
    let user = await UserDB.findOne({ email: req.body.email });
    if (user)
      return res
        .status(403) //服务器理解请求客户端的请求，但是拒绝执行此请求
        .send({
          msg: "数据库已存在相同邮箱,请直接使用账号密码登录,或更换邮箱"
        });

    //确认无误后创建数据
    user = new UserDB(
      lodash.pick(req.body, [
        "name",
        "password",
        "email",
        "friends",
        "inBox",
        "createDate",
        "isAdmin",
        "isValidate",
        "isOnline"
      ])
    );

    // // 比对
    // bcryptjs.compare('要比对的密码','加密后的密码',(err, flag)=>{
    //     if (err) return res.send('比对失败' + err)
    //     if (!flag) return res.send('密码不正确')
    //     res.send('密码正确')
    // })

    bcryptjs.genSalt(MI, function(_err, salt) {
      bcryptjs.hash(req.body.password, salt, async function(err, hash) {
        if (err) return res.status(400).send("用户信息加密失败,请重新注册" + err);
        user.password = hash;
        await user.save(); //保存用户加密数据
      });
    });

    user.createDate = Math.round(new Date() / 1000); //用户创建时间
    user.avatarUrl = "null"; //用户头像url(默认null)
    user.isOnline = false; //设置用户登录状态(默认未登录)
    user.isAdmin = false; //设置用户权限,用户是否为管理员(默认不是管理员)
    user.isValidate = false; //设置用户验证状态,点击邮箱网址激活账号(默认未激活)
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
        <a href="${DEBUG_HOST}:${DEBUG_PORT}/emailactivation/${emailToken}" >点击我验证账号</a>
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
          <a href="${RELEASE_HOST}:${RELEASE_PORT}/emailactivation/${emailToken}" >点击我验证账号</a>
        <p><b>有效时长30分钟</b></p>
        </div>
        `
      });
    }

    return res.status(202).send({ msg: "注册成功,请前往注册邮箱验证账号" }); //注册成功后反馈给客户端一个头部token
  } catch (e) {
    return res
      .status(408) //请求超时。客户端没有在服务器预备等待的时间内完成一个请求的发送。客户端可以随时再次提交这一请求而无需进行任何更改。
      .send({ msg: `创建用户时请求超时,请检查请求内容,错误信息: ${e}` });
  }
});

module.exports = router;
