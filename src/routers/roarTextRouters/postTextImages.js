const express = require("express");
const auth = require("../../middlewares/auth");
const { upload, diskStorage } = require("../../middlewares/upload");
const { RoarTextDB } = require("../../databases/roarTextDB");
const router = express.Router();

// 上传帖子图片路由(只允许上传4张图片);
router.post(
  `/:roarTextId`,
  [
    auth,
    upload(diskStorage.Img).array("images", 4),
  ],
  async (req, res) => {
    try {
      let text = await RoarTextDB.findById(req.params.roarTextId);
      if (!text) {
        return res.status(404).send({ msg: "没有找到该宣泄贴,请检查参数再确认" });
      }

      if (text.userId !== req.userToken._id) {
        return res.status(400).send({ msg: "你没有权限这么做!" });
      }
      text.textImages = [];
      req.files.forEach((item) => text.textImages.push(item.filename));

      let newText = await RoarTextDB.findByIdAndUpdate(
        req.params.roarTextId,
        { textImages: text.textImages },
        { new: true },
      );

      return res.status(200).send({ msg: "上传图片成功", result: newText });
    } catch (e) {
      return res
        .status(408) //请求超时。客户端没有在服务器预备等待的时间内完成一个请求的发送。客户端可以随时再次提交这一请求而无需进行任何更改。
        .send({ msg: `上传图片操作超时,请检查请求内容,错误信息: ${e}` });
    }
  },
);

module.exports = router;
