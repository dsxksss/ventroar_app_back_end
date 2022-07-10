//第三方库
const express = require("express");
const bcryptjs = require("bcryptjs");
const lodash = require("lodash"); //对象操作工具库
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const config = require("config"); //读取配置文件信息库

//本地库及全局变量
const { userCreateValidation } = require("../functions/validateFuntions");
const { UserDB } = require("../databases/userDB");
const router = express.Router();
const PATHNAME = "/";
const MI = 10;

router.post(PATHNAME, async (req, res) => {
  try {
    //接受数据并且先用现有模型验证格式是否正确;
    const { error } = userCreateValidation(req.body);
    if (error)
      return res
        .status(400) //客户端请求的语法错误，服务器无法理解
        .send(`客户端传入的注册信息格式不正确 错误信息: ${error.details[0].message}`);
    let user = await UserDB.findOne({ email: req.body.email });
    if (user)
      return res
        .status(403) //服务器理解请求客户端的请求，但是拒绝执行此请求
        .send("数据库已存在相同邮箱,请你找回密码,或更换邮箱");

    //确认无误后创建数据
    user = new UserDB(
      lodash.pick(req.body, [
        "name",
        "password",
        "email",
        "friends",
        "createDate",
        "isAdmin",
        "isValidate"
      ])
    );

    // //加密
    // bcryptjs.hash('要加密的内容', mi, (err,pwd)=>{
    //     if(err) return res.send('加密失败')
    //     res.send('加密成功' + pwd)
    // })
    // // 比对
    // bcryptjs.compare('要比对的密码','加密后的密码',(err, flag)=>{
    //     if (err) return res.send('比对失败' + err)
    //     if (!flag) return res.send('密码不正确')
    //     res.send('密码正确')
    // })

    bcryptjs.genSalt(MI, async function(_err, _salt) {
      bcryptjs.hash(req.body.password, MI, function(err, pwd) {
        if (err) return res.send("加密失败" + err);
        user.password = pwd;
      });
    });

    user.createDate = Math.round(new Date() / 1000); //用户创建时间
    user.isAdmin = false; //设置用户权限,用户是否为管理员(默认不是管理员)
    user.isValidate = false; //设置用户验证状态,点击邮箱网址激活账号(默认未激活)
    await user.save(); //保存用户加密数据
    const emailToken = jwt.sign({ _id: user._id }, config.get("jwtkey")); //利用模型类里的自定函数方法利用OOP特性来增加代码复用性和一致性.
    const loginToken = user.createUserToken(); //利用模型类里的自定函数方法利用OOP特性来增加代码复用性和一致性.
    console.log(user._id);

    const selfEmail = nodemailer.createTransport({
      //创建发送邮箱的账户和授权码
      host: "smtp.qq.com",
      secureConnection: true,
      port: 465,
      secure: true,
      auth: {
        user: "ventroar.xyz@qq.com",
        pass: config.get("sendMailPassword")
      }
    });

    const emailFrom = {
      //配置邮箱本体发送内容
      from: config.get("sendMailConfig.sender"), //发件者
      to: req.body.email, //收件者
      subject: `🎉验证邮箱加入VentRoar🎉`, //邮件标题
      // text:"xxxxx",
      html: `<div><a href="http://localhost:2547/emailValidate/${emailToken}" >点击我</a></div>` //邮件具体内容,支持纯文本、html格式
    };
    //开始发送
    selfEmail.sendMail(emailFrom);
    res
      .header("x-auth-token", loginToken)
      .header("access-control-expose-headers", "x-auth-token") //扩展此自定义头部给客户端访问
      .status(200)
      .send({ msg: "注册成功,请前往注册邮箱验证账号" }); //注册成功后反馈给客户端一个头部token
  } catch (e) {
    res
      .status(408) //请求超时。客户端没有在服务器预备等待的时间内完成一个请求的发送。客户端可以随时再次提交这一请求而无需进行任何更改。
      .send({ msg: `创建用户时请求超时,请检查请求内容,错误信息: ${e}` });
  }
});

module.exports = router;
