const Joi = require("joi"); //导入数据验证库

/**
 * @functions 创建User格式验证函数
 * @return {boolean} 如果验证正确返回true
 */
const createUserValidation = data => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(8).required(),
    email: Joi.string().email().max(20).required(),
    password: Joi.string().min(8).max(20).required()
  });
  //返回验证结果
  return schema.validate(data);
};

/**
 * @functions 登录格式验证函数
 * @return {boolean} 如果验证正确返回true
 */
const signInValidation = data => {
  const schema = Joi.object({
    account: Joi.string().min(3).max(20).required(),
    password: Joi.string().min(8).max(20).required()
  });
  return schema.validate(data);
};

/**
 * @functions 邮箱格式验证函数
 * @return {boolean} 如果验证正确返回true
 */
const emailValidation = data => {
  const schema = Joi.object({
    email: Joi.string().email().max(20).required()
  });
  return schema.validate(data);
};

/**
 * @functions 密码格式验证函数
 * @return {boolean} 如果验证正确返回true
 */
const rePasswordValidation = data => {
  const schema = Joi.object({
    password: Joi.string().min(8).max(20).required()
  });
  return schema.validate(data);
};
exports.createUserValidation = createUserValidation; //创建用户数据格式模板
exports.signInValidation = signInValidation; //登录账户数据格式模板
exports.emailValidation = emailValidation; //邮箱格式模板
exports.rePasswordValidation = rePasswordValidation; //密码格式模板
