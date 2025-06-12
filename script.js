// ✅ Updated script.js for Seller Portal
const BASE_URL_SELLER = "https://suriyawan-saffari-backend.onrender.com";

fetch(`${BASE_URL_SELLER}/api/seller/orders`)
  .then(res => res.json())
  .then(data => console.log("Seller Orders:", data))
  .catch(err => console.error("Seller error:", err));
