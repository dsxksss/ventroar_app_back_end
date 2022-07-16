const express = require("express");
const auth = require("../middlewares/auth");

const router = express.Router();
const { UserDB } = require("../databases/userDB");
const { upload, diskStorage } = require("../middlewares/upload");

//upload.single() 只接受单个文件上传
router.post(
  "/",
  [auth, upload(diskStorage.UserAvatar).single("avatar")],
  async (req, res) => {
    let user = await UserDB.findById(req.userToken._id);
    if (!user) {
      res.status(404).send({ msg: "数据库不存在此用户" });
    }
    user.avatarUrl = req.file.filename;
    await user.save();
    res.status(200).send({ msg: "Upload successful", file: req.file });
  }
);

module.exports = router;
