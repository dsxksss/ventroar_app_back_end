const express = require("express");
const { RoarTextDB } = require("../../databases/roarTextDB");
const { findRoarTextCommentValidation } = require(
  "../../functions/validateFuntions",
);

const auth = require("../../middlewares/auth");
const router = express.Router();

router.delete("/", [auth], async (req, res) => {
  try {
    //接受数据并且先用现有模型验证格式是否正确;
    const { error } = findRoarTextCommentValidation(req.body);
    if (error) {
      return res
        .status(400) //客户端请求的语法错误，服务器无法理解
        .send({
          msg: `客户端传入的回帖格式不正确 错误信息: ${error.details[0].message}`,
        });
    }

    let oldText = await RoarTextDB.findById(req.body.roarTextId);
    if (!oldText) {
      return res.status(404) //客户端请求的语法错误，服务器无法理解
        .send({
          msg: `没找到该宣泄帖,请检查后重试!`,
        });
    }
    let { userId, textComments } = oldText; //结构出需要用的数据

    // console.log(textComments);
    const commentsLength = textComments.length; //利用原数组长度来判断是否含有该评论
    let isCanDelete = true; //是否可以删除(默认可以删除该评论)
    textComments.forEach((comment, index) => {
      if (comment._id == req.body.commentId) {
        if (req.userToken.isAdmin) { //检查该删除用户是否是管理员
          return textComments.splice(index, 1);
        } else if (comment.commentUserId == req.userToken._id) { //检查该评论是否为该删除用户评论
          return textComments.splice(index, 1);
        } else if (comment.commentUserId == userId) { //检查该评论是否是发帖者评论
          return textComments.splice(index, 1);
        } else {
          isCanDelete = false; //如果上述权限都没有的话则不让删除该评论
        }
      }
    });

    //利用原数组长度来判断是否含有该评论
    if (commentsLength == textComments.length) {
      if (!isCanDelete) {
        return res.status(403).send({ msg: "您没有权限删除该评论" });
      }
      return res.status(404).send({ msg: "没找到该评论,请检查后重试!" });
    }

    let newText = await RoarTextDB.findByIdAndUpdate(req.body.roarTextId, {
      textComments,
    }, { new: true }); //这里的true表示返回更新后的数据,默认是返回更新前的数据

    return res.status(200).send({ msg: "评论已删除~", newText }); //注册成功后反馈给客户端一个头部token
  } catch (e) {
    return res
      .status(408) //请求超时。客户端没有在服务器预备等待的时间内完成一个请求的发送。客户端可以随时再次提交这一请求而无需进行任何更改。
      .send({ msg: `删评操作请求超时,请检查请求内容,错误信息: ${e}` });
  }
});

module.exports = router;
