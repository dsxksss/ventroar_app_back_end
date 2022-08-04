const express = require("express");
const { RoarTextDB } = require("../../databases/roarTextDB");

const auth = require("../../middlewares/auth");
const router = express.Router();

router.get(`/`, [auth], async (req, res) => {
  try {
    let texts = await RoarTextDB.find({ userId: req.userToken._id });
    return res.status(200).send({ msg: "获取成功", texts });
  } catch (e) {
    return res
      .status(408) //请求超时。客户端没有在服务器预备等待的时间内完成一个请求的发送。客户端可以随时再次提交这一请求而无需进行任何更改。
      .send({ msg: `获取用户宣泄历史请求超时,请检查请求内容,错误信息: ${e}` });
  }
});

module.exports = router;
