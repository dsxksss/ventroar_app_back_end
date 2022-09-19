const multer = require("multer");
const fs = require("fs");

/**
 * @param {string}      diskStorage 存储模板
 * @return {multer.Multer}      result Multer实例
 */
const upload = function (diskStorage) {
  const result = multer({
    storage: multer.diskStorage(diskStorage),
    limits: { fileSize: 500000 }, //10mb限制
  });
  return result;
};

const { STATICPATH } = require("../../staticPathProvider");

//存储img文件的存储模板
const DIRIMGNAME = `${STATICPATH}/images`; //存放img地址
const Img = {
  destination: (_req, _file, callback) => {
    if (!fs.existsSync(DIRIMGNAME)) fs.mkdirSync(DIRIMGNAME);
    callback(null, DIRIMGNAME);
  },
  filename: (_req, file, callback) => {
    callback(null, `${Date.now()}--${file.originalname}`);
  },
};

//存储用户头像文件的存储模板
const DIRUSERAVATARNAME = `${STATICPATH}/avatars`; //存放img地址
const UserAvatar = {
  destination: (_req, _file, callback) => {
    if (!fs.existsSync(DIRUSERAVATARNAME)) fs.mkdirSync(DIRUSERAVATARNAME);
    callback(null, DIRUSERAVATARNAME);
  },
  filename: (req, file, callback) => {
    callback(null, `${req.userToken._id}--${file.originalname}`);
  },
};

exports.upload = upload;
exports.diskStorage = {
  Img,
  UserAvatar,
};
