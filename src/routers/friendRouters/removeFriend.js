const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const { idValidation } = require("../../functions/validateFuntions");
const { UserDB } = require("../../databases/userDB");

router.delete(`/`, [auth], async (req, res) => {
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

    let { friends } = await UserDB.findById(req.userToken._id);
    if (friends.indexOf(req.body.id) == -1) {
      return res.status(404).send({ msg: `您的好友列表不存在该用户` });
    }
    friends.splice(friends.indexOf(req.body.id), 1);
    const newFriends = await UserDB.findByIdAndUpdate(req.userToken._id, {
      friends,
    }, { new: true });
    return res.status(200).send({ msg: `成功删除该好友`, result: newFriends.friends });
  } catch (e) {
    return res
      .status(408) //请求超时。客户端没有在服务器预备等待的时间内完成一个请求的发送。客户端可以随时再次提交这一请求而无需进行任何更改。
      .send({ msg: `删除好友操作请求超时,请检查请求内容,错误信息: ${e}` });
  }
});

module.exports = router;
