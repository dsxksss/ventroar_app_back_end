const express = require("express");
const auth = require("../../middlewares/auth");
const { UserDB } = require("../../databases/userDB");
const { MsgType } = require("../../functions/sendBoxMsg");
const { idValidation } = require("../../functions/validateFuntions");
const router = express.Router();

router.post(`/`, [auth], async (req, res) => {
  try {
    //接受数据并且先用现有模型验证格式是否正确;
    const { error } = idValidation(req.body);
    if (error) {
      return res
        .status(400) //客户端请求的语法错误，服务器无法理解
        .send({
          msg: `客户端传入的用户id信息格式不正确 错误信息: ${error.details[0].message}`,
        });
    }
    let user = await UserDB.findById(req.body.id);
    if (!user) {
      return res.status(404).send({ msg: `没有找到要添加的用户,请检查后重试` });
    }
    if (user._id == req.userToken._id) {
      return res.status(400).send({ msg: `不能添加自己为自己的好友!` });
    }

    let { inBox } = user;
    let isSend = false;
    inBox.forEach((item) => {
      if (item.msgType === MsgType.addFriend) {
        if (item.friendId == req.userToken._id) {
          isSend = true;
        }
      }
    });

    if (isSend) {
      return res.status(400).send({ msg: `你已经发送过了好友申请,请耐心等待对方同意` });
    }

    inBox.sendBoxMsg({
      msg: `用户${req.userToken.name}向你发送好友申请,是否同意添加?`,
      msgType: MsgType.addFriend,
      friendId: req.userToken._id,
    });
    await UserDB.findByIdAndUpdate(req.body.id, { inBox });
    return res.status(200).send({ msg: "好友请求已发送,等待对方同意" });
  } catch (e) {
    return res
      .status(408) //请求超时。客户端没有在服务器预备等待的时间内完成一个请求的发送。客户端可以随时再次提交这一请求而无需进行任何更改。
      .send({ msg: `添加好友操作请求超时,请检查请求内容,错误信息: ${e}` });
  }
});

module.exports = router;
