const fs = require("fs");
const { STATICPATH } = require("../../staticPathProvider");

const staticDir = {
  avatars: "avatars",
  images: "images",
};

function deleteFile(fileDir, fileName) {
  fs.unlink(`${STATICPATH}/${fileDir}/${fileName}`, (_) => {});
}
exports.deleteFile = deleteFile;
exports.staticDir = staticDir;
