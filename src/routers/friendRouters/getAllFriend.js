const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const { UserDB } = require("../../databases/userDB");

router.get(`/`, [auth], async (req, res) => {
  try {
    let { friends } = await UserDB.findById(req.userToken._id);
    let friendList = await UserDB.find({ _id: { $in: [...friends] } }).select({
      name: 1,
      email: 1,
      avatarUrl: 1,
      isOnline: 1,
      isAdmin: 1,
    });
    return res.status(200).send({ msg: `获取好友列表成功`, result: friendList });
  } catch (e) {
    return res
      .status(408) //请求超时。客户端没有在服务器预备等待的时间内完成一个请求的发送。客户端可以随时再次提交这一请求而无需进行任何更改。
      .send({ msg: `获取好友列表请求超时,请检查请求内容,错误信息: ${e}` });
  }
});

module.exports = router;
