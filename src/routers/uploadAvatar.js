const express = require("express");
const multer = require("multer");
const auth = require("../middlewares/auth");
const { deleteFile, staticDir } = require("../functions/deleteFile");
const router = express.Router();
const { UserDB } = require("../databases/userDB");
const { upload, diskStorage } = require("../middlewares/upload");
const checkUploadAvatar = upload({
  diskStorage: diskStorage.UserAvatar,
  //文件大小设置
  limits: {
    files: 1, // 最多允许发送1个文件,
    fileSize: 10 * 1024 * 1024, //10mb限制
  },
  //过滤文件设置
  fileFilter: (__req, file, cb) => {
    // 只允许发送图像文件
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(
        new multer.MulterError("LIMIT_UNEXPECTED_FILE", "只接收图片文件!!!"),
        false,
      );
    }
    return cb(null, true);
  },
})
  .single("avatar");

//upload.single() 只接受单个文件上传
router.post(
  "/",
  [auth],
  async (req, res) => {
    try {
      checkUploadAvatar(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_COUNT") {
            return res.status(400).send({ msg: "上传图片超过数量,最多只允许接收1张图片!" });
          } else if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).send({ msg: `图片大小不能超过10mb!` });
          } else {
            return res.status(400).send({ msg: `上传图片时发生错误! ${err.field}` });
          }
        } else if (err) {
          return res.status(400).send({ msg: `上传图片时发生其他错误! ${err}` });
        }

        if (req.file === undefined) {
          return res.status(400).send({ msg: "不能上传空内容,请检查后重试!" });
        }

        let user = await UserDB.findById(req.userToken._id);
        let oldAvatarUrl = user.avatarUrl;
        user.avatarUrl = req.file.filename;
        if (!err && typeof req.file !== "undefined") {
          if (req.file.filename !== oldAvatarUrl) {
            //如果旧头像和新头像不是同一张的话就删除旧头像
            deleteFile(staticDir.avatars, oldAvatarUrl);
          }
        }
        await user.save();
        return res.status(200).send({ msg: "上传头像成功", result: req.file });
      });
    } catch (e) {
      return res
        .status(408) //请求超时。客户端没有在服务器预备等待的时间内完成一个请求的发送。客户端可以随时再次提交这一请求而无需进行任何更改。
        .send({ msg: `上传头像操作超时,请检查请求内容,错误信息: ${e}` });
    }
  },
);

module.exports = router;
