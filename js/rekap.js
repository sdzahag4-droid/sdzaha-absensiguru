const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz4kpL6xEXXBkBO2aOGJGCKwFAYdk6Jwt0_8_WskgH8HvuECRg6MVIJlaxgDMAeIk_U/exec";

function muatRekapAdmin() {
  const tbody = document.getElementById("tabel-rekap") || document.querySelector("tbody");

  if (tbody) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: #a1a1aa;">Memuat data rekap dari database...</td></tr>`;
  }

  // Menambahkan timestamp agar browser tidak melakukan caching data lama
  fetch(`${SCRIPT_URL}?action=getRekap&_=${new Date().getTime()}`)
    .then(res => res.json())
    .then(res => {
      console.log("Response Rekap:", res);
      
      if (tbody) {
        tbody.innerHTML = ""; 
        const dataList = res.data || res;

        if (dataList && dataList.length > 0) {
          dataList.forEach((row) => {
            tbody.innerHTML += `
              <tr>
                <td>${row.bulan || "-"}</td>
                <td>${row.nama || "-"}</td>
                <td>${row.hadir || 0}</td>
                <td>${row.terlambat || 0}</td>
                <td>${row.izin || 0}</td>
                <td>${row.tidakMasuk || 0}</td>
              </tr>
            `;
          });
        } else {
          tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Belum ada data absensi di spreadsheet.</td></tr>`;
        }
      }
    })
    .catch(error => {
      console.error("Gagal memuat data rekap:", error);
      if (tbody) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: #ef4444;">Gagal mengambil data dari server.</td></tr>`;
      }
    });
}

document.addEventListener("DOMContentLoaded", function () {
  muatRekapAdmin();
});