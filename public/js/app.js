// 检测登录状态
function updateAuthLinks() {
  const authLinks = document.querySelectorAll(".auth-link");
  const token = localStorage.getItem("token");

  if (token) {
    authLinks[0].style.display = "none";
    authLinks[1].style.display = "list-item";
  } else {
    authLinks[0].style.display = "list-item";
    authLinks[1].style.display = "none";
  }
}

// 页面加载时运行
document.addEventListener("DOMContentLoaded", updateAuthLinks);

// 监听存储变化（用于跨页面状态同步）
window.addEventListener("storage", updateAuthLinks);
