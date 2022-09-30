const express = require("express");
const multer = require("multer");
const auth = require("../../middlewares/auth");
const { upload, diskStorage } = require("../../middlewares/upload");
const checkHasRoar = require("../../middlewares/checkHasRoar");
const { RoarTextDB } = require("../../databases/roarTextDB");
const { deleteFile, staticDir } = require("../../functions/deleteFile");
const checkImagesUpload = upload({
  diskStorage: diskStorage.Img,
  //文件大小设置
  limits: {
    files: 4, // 最多允许发送1个文件,
    fileSize: 50 * 1024 * 1024, //50mb限制
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
    cb(null, true);
  },
}).array("images");
const router = express.Router();

// 上传帖子图片路由;
router.post(
  `/:roarTextId`,
  [auth, checkHasRoar],
  async (req, res) => {
    try {
      checkImagesUpload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_COUNT") {
            return res.status(400).send({ msg: "上传图片超过数量,最多只允许接收4张图片!" });
          } else if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).send({ msg: `图片集大小不能超过50mb!` });
          } else {
            return res.status(400).send({ msg: `上传图片时发生错误! ${err.field}` });
          }
        } else if (err) {
          return res.status(400).send({ msg: `上传图片时发生其他错误! ${err}` });
        }

        if (req.files === undefined || req.files.length <= 0) {
          return res.status(400).send({ msg: "不能上传空内容,请检查后重试!" });
        }

        if (req.text.userId !== req.userToken._id) {
          return res.status(403).send({ msg: "你没有权限这么做!" });
        }

        //暂时存储旧照片集url
        let oldImagesUrl = req.text.textImages;
        //存储新照片集url
        req.text.textImages = [];
        req.files.forEach((item) => req.text.textImages.push(item.filename));
        if (req.text.textImages !== []) {
          for (let e of oldImagesUrl) {
            deleteFile(staticDir.images, e);
          }
        }

        const newText = await RoarTextDB.findByIdAndUpdate(
          req.params.roarTextId,
          { textImages: req.text.textImages },
          { new: true },
        );

        return res.status(200).send({ msg: "上传图片成功", result: newText });
      });
    } catch (e) {
      return res
        .status(408) //请求超时。客户端没有在服务器预备等待的时间内完成一个请求的发送。客户端可以随时再次提交这一请求而无需进行任何更改。
        .send({ msg: `上传图片操作超时,请检查请求内容,错误信息: ${e}` });
    }
  },
);

module.exports = router;
