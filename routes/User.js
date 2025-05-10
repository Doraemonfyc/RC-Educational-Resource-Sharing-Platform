const mongoose = require("mongoose");

// 添加密码加密中间件
const bcrypt = require("bcryptjs");

// 添加pre-save钩子
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "姓名不能为空"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "邮箱不能为空"],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "无效的邮箱格式"],
  },
  password: {
    type: String,
    required: [true, "密码不能为空"],
    minlength: [6, "密码至少6个字符"],
  },
  phone: {
    type: String,
    match: [/^1[3-9]\d{9}$/, "无效的手机号码"],
  },
  address: {
    type: String,
    maxlength: [200, "地址过长"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
