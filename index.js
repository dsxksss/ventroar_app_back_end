//第三方库
const express = require("express"); //express框架
const cors = require("cors"); //处理本地调试跨域问题
const morgan = require("morgan"); //morgan是一个记录http请求日志的中间件
const fs = require("fs"); //node自带的文件读取,这里用于https证书的读取
const path = require("path"); //node自带的路径处理库
const checkCofing = require("./src/functions/checkConfig");
const dbInit = require("./src/databases/dbInit");
const { sendBoxMsg } = require("./src/functions/sendBoxMsg");

// 启动服务前先监测必要的配置信息是否存在
checkCofing();

//在array对象的原型上添加此函数,使全部array对象都可以使用此方法
Array.prototype.sendBoxMsg = sendBoxMsg;
const app = express();

dbInit(app);

//导入注册路由
const signIn = require("./src/routers/signIn");
const signUp = require("./src/routers/signUp");
const signOut = require("./src/routers/signOut");
const tokenLogin = require("./src/routers/tokenLogin");
const rePassword = require("./src/routers/rePassword");
const emailActivation = require("./src/routers/emailActivation");
const sendActivationEmail = require("./src/routers/sendActivationEmail");
const uploadAvatar = require("./src/routers/uploadAvatar");
const reUserName = require("./src/routers/reUserName");
const reEmail = require("./src/routers/reEmail");
const getUserInBox = require("./src/routers/inBoxRouters/getUserInBox");
const readBoxMsg = require("./src/routers/inBoxRouters/readBoxMsg");
const deleteBoxMsg = require("./src/routers/inBoxRouters/deleteBoxMsg");
const clearInBox = require("./src/routers/inBoxRouters/clearInBox");
const postRoarText = require("./src/routers/roarTextRouters/postRoarText");
const postTextImages = require("./src/routers/roarTextRouters/postTextImages");
const getAllRoarText = require("./src/routers/roarTextRouters/getAllRoarText");
const clickTextLikes = require("./src/routers/roarTextRouters/clickTextLikes");
const putRoarText = require("./src/routers/roarTextRouters/putRoarText");
const deleteRoarText = require("./src/routers/roarTextRouters/deleteRoarText");
const addFriend = require("./src/routers/friendRouters/addFriend");
const agreeAddFriend = require("./src/routers/friendRouters/agreeAddFriend");
const removeFriend = require("./src/routers/friendRouters/removeFriend");
const getAllFriend = require("./src/routers/friendRouters/getAllFriend");
const getRoarComments = require(
  "./src/routers/roarTextRouters/getRoarComments",
);
const getUserAllRoarText = require(
  "./src/routers/roarTextRouters/getUserAllRoarText",
);
const postRoarTextComment = require(
  "./src/routers/roarTextRouters/postRoarTextComment",
);
const deleteRoarTextComment = require(
  "./src/routers/roarTextRouters/deleteRoarTextComment",
);

//SM:中间件
//数据转换成req.body的JSON
app.use(express.json());
//解决跨域问题
app.use(cors());
//开放静态资源
app.use(express.static(path.join(__dirname, "static")));
//环境为开发环境启动的log
let logStream = fs.createWriteStream(path.join(__dirname, "ventroar_app.log"), {
  flags: "a",
});
app.use(morgan("combined", { stream: logStream }));
console.log("morgan[combined] log starting~");

//注册路由
app.use("/signin", signIn);
app.use("/signup", signUp);
app.use("/signout", signOut);
app.use("/tokenlogin", tokenLogin);
app.use("/repassword", rePassword);
app.use("/emailactivation", emailActivation);
app.use("/sendactivationemail", sendActivationEmail);
app.use("/uploadavatar", uploadAvatar);
app.use("/reusername", reUserName);
app.use("/reemail", reEmail);
app.use("/getuserinbox", getUserInBox);
app.use("/readboxmsg", readBoxMsg);
app.use("/deleteboxmsg", deleteBoxMsg);
app.use("/clearinbox", clearInBox);
app.use("/postroartext", postRoarText);
app.use("/posttextimages", postTextImages);
app.use("/getallroartext", getAllRoarText);
app.use("/clicktextlikes", clickTextLikes);
app.use("/putroartext", putRoarText);
app.use("/deleteroartext", deleteRoarText);
app.use("/addfriend", addFriend);
app.use("/agreeaddfriend", agreeAddFriend);
app.use("/removefriend", removeFriend);
app.use("/getallfriend", getAllFriend);
app.use("/getroarcomments", getRoarComments);
app.use("/getuserallroartext", getUserAllRoarText);
app.use("/postroartextcomment", postRoarTextComment);
app.use("/deleteroartextcomment", deleteRoarTextComment);
