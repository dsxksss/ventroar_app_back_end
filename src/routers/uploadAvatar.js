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
    user.avatarUrl = req.file.filename;
    await user.save();
    res.status(200).send({ msg: "上传头像成功", file: req.file });
  },
);

module.exports = router;
