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
  const imageFile = document.getElementById("productImage").files[0];
  const token = localStorage.getItem("sellerToken");

  if (!token) return alert("❌ Please login again");
  if (!name || !price || !description || !imageFile) {
    return alert("⚠️ Please fill all fields and select an image.");
  }

  const formData = new FormData();
  formData.append("name", name);
  formData.append("price", price);
  formData.append("description", description);
  formData.append("image", imageFile);

  fetch(`${BASE_URL}/product`, {
    method: "POST",
    headers: { "Authorization": "Bearer " + token },
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("✅ Product added!");
        document.getElementById("productName").value = "";
        document.getElementById("productPrice").value = "";
        document.getElementById("productDesc").value = "";
        document.getElementById("productImage").value = "";
        loadProducts();
      } else {
        alert("❌ " + data.message);
      }
    })
    .catch(() => alert("⚠️ Error adding product"));
}

// 📋 Load Products
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
      let count = 0;

      if (data.products && data.products.length > 0) {
        data.products.forEach(product => {
          count++;
          const li = document.createElement("li");
          li.innerHTML = `
            <img src="${product.imageUrl || ''}" alt="Image" style="width:100px;height:auto;"><br>
            <strong>${product.name}</strong> - ₹${product.price}<br>
            <small>${product.description}</small><br/>
            <span>ID: ${product._id}</span><br/>
            <button onclick="editProduct('${product._id}', \`${product.name}\`, '${product.price}', \`${product.description}\`)">✏️ Edit</button>
            <button onclick="deleteProduct('${product._id}')">🗑️ Delete</button>
            <button onclick="copyProductID('${product._id}')">📋 Copy ID</button>
            <button onclick="toggleProduct('${product._id}')">🚦 Toggle</button>
          `;
          list.appendChild(li);
        });
        document.getElementById("productCount").textContent = `Total Products: ${count}`;
      } else {
        list.innerHTML = "<li>No products found.</li>";
        document.getElementById("productCount").textContent = "Total Products: 0";
      }
    })
    .catch(() => alert("⚠️ Failed to load products"));
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
        document.getElementById("sellerId").textContent = `Seller ID: ${data.seller._id}`;
      }
    });
}

// ✏️ Edit Product
function editProduct(id, currentName, currentPrice, currentDesc) {
  const name = prompt("New Product Name:", currentName);
  const price = prompt("New Price:", currentPrice);
  const description = prompt("New Description:", currentDesc);

  const token = localStorage.getItem("sellerToken");
  if (!token) return alert("❌ Please login again");

  fetch(`${BASE_URL}/product/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ name, price, description })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("✅ Product updated!");
        loadProducts();
      } else {
        alert("❌ " + data.message);
      }
    });
}

// 🗑️ Delete Product
function deleteProduct(id) {
  if (!confirm("Delete this product?")) return;

  const token = localStorage.getItem("sellerToken");
  if (!token) return alert("❌ Please login again");

  fetch(`${BASE_URL}/product/${id}`, {
    method: "DELETE",
    headers: { "Authorization": "Bearer " + token }
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("🗑️ Product deleted");
        loadProducts();
      } else {
        alert("❌ " + data.message);
      }
    });
}

// 🔧 Update Profile
function updateProfile() {
  const category = document.getElementById("updateCategory").value.trim();
  const pincode = document.getElementById("updatePincode").value.trim();
  const password = document.getElementById("updatePassword").value.trim();
  const token = localStorage.getItem("sellerToken");

  if (!token) return alert("❌ Please login again");

  fetch(`${BASE_URL}/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ category, pincode, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("✅ Profile updated");
        loadSellerProfile();
        document.getElementById("updateCategory").value = "";
        document.getElementById("updatePincode").value = "";
        document.getElementById("updatePassword").value = "";
      } else {
        alert("❌ " + data.message);
      }
    });
}

// 🚦 Toggle Availability
function toggleProduct(id) {
  const token = localStorage.getItem("sellerToken");

  fetch(`${BASE_URL}/product/${id}/toggle`, {
    method: "PATCH",
    headers: { "Authorization": "Bearer " + token }
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message || "Toggled");
      loadProducts();
    });
}

// 📋 Copy Product ID
function copyProductID(id) {
  navigator.clipboard.writeText(id).then(() => {
    alert("📋 ID Copied!");
  });
}

// 🚀 Auto Login on Load
window.onload = () => {
  const token = localStorage.getItem("sellerToken");
  if (token) {
    document.getElementById("loginSection").classList.add("hidden");
    document.getElementById("dashboardSection").classList.remove("hidden");
    loadSellerProfile();
    loadProducts();
  }
};
