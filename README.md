# QuickStart🚀:

# 1、windows powershell 命令行 下可使用此命令来设置环境变量

## 须待上类型表示符号等,如 string 类型需加上双引号

```powershell
$env:LOCAL_JWT_KEY=<环境变量值>
```

# 2、windows cmd 命令行 下可使用此命令来设置环境变量

```bash
set LOCAL_JWT_KET=<环境变量值>
```

# 3、设置好以上环境变量之后,再到终端运行一下命令

```bash
node main.js
```

# 项目说明

- 项目中多次出现的req表示: 客户端发来的请求
- 项目中多次出现的res表示: 服务端的回应
- 项目中多次出现的next表示:
  next()函数,next()函数是作用于与下一个中间件或者router连接的桥梁,如果没有加上next()函数的话,该请求会被阻塞至此处!!!
