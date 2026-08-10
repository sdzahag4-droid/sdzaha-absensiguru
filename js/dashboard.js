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

    // 3. Cek Status Absen dari Server (Google Apps Script)
    const SCRIPT_URL = "URL_WEB_APP_ANDA_DISINI"; // Ganti dengan URL deployment Google Apps Script Anda
    const statusText = document.getElementById("statusText");
    const statusContainer = statusText ? (statusText.closest("div") || statusText.parentElement) : null;

    if (SCRIPT_URL && statusText && statusContainer) {
        fetch(`${SCRIPT_URL}?action=getStatus&nama=${encodeURIComponent(user.nama)}`)
            .then(response => response.json())
            .then(data => {
                // Kondisi jika sudah melakukan absensi (berubah jadi hijau)
                if (data.sudahAbsen || data.status === "hadir" || data.status === "pulang" || (data.status && data.status.toLowerCase().includes("terlambat"))) {
                    statusText.innerText = "Sudah Absen";
                    
                    // Ubah warna latar belakang, border, dan teks menjadi hijau elegan
                    statusContainer.style.backgroundColor = "rgba(16, 185, 129, 0.2)";
                    statusContainer.style.borderColor = "#10B981";
                    statusText.style.color = "#10B981";
                } else {
                    statusText.innerText = "Belum Absen";
                    
                    // Warna merah untuk belum absen
                    statusContainer.style.backgroundColor = "rgba(239, 68, 68, 0.2)";
                    statusContainer.style.borderColor = "#EF4444";
                    statusText.style.color = "#EF4444";
                }
            })
            .catch(err => {
                console.error("Gagal memuat status absen:", err);
            });
    }
});

// ==========================================
// 4. FUNGSI NAVIGASI / AKSI MENU DASHBOARD
// ==========================================
function handleAction(actionName) {
    switch (actionName) {
        case 'Absen Selfie':
            window.location.href = "scan.html";
            break;
        case 'Absen Masuk':
            window.location.href = "masuk.html";
            break;
        case 'Absen Pulang':
            window.location.href = "pulang.html";
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
// 5. FUNGSI LOGOUT (DIUBAH KE index.html)
// ==========================================
function logoutUser() {
    if (confirm("Apakah Anda yakin ingin keluar?")) {
        localStorage.removeItem("userLoggedIn");
        window.location.href = "index.html";
    }
}