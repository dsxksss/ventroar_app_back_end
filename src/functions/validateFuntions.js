const Joi = require("joi"); //导入数据验证库

/**
 * @functions 创建User格式验证函数
 * @return {boolean} 如果验证正确返回true
 */
const createUserValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(10).required(),
    email: Joi.string().email().max(20).required(),
    password: Joi.string().min(8).max(20).required(),
  });
  //返回验证结果
  return schema.validate(data);
};

/**
 * @functions 创建RoarText格式验证函数
 * @return {boolean} 如果验证正确返回true
 */
const createRoarTextValidation = (data) => {
  const schema = Joi.object({
    text: Joi.string().min(3).max(510).required(),
    isShowUserName: Joi.boolean().required(),
    isPublic: Joi.boolean().required(),
    isCanComment: Joi.boolean().required(),
  });
  //返回验证结果
  return schema.validate(data);
};

/**
 * @functions 登录格式验证函数
 * @return {boolean} 如果验证正确返回true
 */
const signInValidation = (data) => {
  const schema = Joi.object({
    account: Joi.string().min(3).max(20).required(),
    password: Joi.string().min(8).max(20).required(),
  });
  return schema.validate(data);
};

/**
 * @functions 邮箱格式验证函数
 * @return {boolean} 如果验证正确返回true
 */
const emailValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().max(20).required(),
  });
  return schema.validate(data);
};

/**
 * @functions 密码格式验证函数
 * @return {boolean} 如果验证正确返回true
 */
const passwordValidation = (data) => {
  const schema = Joi.object({
    password: Joi.string().min(8).max(20).required(),
  });
  return schema.validate(data);
};

/**
 * @functions 昵称格式验证函数
 * @return {boolean} 如果验证正确返回true
 */
const nameValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(10).required(),
  });
  return schema.validate(data);
};

/**
 * @functions 点赞格式验证函数
 * @return {boolean} 如果验证正确返回true
 */
const likesValidation = (data) => {
  const schema = Joi.object({
    textId: Joi.string().min(10).max(50).required(),
    smil: Joi.boolean(),
    heart: Joi.boolean(),
  });
  return schema.validate(data);
};

/**
 * @functions id格式验证函数
 * @return {boolean} 如果验证正确返回true
 */
const idValidation = (data) => {
  const schema = Joi.object({
    id: Joi.string().min(10).max(50).required(),
  });
  return schema.validate(data);
};

/**
 * @functions 修改RoarText数据格式验证函数
 * @return {boolean} 如果验证正确返回true
 */
const roarTextValidation = (data) => {
  const schema = Joi.object({
    textId: Joi.string().min(10).max(50).required(),
    text: Joi.string().min(3).max(510).required(),
    isShowUserName: Joi.boolean().required(),
    isPublic: Joi.boolean().required(),
    isCanComment: Joi.boolean().required(),
  });
  //返回验证结果
  return schema.validate(data);
};

/**
 * @functions 回贴RoarText数据格式验证函数
 * @return {boolean} 如果验证正确返回true
 */
const backRoarTextValidation = (data) => {
  const schema = Joi.object({
    textId: Joi.string().min(10).max(50).required(),
    backText: Joi.string().min(3).max(510).required(),
    isShowUserName: Joi.boolean().required(),
  });
  //返回验证结果
  return schema.validate(data);
};

exports.createUserValidation = createUserValidation; //创建用户数据格式模板
exports.createRoarTextValidation = createRoarTextValidation; //创建发泄帖子数据格式模板
exports.signInValidation = signInValidation; //登录账户数据格式模板
exports.emailValidation = emailValidation; //邮箱格式模板
exports.passwordValidation = passwordValidation; //密码格式模板
exports.nameValidation = nameValidation; //昵称格式模板
exports.likesValidation = likesValidation; //点赞格式模板
exports.idValidation = idValidation; //id格式模板
exports.roarTextValidation = roarTextValidation; //修改宣泄帖格式模板
exports.backRoarTextValidation = backRoarTextValidation; //回复宣泄帖格式模板
