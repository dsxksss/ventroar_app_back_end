const express = require("express");

const router = express.Router();
const { upload, diskStorage } = require("../middlewares/upload");

//upload.single() 只接受单个文件上传
router.post("/", upload(diskStorage.Img).single("image"), (req, res) => {
  try {
    res.status(200).send({ msg: "上传图片成功 ", file: req.file });
  } catch (error) {
    return res
      .status(408) //请求超时。客户端没有在服务器预备等待的时间内完成一个请求的发送。客户端可以随时再次提交这一请求而无需进行任何更改。
      .send({ msg: `上传图片操作超时,请检查请求内容,错误信息: ${e}` });
  }
});

module.exports = router;
