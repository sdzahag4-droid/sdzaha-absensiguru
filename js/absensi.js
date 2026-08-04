// Ganti URL di bawah ini dengan URL Web App Google Apps Script terbaru Anda
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyIreRt889UFmfNFBksAaj4Gq_WmUIsqaUpV6XeIvU-KGkKbJwfqaC13ZWV7mhiRiuG/exec";

// ==========================================
// 1. LOGIKA LOGIN (GURU & ADMIN)
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.querySelector("form");
  
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const inputs = loginForm.querySelectorAll("input");
      let username = "";
      let password = "";
      let selectedRole = "guru"; // default

      inputs.forEach(input => {
        if (input.type === "text" || input.type === "email") {
          username = input.value.trim();
        } else if (input.type === "password") {
          password = input.value.trim();
        } else if (input.type === "radio" && input.name === "role" && input.checked) {
          selectedRole = input.value;
        }
      });

      if (!username || !password) {
        alert("Username dan Password wajib diisi!");
        return;
      }

      // Mengirim data login ke Google Apps Script
      fetch(`${SCRIPT_URL}?action=login&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&role=${encodeURIComponent(selectedRole)}`)
        .then(res => res.json())
        .then(data => {
          if (data.status === "success") {
            localStorage.setItem("userLoggedIn", JSON.stringify(data.user));
            
            alert("Login Berhasil! Selamat Datang " + data.user.nama);
            
            if (data.user.role === "admin") {
              window.location.href = "admin-dashboard.html";
            } else {
              window.location.href = "dashboard.html";
            }
          } else {
            alert("Login Gagal: " + data.message);
          }
        })
        .catch(error => {
          console.error("Error Login:", error);
          alert("Terjadi kesalahan koneksi saat terhubung ke database.");
        });
    });
  }
});

// ==========================================
// 2. LOGIKA KIRIM ABSENSI
// ==========================================
function kirimAbsensi(jenisAbsen, koordinatGps = "-", statusQR = "Hadir") {
  const user = JSON.parse(localStorage.getItem("userLoggedIn"));

  if (!user) {
    alert("Sesi login Anda berakhir. Silakan login kembali.");
    window.location.href = "login.html";
    return;
  }

  // Ambil tanggal & waktu saat ini
  const sekarang = new Date();
  const tanggalHariIni = sekarang.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  const jamSekarang = sekarang.toTimeString().split(" ")[0];  // Format: HH:MM:SS

  // Siapkan data yang dikirim ke Google Sheets
  const payloadData = {
    tanggal: tanggalHariIni,
    nama: user.nama,
    masuk: jenisAbsen === "masuk" ? jamSekarang : "-",
    pulang: jenisAbsen === "pulang" ? jamSekarang : "-",
    gps: koordinatGps,
    qr: "VALID",
    status: statusQR
  };

  // Kirim data via POST request
  fetch(SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payloadData)
  })
    .then(() => {
      alert(`Absensi ${jenisAbsen.toUpperCase()} berhasil disimpan!`);
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      console.error("Error Absensi:", error);
      alert("Gagal mengirim data absensi. Periksa koneksi internet Anda.");
    });
}