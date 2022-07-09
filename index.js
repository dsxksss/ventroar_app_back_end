//SM:导入库
const express = require("express"); //express框架
const mongoose = require("mongoose"); //操纵MongoDB数据库的库
const cors = require("cors"); //处理本地调试跨域问题
const morgan = require("morgan"); //morgan是一个记录http请求日志的中间件
const config = require("config"); //读取配置文件信息库
const fs = require("fs"); //node自带的文件读取,这里用于https证书的读取
const https = require("https"); //创建https监听
const signup = require("./src/routers/signUp");
const app = express();

//检查环境变量是否设置,如果没设置的话则强制退出程序
//has代表是否存在于此环境变量
let HASENV_ERROR_NAME = []; //缺少的环境变量名字
let HASCONFIGF_ERROR_NAME = []; //缺少的配置文件变量名字
const HASENV = () => {
  if (!config.has("jwtkey")) {
    HASENV_ERROR_NAME.push("jwtket");
  }
  if (!config.has("sendMailPassword")) {
    HASENV_ERROR_NAME.push("sendMailPassword");
  }
  if (!config.has("runMode")) {
    HASENV_ERROR_NAME.push("runMode");
  }
  const result =
    !config.has("jwtkey") || //jwtTokenKey
    !config.has("sendMailPassword") || //邮箱发送服务的密码
    !config.has("runMode"); //启动模式(development and production)
  return result;
};
//has代表是否存在于此环境变量
const HASCONFIGF = () => {
  if (!config.has("jwtkey")) {
    HASCONFIGF_ERROR_NAME.push("jwtket");
  }
  if (!config.has("sendMailPassword")) {
    HASCONFIGF_ERROR_NAME.push("sendMailPassword");
  }
  if (!config.has("runMode")) {
    HASCONFIGF_ERROR_NAME.push("runMode");
  }
  $env: LOCAL_MAIL_PASS = "";
  const result =
    !config.has("sendMailConfig.sender") || //邮箱发送者名字
    !config.has("dbConfig.debugDbConfig.host") || //debug运行环境下的host
    !config.has("dbConfig.debugDbConfig.port") || //debug运行环境下的port
    !config.has("dbConfig.releaseDbConfig.host") || //release运行环境下的host
    !config.has("dbConfig.releaseDbConfig.port"); //release运0行环境下的port
  return result;
};

if (HASENV()) {
  console.log(`缺少所需的环境变量[${HASENV_ERROR_NAME}],请初始化环境变量再次启动服务...`);
  process.exit(1);
}

if (HASCONFIGF()) {
  console.log(`配置文件default.json属性值[${HASCONFIGF_ERROR_NAME}],请检查配置文件再次启动服务...`);
  process.exit(1);
}

//MongoDB数据库连接
mongoose
  //先连接这个数据库表
  //如果没有的话就创建这个表
  .connect("mongodb://localhost/ventroarAppApi")
  .then(() => console.log("Connect DataBase...... OK"))
  .catch(err => {
    console.log(`Could not connect to dataBase [ ${err} ] !!!`);
  });

//SM:中间件
//数据转换成req.body的JSON
app.use(express.json());
//解决跨域问题
app.use(cors());

/**
 * @import RoutersFile... 导入路由模组
 * @name signUp   注册用户、找回密码等
 */
app.use("/signup", signup);

//环境为开发环境启动的log
if (config.get("runMode") === "development") {
  //tiny是简单的log记录方式,这里使用的是dev记录格式
  app.use(morgan("dev"));
  console.log("development!,morgan[dev] log starting~");
  //适合本地测试用的端口(default:2547)
  app.listen(config.get("dbConfig.debugDbConfig.port"), () => {
    console.log(
      `localhost Server listening at http://localhost:${config.get(
        "dbConfig.debugDbConfig.port"
      )}`
    );
  });
}

//环境为生产环境启动的log
if (config.get("runMode") === "production") {
  //tiny是简单的log记录方式,这里使用的是dev记录格式
  app.use(morgan("short"));
  console.log("production!,morgan[short] log starting~");
  //开启https需要安全key文件
  //读取安全keyfile
  const keyfile = {
    key: fs.readFileSync("ventroar.xyz.key"),
    cert: fs.readFileSync("ventroar.xyz_bundle.crt")
  };
  //适合本地测试用的端口(default:2546)
  https
    .createServer(keyfile, app)
    .listen(config.get("dbConfig.releaseDbConfig.port"), () =>
      console.log(
        `Server listening at https://localhost:${config.get(
          "dbConfig.releaseDbConfig.port"
        )}`
      )
    );
}
