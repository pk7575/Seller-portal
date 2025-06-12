// Seller Portal Script

// 👇 Backend base URL
const BASE_URL = "https://suriyawan-saffari-backend.onrender.com";

// When page loads
document.addEventListener("DOMContentLoaded", () => {
  const welcome = document.getElementById("welcome-msg");
  if (welcome) {
    welcome.innerText = "🛒 Seller Dashboard Connected to Backend!";
  }

  // Example: Fetch seller dashboard stats
  fetch(`${BASE_URL}/api/seller/dashboard`)
    .then(res => res.json())
    .then(data => {
      console.log("📦 Seller Stats:", data);

      const statsDiv = document.getElementById("stats");
      if (statsDiv) {
        statsDiv.innerHTML = `
          <p><strong>Products:</strong> ${data.products}</p>
          <p><strong>Orders:</strong> ${data.orders}</p>
          <p><strong>Revenue:</strong> ₹${data.revenue}</p>
        `;
      }

    })
    .catch(err => {
      console.error("❌ Error connecting to backend:", err);
    });
});
