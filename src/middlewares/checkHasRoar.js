const { RoarTextDB } = require("../databases/roarTextDB");

module.exports = async function (req, res, next) {
  let text = await RoarTextDB.findById(req.params.roarTextId);
  if (!text) {
    return res.status(404).send({ msg: "没有找到该宣泄贴,请检查参数再确认" });
  }
  req.text = text;
  next(); //必须要有next()函数结尾，不然服务回被阻塞到这里
};
