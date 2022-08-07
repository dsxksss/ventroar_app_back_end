const express = require("express");
const { RoarTextDB } = require("../../databases/roarTextDB");

const { roarTextValidation } = require("../../functions/validateFuntions");
const auth = require("../../middlewares/auth");
const router = express.Router();

router.put(`/`, [auth], async (req, res) => {
  try {
    //接受数据并且先用现有模型验证格式是否正确;
    const { error } = roarTextValidation(req.body);
    if (error) {
      return res
        .status(400) //客户端请求的语法错误，服务器无法理解
        .send({
          msg: `客户端传入的修改发泄帖子信息格式不正确 错误信息: ${error.details[0].message}`,
        });
    }
    let oldText = await RoarTextDB.findById(req.body.textId);
    if (!oldText) {
      return res.status(404) //客户端请求的语法错误，服务器无法理解
        .send({
          msg: `没找到该帖子,请检查后重试!`,
        });
    }
    let { text, isPublic, isShowUserName, isCanComment, userId } = oldText; //结构出需要用的数据
    if (userId != req.userToken._id) {
      return res.status(403).send({ msg: "您没有权限修改别人的宣泄帖" });
    }
    text = req.body.text;
    isPublic = req.body.isPublic;
    isShowUserName = req.body.isShowUserName;
    isCanComment = req.body.isCanComment;
    let newText = await RoarTextDB.findByIdAndUpdate(req.body.textId, {
      text,
      isPublic,
      isShowUserName,
      isCanComment,
    }, { new: true }); //这里的true表示返回更新后的数据,默认是返回更新前的数据
    return res.status(200).send({ msg: "修改发泄成功", result: newText });
  } catch (e) {
    return res
      .status(408) //请求超时。客户端没有在服务器预备等待的时间内完成一个请求的发送。客户端可以随时再次提交这一请求而无需进行任何更改。
      .send({ msg: `修改发泄帖子请求超时,请检查请求内容,错误信息: ${e}` });
  }
});

module.exports = router;
