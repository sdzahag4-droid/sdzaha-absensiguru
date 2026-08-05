// Ganti URL di bawah ini dengan URL Web App Google Apps Script terbaru Anda
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyIreRt889UFmfNFBksAaj4Gq_WmUIsqaUpV6XeIvU-KGkKbJwfqaC13ZWV7mhiRiuG/exec";

function loginUser(username, password) {
  // Mengirim permintaan login ke Google Apps Script tanpa spasi
  fetch(`${SCRIPT_URL}?action=login&username=${username}&password=${password}`)
    .then(res => res.json())
    .then(data => {
      if (data.status === "success") {
        // Simpan data guru yang login ke localStorage browser
        localStorage.setItem("userLoggedIn", JSON.stringify(data.user));
        
        alert("Login Berhasil! Selamat Datang " + data.user.nama);
        
        // Arahkan ke halaman dashboard
        window.location.href = "dashboard.html";
      } else {
        alert("Login Gagal: " + data.message);
      }
    })
    .catch(error => {
      console.error("Error Login:", error);
      alert("Terjadi kesalahan koneksi saat login.");
    });
}