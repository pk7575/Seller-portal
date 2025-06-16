// logout.js

// 🔐 Logout function
function logoutUser() {
  // 🧹 Clear localStorage tokens
  localStorage.removeItem("ownerToken");
  localStorage.removeItem("sellerToken");
  localStorage.removeItem("customerToken");
  localStorage.removeItem("deliveryToken");
  localStorage.removeItem("ownerData");
  localStorage.removeItem("sellerData");
  localStorage.removeItem("customerData");
  localStorage.removeItem("deliveryData");

  // 🔁 Optional: Clear session storage (if used)
  sessionStorage.clear();

  // 🚪 Redirect to login page
  if (window.location.pathname.includes("owner")) {
    window.location.href = "login.html";
  } else if (window.location.pathname.includes("seller")) {
    window.location.href = "../seller/login.html";
  } else if (window.location.pathname.includes("customer")) {
    window.location.href = "../customer/login.html";
  } else if (window.location.pathname.includes("delivery")) {
    window.location.href = "../delivery/login.html";
  } else {
    window.location.href = "login.html";
  }
}

// 🔘 Event listener (if logout button exists)
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const confirmLogout = confirm("🔒 Are you sure you want to logout?");
      if (confirmLogout) logoutUser();
    });
  }
});
