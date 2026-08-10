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

// Contoh logika saat status berhasil didapatkan dari server
const statusText = document.getElementById("statusText");
const statusContainer = statusText.closest("div") || statusText.parentElement;

if (response.sudahAbsen || statusData === "hadir" || statusData === "pulang" || statusData.includes("terlambat")) {
    statusText.innerText = "Sudah Absen";
    
    // Ubah warna latar belakang dan teks menjadi hijau
    statusContainer.style.backgroundColor = "rgba(16, 185, 129, 0.2)"; // Hijau transparan elegan
    statusContainer.style.borderColor = "#10B981"; // Border hijau
    statusText.style.color = "#10B981"; // Teks hijau
} else {
    statusText.innerText = "Belum Absen";
    
    // Warna merah untuk belum absen
    statusContainer.style.backgroundColor = "rgba(239, 68, 68, 0.2)";
    statusContainer.style.borderColor = "#EF4444";
    statusText.style.color = "#EF4444";
}
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
// 4. FUNGSI LOGOUT (DIUBAH KE index.html)
// ==========================================
function logoutUser() {
  if (confirm("Apakah Anda yakin ingin keluar?")) {
    localStorage.removeItem("userLoggedIn");
    // Diubah dari login.html menjadi index.html
    window.location.href = "index.html";
  }
}