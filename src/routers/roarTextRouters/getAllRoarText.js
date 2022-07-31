const { RoarTextDB } = require("../../databases/roarTextDB");
const express = require("express");
const router = express.Router();

router.get("/", async (_req, res) => {
  //获取全部发泄内容并按心数和笑脸数升序获得
  try {
    const text = await RoarTextDB.find().sort({ heart: -1, smil: -1 });
    return res.status(200).send({ msg: "获取全部text数据成功", text });
  } catch (e) {
    return res.status(400).send({ msg: "发生未知错误,请重试" });
  }
});

module.exports = router;
