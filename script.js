const BASE_URL = "https://suriyawan-saffari-backend.onrender.com/api/seller";

// 🔐 Login
function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        localStorage.setItem("sellerToken", data.token);
        document.getElementById("loginSection").classList.add("hidden");
        document.getElementById("dashboardSection").classList.remove("hidden");
        loadSellerProfile();
        loadProducts();
      } else {
        alert("❌ Login failed: " + data.message);
      }
    })
    .catch(() => alert("⚠️ Server error. Please try again later."));
}

// 🔓 Logout
function logout() {
  localStorage.removeItem("sellerToken");
  location.reload();
}

// ➕ Add Product
function addProduct() {
  const name = document.getElementById("productName").value.trim();
  const price = document.getElementById("productPrice").value.trim();
  const description = document.getElementById("productDesc").value.trim();
  const token = localStorage.getItem("sellerToken");

  if (!token) return alert("❌ Please login again");

  fetch(`${BASE_URL}/product`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ name, price, description })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("✅ Product added!");
        document.getElementById("productName").value = "";
        document.getElementById("productPrice").value = "";
        document.getElementById("productDesc").value = "";
        loadProducts();
      } else {
        alert("❌ " + data.message);
      }
    })
    .catch(() => alert("⚠️ Error adding product"));
}

// 📋 Load All Products
function loadProducts() {
  const token = localStorage.getItem("sellerToken");
  if (!token) return;

  fetch(`${BASE_URL}/products`, {
    headers: { "Authorization": "Bearer " + token }
  })
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("productList");
      list.innerHTML = "";

      if (data.products && data.products.length > 0) {
        data.products.forEach(product => {
          const li = document.createElement("li");
          li.innerHTML = `
            <strong>${product.name}</strong> - ₹${product.price}<br>
            <small>${product.description}</small>
            <!-- ✏️ Future: Edit/Delete buttons can be added here -->
          `;
          list.appendChild(li);
        });
      } else {
        list.innerHTML = "<li>No products found.</li>";
      }
    })
    .catch(() => alert("⚠️ Could not fetch products"));
}

// 🧑‍💼 Load Seller Profile
function loadSellerProfile() {
  const token = localStorage.getItem("sellerToken");
  if (!token) return;

  fetch(`${BASE_URL}/profile`, {
    headers: { "Authorization": "Bearer " + token }
  })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.seller) {
        document.getElementById("profileUsername").textContent = data.seller.username;
        document.getElementById("profileCategory").textContent = data.seller.category || "Not Set";
        document.getElementById("profilePincode").textContent = data.seller.pincode || "Not Set";
      }
    })
    .catch(() => console.log("⚠️ Failed to load seller profile"));
}

// 🚀 Auto Login
window.onload = () => {
  const token = localStorage.getItem("sellerToken");
  if (token) {
    document.getElementById("loginSection").classList.add("hidden");
    document.getElementById("dashboardSection").classList.remove("hidden");
    loadSellerProfile();
    loadProducts();
  }
};
