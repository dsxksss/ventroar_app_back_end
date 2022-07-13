# QuickStart🚀:

## 1、克隆项目到本地

```bash
git clone https://github.com/dsxksss/ventraor_app_back_end.git
```

## 2、进入到项目目录

```bash
cd ventraor_app_back_end
```

## 3、利用yarn或npm安装必要库

```bash
yarn install
```

- **或者**

```bash
npm install
```

## 4、yarn或npm二选一方式以开发模式运行项目

```bash
yarn run dev
```

- **或者**

```bash
npm run dev
```

# API说明(路由路径规范为全小写)

| api名称                  | 路由路径                 | 作用                 | 参数                  |
| ---------------------- | -------------------- | ------------------ | ------------------- |
| **signIn**             | /signin              | 登录账号               | account,password    |
| **SignUp**             | /signup              | 注册账号(不提供激活但发送验证邮件) | name,email,password |
| **EmailActivation**    | /emailactivation     | 作用于接受邮箱激活账号        | null                |
| **RePassword**         | /repassword          | 发送修改密码的验证邮件        | email               |
| **RePasswordValidate** | /repassword/validate | 作用于接受邮箱修改密码        | password            |
