const mongoose = require("mongoose"); //操纵MongoDB数据库的库
const fs = require("fs"); //node自带的文件读取,这里用于https证书的读取
const config = require("config"); //读取配置文件信息库
const https = require("https"); //创建https监听
const http = require("http"); //创建http监听

function dbInit(server) {
  //MongoDB数据库连接
  mongoose
    //先连接这个数据库表
    //如果没有的话就创建这个表
    .connect("mongodb://localhost/VentRoarAppApi")
    .then(() => console.log("Connect DataBase...... OK"))
    .catch((err) => {
      console.log(`Could not connect to dataBase [ ${err} ] !!!`);
    });

  if (config.get("runMode") === "development") {
    const DEBUG_HOST = config.get("dbConfig.debugDbConfig.host");
    const DEBUG_PORT = config.get("dbConfig.debugDbConfig.port");
    //适合测试模式用的端口(default:2547)
    http
      .createServer(server)
      .listen(config.get("dbConfig.debugDbConfig.port"), () => {
        console.log(
          `localhost Server listening at ${DEBUG_HOST}:${DEBUG_PORT}/`,
        );
      });
  }

  if (config.get("runMode") === "production") {
    const RELEASE_HOST = config.get("dbConfig.releaseDbConfig.host");
    const RELEASE_PORT = config.get("dbConfig.releaseDbConfig.port");
    //开启https需要安全key文件
    //读取安全keyfile
    const keyfile = {
      key: fs.readFileSync("ventroar.xyz.key"),
      cert: fs.readFileSync("ventroar.xyz_bundle.crt"),
    };
    //适合开发模式用的端口(default:2548)
    https
      .createServer(keyfile, server)
      .listen(
        config.get("dbConfig.releaseDbConfig.port"),
        () =>
          console.log(`Server listening at ${RELEASE_HOST}:${RELEASE_PORT}/`),
      );
  }
}

module.exports = dbInit;
