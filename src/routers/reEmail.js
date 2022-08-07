const express = require("express");
const auth = require("../middlewares/auth");
const jwt = require("jsonwebtoken");
const config = require("config"); //读取配置文件信息库

const { emailValidation } = require("../functions/validateFuntions");
const { UserDB } = require("../databases/userDB");
const { sendEmail } = require("../functions/sendEmail");
const { MsgType } = require("../functions/sendBoxMsg");
const { timeFormat } = require("../functions/timeFormat");
const DEBUG_HOST = config.get("dbConfig.debugDbConfig.host");
const DEBUG_PORT = config.get("dbConfig.debugDbConfig.port");
const RELEASE_HOST = config.get("dbConfig.releaseDbConfig.host");
const RELEASE_PORT = config.get("dbConfig.releaseDbConfig.port");
const router = express.Router();

router.put("/", auth, async (req, res) => {
  try {
    //接受数据并且先用现有模型验证格式是否正确;
    const { error } = emailValidation(req.body);
    if (error) {
      return res
        .status(400) //客户端请求的语法错误，服务器无法理解
        .send({ msg: `邮箱格式不正确 错误信息: ${error.details[0].message}` });
    }

    let user = await UserDB.findById(req.userToken._id);

    const sameEmail = await UserDB.findOne({ email: req.body.email });
    if (sameEmail) {
      return res
        .status(403) //服务器理解请求客户端的请求，但是拒绝执行此请求
        .send({ msg: "数据库已存在相同邮箱,请直接使用账号密码登录,或更换邮箱" });
    }

    const emailToken = jwt.sign( //生成暂时token
      {
        _id: user._id, //用户id
        exp: Math.floor(Date.now() / 1000) + 60 * 30, //token失效时间为三十分钟
      },
      config.get("jwtKeyT"),
    );

    //测试环境下发送验证邮件
    if (config.get("runMode") === "development") {
      sendEmail({
        to: req.body.email,
        title: `📢VentRoar:验证新邮箱`,
        body: `<head>
        <link rel="icon" href="#"/>
        </head>
        <div>
          <a href="${DEBUG_HOST}:${DEBUG_PORT}/emailactivation/${emailToken}" >点击我验证账号</a>
          <p><b>有效时长30分钟</b></p>
        </div>`,
      });
    }

    //发布环境下发送验证邮件
    if (config.get("runMode") === "production") {
      sendEmail({
        to: req.body.email,
        title: `📢VentRoar:验证新邮箱`,
        body: `
          <head>
            <link rel="icon" href="#"/>
          </head>
          <div>
            <a href="${RELEASE_HOST}:${RELEASE_PORT}/emailactivation/${emailToken}" >点击我验证账号</a>
          <p><b>有效时长30分钟</b></p>
          </div>
          `,
      });
    }

    user.isValidate = false; //设置用户验证状态,点击邮箱网址激活账号(默认未激活)
    user.email = req.body.email;
    user.authToken = "null"; //重置数据库authToken
    user.inBox.sendBoxMsg({
      msg: `您于${timeFormat()}修改了账号邮箱`,
      msgType: MsgType.error,
    });
    await user.save();
    res.status(200).send({ msg: "修改邮箱成功,发送了一条激活邮件,记得激活使用,否则无法使用账号!" });
  } catch (e) {
    return res
      .status(408) //请求超时。客户端没有在服务器预备等待的时间内完成一个请求的发送。客户端可以随时再次提交这一请求而无需进行任何更改。
      .send({ msg: `修改邮箱操作超时,请检查请求内容,错误信息: ${e}` });
  }
});
module.exports = router;
