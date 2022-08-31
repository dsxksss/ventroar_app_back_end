const express = require("express");
const auth = require("../middlewares/auth");
const { deleteFile, staticDir } = require("../functions/deleteFile");
const router = express.Router();
const { UserDB } = require("../databases/userDB");
const { upload, diskStorage } = require("../middlewares/upload");

//upload.single() 只接受单个文件上传
router.post(
  "/",
  [auth, upload(diskStorage.UserAvatar).single("avatar")],
  async (req, res) => {
    try {
      if (typeof req.file === "undefined") {
        return res.status(400).send({ msg: "不能上传空内容,请检查后重试!" });
      }
      let user = await UserDB.findById(req.userToken._id);
      let oldAvatarUrl = user.avatarUrl;
      user.avatarUrl = req.file.filename;
      if (req.file.filename !== oldAvatarUrl) {
        //如果旧头像和新头像不是同一张的话就删除旧头像
        deleteFile(staticDir.avatars, oldAvatarUrl);
      }
      await user.save();
      return res.status(200).send({ msg: "上传头像成功", result: req.file });
    } catch (e) {
      return res
        .status(408) //请求超时。客户端没有在服务器预备等待的时间内完成一个请求的发送。客户端可以随时再次提交这一请求而无需进行任何更改。
        .send({ msg: `上传头像操作超时,请检查请求内容,错误信息: ${e}` });
    }
  },
);

module.exports = router;
