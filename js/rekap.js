const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxmoRScdr0ehgy_QTanzQrz0zL6U1UzEKCCAQnknxj4Y8K7Z5KZLkFuIJePnqu-DQ/exec";

function muatRekapBulanan(bulan) {
  // 1. Ambil data user dari localStorage
  const user = JSON.parse(localStorage.getItem("userLoggedIn"));

  // 2. Cek keamanan jika user belum login
  if (!user) {
    alert("Anda belum login! Silakan login terlebih dahulu.");
    window.location.href = "login.html";
    return;
  }

  // 3. Ambil data dari Google Apps Script tanpa spasi di URL
  fetch(`${SCRIPT_URL}?action=getRekap&bulan=${bulan}&nama=${user.nama}`)
    .then(res => res.json())
    .then(res => {
      console.log("Data Absensi Bulanan:", res.data);
      
      // 4. Masukkan data ke dalam tabel di HTML (jika elemen tabel ada)
      const tbody = document.getElementById("tabel-rekap");
      if (tbody) {
        tbody.innerHTML = ""; // Bersihkan isi tabel lama
        
        if (res.data && res.data.length > 0) {
          res.data.forEach((row, index) => {
            tbody.innerHTML += `
              <tr>
                <td>${index + 1}</td>
                <td>${row.tanggal}</td>
                <td>${row.jam}</td>
                <td>${row.status}</td>
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
    });
}

// Jalankan otomatis saat halaman selesai dimuat (misal untuk bulan ini)
document.addEventListener("DOMContentLoaded", function () {
  const bulanSekarang = new Date().toISOString().slice(0, 7); // Format: YYYY-MM
  muatRekapBulanan(bulanSekarang);
});