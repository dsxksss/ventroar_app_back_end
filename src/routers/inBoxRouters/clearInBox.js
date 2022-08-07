const express = require("express");
const auth = require("../../middlewares/auth");

const router = express.Router();
const { UserDB } = require("../../databases/userDB");

router.delete("/", [auth], async (req, res) => {
  try {
    let user = await UserDB.findById(req.userToken._id);
    let { inBox } = user;
    inBox = [];
    await UserDB.findByIdAndUpdate(req.userToken._id, { inBox }, { new: true });
    res.status(200).send({ msg: "信件已清空" });
  } catch (e) {
    return res
      .status(408) //请求超时。客户端没有在服务器预备等待的时间内完成一个请求的发送。客户端可以随时再次提交这一请求而无需进行任何更改。
      .send({ msg: `清除收件箱超时,请检查请求内容,错误信息: ${e}` });
  }
});

module.exports = router;
