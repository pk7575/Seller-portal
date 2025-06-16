// logout.js

// 🔐 Logout function
function logoutUser() {
  // 🧹 Clear localStorage tokens for all portals
  localStorage.removeItem("owner_token");
  localStorage.removeItem("seller_token");
  localStorage.removeItem("customer_token");
  localStorage.removeItem("delivery_token");

  // 🧹 Clear any stored user data
  localStorage.removeItem("ownerData");
  localStorage.removeItem("sellerData");
  localStorage.removeItem("customerData");
  localStorage.removeItem("deliveryData");

  // 🔁 Optional: Clear session storage
  sessionStorage.clear();

  // 🚪 Redirect to appropriate login page
  const path = window.location.pathname.toLowerCase();

  if (path.includes("owner")) {
    window.location.href = "../owner/login.html";
  } else if (path.includes("seller")) {
    window.location.href = "../seller/login.html";
  } else if (path.includes("customer")) {
    window.location.href = "../customer/login.html";
  } else if (path.includes("delivery")) {
    window.location.href = "../delivery/login.html";
  } else {
    window.location.href = "login.html";
  }
}

// 🔘 Attach logout listener if button is present
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
