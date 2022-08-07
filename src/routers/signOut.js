const express = require("express");
const { UserDB } = require("../databases/userDB");
const auth = require("../middlewares/auth");
const router = express.Router();

router.put(`/`, [auth], async (req, res) => {
  try {
    await UserDB.findByIdAndUpdate(req.userToken._id, {
      authToken: "null",
      isOnline: false,
    });
    return res.status(200).send({ msg: "账号退出成功", result: { isOnline: false } });
  } catch (e) {
    return res
      .status(408) //请求超时。客户端没有在服务器预备等待的时间内完成一个请求的发送。客户端可以随时再次提交这一请求而无需进行任何更改。
      .send({ msg: `退出用户请求超时,请检查请求内容,错误信息: ${e}` });
  }
});

module.exports = router;
