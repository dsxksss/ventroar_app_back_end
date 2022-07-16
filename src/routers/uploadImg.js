const express = require("express");

const router = express.Router();
const { upload, diskStorage } = require("../middlewares/upload");

//upload.single() 只接受单个文件上传
router.post("/", upload(diskStorage.Img).single("image"), (req, res) => {
  console.log(__dirname);
  res.status(200).send({ msg: "Upload successful", file: req.file });
});

module.exports = router;
