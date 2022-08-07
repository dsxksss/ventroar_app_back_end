const { RoarTextDB } = require("../../databases/roarTextDB");
const express = require("express");
const router = express.Router();

router.get("/", async (_req, res) => {
  //获取全部发泄内容并按心数和笑脸数升序获得
  try {
    const texts = await RoarTextDB.find().sort({ heart: -1, smil: -1 });
    return res.status(200).send({ msg: "获取全部text数据成功", result: texts });
  } catch (e) {
    return res
      .status(408) //请求超时。客户端没有在服务器预备等待的时间内完成一个请求的发送。客户端可以随时再次提交这一请求而无需进行任何更改。
      .send({ msg: `获取该贴子心、笑脸数量超时,请检查请求内容,错误信息: ${e}` });
  }
});

module.exports = router;
