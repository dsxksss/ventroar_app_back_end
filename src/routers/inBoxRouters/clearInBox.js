const express = require("express");
const auth = require("../../middlewares/auth");

const router = express.Router();
const { UserDB } = require("../../databases/userDB");

router.delete("/", [auth], async (req, res) => {
  let user = await UserDB.findById(req.userToken._id);
  let { inBox } = user;
  inBox = [];
  let newInBox = await UserDB.findByIdAndUpdate(
    req.userToken._id,
    { inBox },
    {
      new: true,
    },
  );
  res.status(200).send({ msg: "信件已清空", inBox: newInBox });
});

module.exports = router;
