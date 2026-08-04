document.addEventListener("DOMContentLoaded", function () {
  // 1. Cek apakah ada data user yang tersimpan di localStorage
  const user = JSON.parse(localStorage.getItem("userLoggedIn"));

  // Jika belum login, tendang kembali ke halaman login.html
  if (!user) {
    alert("Anda belum login! Silakan login terlebih dahulu.");
    window.location.href = "login.html";
    return;
  }

  // 2. Tampilkan Nama dan Jabatan Guru di Dashboard
  const namaUserEl = document.getElementById("namaUser");
  const jabatanUserEl = document.getElementById("jabatanUser");

  if (namaUserEl) namaUserEl.textContent = user.nama || "Guru";
  if (jabatanUserEl) jabatanUserEl.textContent = user.jabatan || "-";
});

// ==========================================
// 3. FUNGSI NAVIGASI / AKSI MENU DASHBOARD
// ==========================================
function handleAction(actionName) {
  switch (actionName) {
    case 'Absen Selfie':
      window.location.href = "scan.html";
      break;
    case 'Absen Masuk':
      window.location.href = "masuk.html"; // Sesuaikan ke file tujuan Anda
      break;
    case 'Absen Pulang':
      window.location.href = "pulang.html"; // Sesuaikan ke file tujuan Anda
      break;
    case 'Riwayat':
      window.location.href = "riwayat.html";
      break;
    case 'Profil':
      window.location.href = "profil.html";
      break;
    default:
      console.warn("Aksi tidak dikenal:", actionName);
  }
}

// Fungsi alternatif jika dipanggil terpisah
function bukaScan() { window.location.href = "scan.html"; }
function bukaAbsenMasuk() { window.location.href = "masuk.html"; }
function bukaAbsenPulang() { window.location.href = "pulang.html"; }
function bukaRiwayat() { window.location.href = "riwayat.html"; }
function bukaProfil() { window.location.href = "profil.html"; }

// ==========================================
// 4. FUNGSI LOGOUT
// ==========================================
function logoutUser() {
  if (confirm("Apakah Anda yakin ingin keluar?")) {
    localStorage.removeItem("userLoggedIn");
    window.location.href = "login.html";
  }
}