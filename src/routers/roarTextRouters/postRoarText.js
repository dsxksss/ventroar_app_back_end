//第三方库
const express = require("express");
const lodash = require("lodash"); //对象操作工具库

//本地库及全局变量
const { createRoarTextValidation } = require(
  "../../functions/validateFuntions",
);
const auth = require("../../middlewares/auth");
const { RoarTextDB } = require("../../databases/roarTextDB");
const router = express.Router();

router.post(`/`, [auth], async (req, res) => {
  try {
    //接受数据并且先用现有模型验证格式是否正确;
    const { error } = createRoarTextValidation(req.body);
    if (error) {
      return res
        .status(400) //客户端请求的语法错误，服务器无法理解
        .send({
          msg: `客户端传入的发帖信息格式不正确 错误信息: ${error.details[0].message}`,
        });
    }

    //确认无误后创建数据
    let text = new RoarTextDB(
      lodash.pick(req.body, [
        "text",
        "isPublic",
        "isShowUserName",
        "isCanComment",
      ]),
    );

    text.userId = req.userToken._id; //保存发帖人id
    text.createDate = Math.round(new Date() / 1000); //用户创建时间
    text.smil = 0; //初始化笑脸数量(默认0)
    text.heart = 0; //初始化爱心数量(默认0)
    text.likeUsers = [];
    text.textComments = [];

    await text.save();
    return res.status(200).send({ msg: "发帖成功,调整心态明天会更好的~" }); //注册成功后反馈给客户端一个头部token
  } catch (e) {
    return res
      .status(408) //请求超时。客户端没有在服务器预备等待的时间内完成一个请求的发送。客户端可以随时再次提交这一请求而无需进行任何更改。
      .send({ msg: `发帖操作请求超时,请检查请求内容,错误信息: ${e}` });
  }
});

module.exports = router;
