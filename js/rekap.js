const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyIreRt889UFmfNFBksAaj4Gq_WmUIsqaUpV6XeIvU-KGkKbJwfqaC13ZWV7mhiRiuG/exec";

function muatRekapAdmin() {
  // Mencari elemen tbody pada tabel rekap admin
  const tbody = document.getElementById("tabel-rekap") || document.querySelector("tbody");

  if (tbody) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: #a1a1aa;">Memuat rekap bulanan admin...</td></tr>`;
  }

  // Mengambil data rekap keseluruhan dari Google Apps Script
  fetch(`${SCRIPT_URL}?action=getRekap`)
    .then(res => res.json())
    .then(res => {
      console.log("Data Rekap Bulanan Admin:", res);
      
      if (tbody) {
        tbody.innerHTML = ""; // Bersihkan teks loading
        
        const dataList = res.data || res;

        if (dataList && dataList.length > 0) {
          dataList.forEach((row) => {
            tbody.innerHTML += `
              <tr>
                <td>${row.bulan || "Agustus 2026"}</td>
                <td>${row.nama || "-"}</td>
                <td>${row.hadir || 0}</td>
                <td>${row.terlambat || 0}</td>
                <td>${row.izin || 0}</td>
                <td>${row.tidakMasuk || 0}</td>
              </tr>
            `;
          });
        } else {
          tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Belum ada data rekap absensi.</td></tr>`;
        }
      }
    })
    .catch(error => {
      console.error("Error muat rekap:", error);
      if (tbody) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: #ef4444;">Gagal memuat data dari server.</td></tr>`;
      }
    });
}

// Jalankan otomatis saat halaman rekap.html selesai dimuat
document.addEventListener("DOMContentLoaded", function () {
  muatRekapAdmin();
});