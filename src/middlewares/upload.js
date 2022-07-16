const multer = require("multer");
const fs = require("fs");

/**
 * @param {string}      diskStorage 存储模板
 * @return {multer.Multer}      result Multer实例
 */
const upload = diskStorage => {
  const fileSorage = multer.diskStorage(diskStorage);
  const result = multer({ storage: fileSorage });
  return result;
};

const { STATICPATH } = require("../../staticPathProvider");
const DIRIMGNAME = `${STATICPATH}/images`; //存放img地址

//存储img文件的存储模板
const Img = {
  destination: (_req, _file, callback) => {
    if (!fs.existsSync(DIRIMGNAME)) fs.mkdirSync(DIRIMGNAME);
    callback(null, DIRIMGNAME);
  },
  filename: (_req, file, callback) => {
    callback(null, `${Date.now()}--${file.originalname}`);
  }
};

exports.upload = upload;
exports.diskStorage = {
  Img
};
