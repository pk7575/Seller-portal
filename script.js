const BASE_URL = "https://suriyawan-saffari-backend.onrender.com/api/seller";

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("sellerToken");
  if (token) {
    document.getElementById("login-section").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");
    loadProducts();
  }
});

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
        document.getElementById("login-section").classList.add("hidden");
        document.getElementById("dashboard").classList.remove("hidden");
        loadProducts();
      } else {
        alert("❌ Login failed: " + data.message);
      }
    })
    .catch(err => alert("⚠️ Server error"));
}

function logout() {
  localStorage.removeItem("sellerToken");
  location.reload();
}

function addProduct() {
  const name = document.getElementById("productName").value;
  const price = document.getElementById("productPrice").value;
  const description = document.getElementById("productDesc").value;

  const token = localStorage.getItem("sellerToken");

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
        loadProducts();
      } else {
        alert("❌ Failed: " + data.message);
      }
    })
    .catch(err => alert("⚠️ Error adding product"));
}

function loadProducts() {
  const token = localStorage.getItem("sellerToken");

  fetch(`${BASE_URL}/products`, {
    headers: { "Authorization": "Bearer " + token }
  })
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("productList");
      list.innerHTML = "";

      if (data.products && data.products.length > 0) {
        data.products.forEach(p => {
          const card = document.createElement("div");
          card.classList.add("product-card");
          card.innerHTML = `
            <h4>${p.name}</h4>
            <p>₹${p.price}</p>
            <p>${p.description}</p>
          `;
          list.appendChild(card);
        });
      } else {
        list.innerHTML = "<p>No products yet.</p>";
      }
    })
    .catch(err => {
      alert("⚠️ Failed to load products");
    });
}
