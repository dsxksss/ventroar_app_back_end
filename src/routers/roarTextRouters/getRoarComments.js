const express = require("express");

const { UserDB } = require("../../databases/userDB");
const { RoarTextDB } = require("../../databases/roarTextDB");
const { idValidation } = require("../../functions/validateFuntions");
const router = express.Router();

router.get(`/`, async (req, res) => {
  try {
    //接受数据并且先用现有模型验证格式是否正确;
    const { error } = idValidation(req.body);
    if (error) {
      return res
        .status(400) //客户端请求的语法错误，服务器无法理解
        .send({
          msg: `客户端传入的获取宣泄帖评论的宣泄帖id格式不正确 错误信息: ${error.details[0].message}`,
        });
    }
    let roarText = await RoarTextDB.findById(req.body.id);
    let usersId = [];
    let newTexts = [];

    roarText.textComments.forEach((comment) =>
      usersId.push(comment.commentUserId)
    );

    let users = await UserDB.find({ _id: { $in: [...usersId] } }).select({
      name: 1,
      email: 1,
      avatarUrl: 1,
    });

    //加工数据
    roarText.textComments.forEach((comment) => {
      users.forEach((item) => {
        if (comment.commentUserId == item._id) {
          newTexts.push({
            _id: comment._id,
            commentText: comment.commentText,
            isShowUserName: comment.isShowUserName,
            createDate: comment.createDate,
            userId: comment.commentUserId,
            userName: item.name,
            userEmail: item.email,
            userAvatarUrl: item.avatarUrl,
          });
        }
      });
    });

    return res.status(200).send({ msg: "获取宣泄帖评论数据成功", result: newTexts });
  } catch (e) {
    return res
      .status(408) //请求超时。客户端没有在服务器预备等待的时间内完成一个请求的发送。客户端可以随时再次提交这一请求而无需进行任何更改。
      .send({ msg: `获取宣泄帖评论请求超时,请检查请求内容,错误信息: ${e}` });
  }
});

module.exports = router;
