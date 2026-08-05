const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyIreRt889UFmfNFBksAaj4Gq_WmUIsqaUpV6XeIvU-KGkKbJwfqaC13ZWV7mhiRiuG/exec";

function muatRekapBulanan(bulan) {
  // 1. Ambil data user dari localStorage
  const user = JSON.parse(localStorage.getItem("userLoggedIn"));

  // 2. Cek keamanan jika user belum login
  if (!user) {
    alert("Anda belum login! Silakan login terlebih dahulu.");
    window.location.href = "login.html";
    return;
  }

  const tbody = document.getElementById("tabel-rekap");
  if (tbody) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color: #a1a1aa;">Memuat data absensi...</td></tr>`;
  }

  // 3. Ambil data dari Google Apps Script (menggunakan encodeURIComponent untuk nama)
  fetch(`${SCRIPT_URL}?action=getRekap&bulan=${bulan}&nama=${encodeURIComponent(user.nama)}`)
    .then(res => res.json())
    .then(res => {
      console.log("Data Absensi Bulanan:", res.data);
      
      // 4. Masukkan data ke dalam tabel di HTML
      if (tbody) {
        tbody.innerHTML = ""; // Bersihkan isi tabel lama
        
        const dataList = res.data || res; // Cadangan jika format langsung array

        if (dataList && dataList.length > 0) {
          dataList.forEach((row, index) => {
            tbody.innerHTML += `
              <tr>
                <td>${index + 1}</td>
                <td>${row.tanggal || "-"}</td>
                <td>${row.jam || "-"}</td>
                <td><span class="badge">${row.status || "-"}</span></td>
              </tr>
            `;
          });
        } else {
          tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Belum ada data absensi untuk bulan ini.</td></tr>`;
        }
      }
    })
    .catch(error => {
      console.error("Error muat rekap:", error);
      if (tbody) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color: #ef4444;">Gagal memuat data dari server.</td></tr>`;
      }
    });
}

// Jalankan otomatis saat halaman selesai dimuat (misal untuk bulan ini)
document.addEventListener("DOMContentLoaded", function () {
  const bulanSekarang = new Date().toISOString().slice(0, 7); // Format: YYYY-MM
  muatRekapBulanan(bulanSekarang);
});