document.addEventListener("DOMContentLoaded", function () {
  // 1. Cek apakah ada data user yang tersimpan di localStorage
  const user = JSON.parse(localStorage.getItem("userLoggedIn"));

  // Jika belum login, tendang kembali ke halaman login.html
  if (!user) {
    alert("Anda belum login! Silakan login terlebih dahulu.");
    window.location.href = "login.html";
    return;
  }

  // 2. Tampilkan Nama dan Jabatan Guru di Dashboard (jika ada elemen HTML-nya)
  const namaUserEl = document.getElementById("namaUser");
  const jabatanUserEl = document.getElementById("jabatanUser");

  if (namaUserEl) namaUserEl.textContent = user.nama || "Guru";
  if (jabatanUserEl) jabatanUserEl.textContent = user.jabatan || "-";
});

// ==========================================
// 3. FUNGSI NAVIGASI MENU DASHBOARD
// ==========================================

function bukaScan() {
  window.location.href = "scan.html";
}

function bukaAbsenMasuk() {
  window.location.href = "masuk.html"; // Atau "scan.html?tipe=masuk"
}

function bukaAbsenPulang() {
  window.location.href = "pulang.html"; // Atau "scan.html?tipe=pulang"
}

function bukaRiwayat() {
  window.location.href = "riwayat.html"; // Atau "rekap.html"
}

function bukaProfil() {
  window.location.href = "profil.html";
}

// ==========================================
// 4. FUNGSI LOGOUT
// ==========================================
function logoutUser() {
  if (confirm("Apakah Anda yakin ingin keluar?")) {
    localStorage.removeItem("userLoggedIn");
    window.location.href = "login.html";
  }
}