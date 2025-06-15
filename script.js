const BASE_URL = "https://suriyawan-saffari-backend.onrender.com/api/seller";

// 🔐 Login Function
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
    .catch(err => {
      console.error(err);
      alert("⚠️ Server error. Please try again later.");
    });
}

// 🔓 Logout Function
function logout() {
  localStorage.removeItem("sellerToken");
  location.reload();
}

// ➕ Add Product Function
function addProduct() {
  const name = document.getElementById("productName").value.trim();
  const price = document.getElementById("productPrice").value.trim();
  const description = document.getElementById("productDesc").value.trim();

  const token = localStorage.getItem("sellerToken");
  if (!token) return alert("❌ Unauthorized. Please login again.");

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
        alert("✅ Product added successfully!");
        loadProducts();
        document.getElementById("productName").value = "";
        document.getElementById("productPrice").value = "";
        document.getElementById("productDesc").value = "";
      } else {
        alert("❌ Failed to add product: " + data.message);
      }
    })
    .catch(err => {
      console.error(err);
      alert("⚠️ Error adding product.");
    });
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
        data.products.forEach(p => {
          const item = document.createElement("li");
          item.innerHTML = `
            <strong>${p.name}</strong> - ₹${p.price} <br/>
            <small>${p.description}</small>
          `;
          list.appendChild(item);
        });
      } else {
        list.innerHTML = "<li>No products added yet.</li>";
      }
    })
    .catch(err => {
      console.error(err);
      alert("⚠️ Failed to load products.");
    });
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
    .catch(err => {
      console.error("⚠️ Error loading profile", err);
    });
}

// 🚀 Auto Login if Token Exists
window.onload = () => {
  const token = localStorage.getItem("sellerToken");
  if (token) {
    document.getElementById("loginSection").classList.add("hidden");
    document.getElementById("dashboardSection").classList.remove("hidden");
    loadSellerProfile();
    loadProducts();
  }
};
