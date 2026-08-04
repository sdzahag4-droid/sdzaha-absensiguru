// Ganti URL dengan Web App Apps Script terbaru Anda
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyYupXclkDnXsUFRP11KN2/JRJrLi8sLaA20X-VF6H9a112H_zFpGR/uD1NAqSkpxwe/exec";

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