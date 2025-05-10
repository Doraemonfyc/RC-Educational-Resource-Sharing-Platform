const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// 注册接口
router.post("/api/register", async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // 1. 验证输入数据
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "两次输入的密码不一致" });
    }

    // 2. 检查邮箱是否已注册
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "该邮箱已被注册" });
    }

    // 3. 创建新用户
    const newUser = await User.create({
      name: username,
      email,
      password,
    });

    // 4. 生成JWT令牌
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    // 处理Mongoose验证错误
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ error: errors.join(", ") });
    }
    res.status(500).json({ error: "注册失败，请稍后重试" });
  }
});

// 登录接口
router.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. 验证用户存在性
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "无效的登录凭证" });

    // 2. 验证密码
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: "密码错误" });

    // 3. 生成JWT令牌
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "服务器错误" });
  }
});

// 获取用户信息
router.get("/api/profile", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password -__v");

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "获取信息失败" });
  }
});

// 身份验证中间件
function authenticate(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) return res.status(401).json({ error: "未授权访问" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: "无效的令牌" });
  }
}

router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "服务器内部错误" });
});

module.exports = router;
