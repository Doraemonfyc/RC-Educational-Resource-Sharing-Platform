// 注册表单提交处理
document
  .getElementById("registerForm")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      username: e.target.username.value,
      email: e.target.email.value,
      password: e.target.password.value,
      confirmPassword: e.target.confirmPassword.value,
    };

    // 前端密码验证
    if (formData.password !== formData.confirmPassword) {
      showAlert("两次输入的密码不一致", "error");
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      // 注册成功后自动登录
      localStorage.setItem("token", data.token);
      showAlert("注册成功！", "success");

      // 2秒后跳转到个人中心
      setTimeout(() => {
        window.location.href = "/profile";
      }, 2000);
    } catch (error) {
      showAlert(error.message, "error");
    }
  });

// 显示提示的函数
function showAlert(message, type = "info") {
  const alertDiv = document.createElement("div");
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;

  document.querySelector(".auth-container").prepend(alertDiv);

  // 3秒后自动消失
  setTimeout(() => {
    alertDiv.remove();
  }, 3000);
}

// 登录表单提交
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    email: e.target.email.value,
    password: e.target.password.value,
  };

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.error);

    // 存储令牌
    localStorage.setItem("token", data.token);

    // 跳转到个人中心
    window.location.href = "/profile";
  } catch (error) {
    showAlert(error.message, "error");
  }
});

// 自动获取用户信息
async function loadProfile() {
  const token = localStorage.getItem("token");

  if (!token) return (window.location.href = "/login");

  try {
    const response = await fetch("/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const user = await response.json();

    // 填充表单数据
    document.querySelector('input[name="name"]').value = user.name || "";
    document.querySelector('input[name="phone"]').value = user.phone || "";
    document.querySelector('textarea[name="address"]').value =
      user.address || "";
  } catch (error) {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }
}

// 页面加载时执行
if (document.querySelector(".profile-container")) {
  loadProfile();
}
