//第三方库
const express = require("express");
const bcryptjs = require("bcryptjs");
const lodash = require("lodash"); //对象操作工具库

//本地库及全局变量
const { signInValidation } = require("../functions/validateFuntions");
const { UserDB } = require("../databases/userDB");
const router = express.Router();
const PATHNAME = "/";

router.post(PATHNAME, async (req, res) => {
  try {
    //接受数据并且先用现有模型验证格式是否正确;
    const { error } = signInValidation(req.body);
    if (error) {
      return res
        .status(400) //客户端请求的语法错误，服务器无法理解
        .send({
          msg: `登录数据格式不正确 错误信息: ${error.details[0].message}`,
        });
    }
    let user = null;
    user = await UserDB.findOne({ email: req.body.account });
    if (!user) {
      user = await UserDB.findOne({ name: req.body.account });
      if (!user) {
        return res
          .status(404) //客户端请求的语法错误，服务器无法理解
          .send({ msg: `邮箱或用户名不存在,请检查邮箱后重新登录!` });
      }
    }
    if (!user.isValidate) {
      return res
        .status(400) //客户端请求的语法错误，服务器无法理解
        .send({ msg: `该账号未激活,请验证邮箱激活账号!` });
    }
    // if (user.isOnline) {
    //   return res
    //     .status(400) //客户端请求的语法错误，服务器无法理解
    //     .send({ msg: `账号在线,请检查是否已经登录!` });
    // }

    //比对数据库密码是否与提交密码正确
    bcryptjs.compare(req.body.password, user.password, async (err, flag) => {
      if (err) {
        return res
          .status(400) //客户端请求的语法错误，服务器无法理解
          .send({ msg: `比对密码时发送了意外错误! error: ${err}` });
      }
      if (!flag) {
        return res
          .status(400) //客户端请求的语法错误，服务器无法理解
          .send({ msg: `账号或密码错误,请检查后重新登录!` });
      }

      //如果提交密码正确,则返回登录token和成功状态码
      const loginToken = user.createUserToken(); //利用模型类里的自定函数方法利用OOP特性来增加代码复用性和一致性.

      user = await UserDB.findByIdAndUpdate(user._id, {
        authToken: loginToken,
      }, { new: true });

      return res
        .header("x-auth-token", loginToken)
        .header("access-control-expose-headers", "x-auth-token") //扩展此自定义头部给客户端访问
        .status(200)
        .send({
          msg: "登录成功",
          //这里之所以使用pick,是因为上面用到了用户的加密密码,需要比对原密码和传递密码
          //但是因为得返回一些数据给客户端,所以这里用了过滤了某些不需要交给客户端的数据
          ...lodash.pick(user, [
            "_id",
            "name",
            "email",
            "friends",
            "avatarUrl",
            "inBox",
            "authToken",
            "createDate",
            "isOnline",
            "isAdmin",
          ]),
        }); //注册成功后反馈给客户端一个对象，里面包含了用户的一些基本数据
    });
  } catch (e) {
    return res
      .status(408) //请求超时。客户端没有在服务器预备等待的时间内完成一个请求的发送。客户端可以随时再次提交这一请求而无需进行任何更改。
      .send({ msg: `登录请求超时,请检查请求内容,错误信息: ${e}` });
  }
});

module.exports = router;
