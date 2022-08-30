const express = require("express");
const fs = require("fs");
const auth = require("../middlewares/auth");
const router = express.Router();
const { UserDB } = require("../databases/userDB");
const { STATICPATH } = require("../../staticPathProvider");
const { upload, diskStorage } = require("../middlewares/upload");

//upload.single() 只接受单个文件上传
router.post(
  "/",
  [auth, upload(diskStorage.UserAvatar).single("avatar")],
  async (req, res) => {
    try {
      let user = await UserDB.findById(req.userToken._id);
      fs.unlink(`${STATICPATH}/avatars/${user.avatarUrl}`, (_) => {});
      user.avatarUrl = req.file.filename;
      await user.save();
      return res.status(200).send({ msg: "上传头像成功", result: req.file });
    } catch (error) {
      return res
        .status(408) //请求超时。客户端没有在服务器预备等待的时间内完成一个请求的发送。客户端可以随时再次提交这一请求而无需进行任何更改。
        .send({ msg: `上传头像操作超时,请检查请求内容,错误信息: ${e}` });
    }
  },
);

module.exports = router;
