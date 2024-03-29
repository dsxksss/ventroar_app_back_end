const express = require("express");
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
      {
        text: req.body.text,
        isPublic: req.body.isPublic,
        isShowUserName: req.body.isShowUserName,
        isCanComment: req.body.isCanComment,
      },
    );

    text.userId = req.userToken._id; //保存发帖人id
    text.createDate = Math.round(new Date() / 1000); //用户创建时间
    text.smil = 0; //初始化笑脸数量(默认0)
    text.heart = 0; //初始化爱心数量(默认0)
    text.smilLikeUsers = []; //初始化点赞列表
    text.heartLikeUsers = []; //初始化点赞列表
    text.textImages = []; //初始化宣泄贴图片url列表
    text.textComments = []; //初始化宣泄贴评论列表

    await text.save();
    return res.status(200).send({ msg: "发帖成功,调整心态明天会更好的~", result: text });
  } catch (e) {
    return res
      .status(408) //请求超时。客户端没有在服务器预备等待的时间内完成一个请求的发送。客户端可以随时再次提交这一请求而无需进行任何更改。
      .send({ msg: `发帖操作请求超时,请检查请求内容,错误信息: ${e}` });
  }
});

module.exports = router;
