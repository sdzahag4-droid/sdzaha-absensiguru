// URL Google Apps Script Web App Anda
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyYupXclkDnXsUFRP11KN2/JRJrLi8sLaA20X-VF6H9a112H_zFpGR/uD1NAqSkpxwe/exec";

let streamKamera = null;

document.addEventListener("DOMContentLoaded", function () {
  // 1. Verifikasi Login User
  const user = JSON.parse(localStorage.getItem("userLoggedIn"));
  if (!user) {
    alert("Anda belum login! Silakan login terlebih dahulu.");
    window.location.href = "login.html";
    return;
  }

  // 2. Sesuaikan Judul Jenis Absensi (Masuk / Pulang)
  const urlParams = new URLSearchParams(window.location.search);
  const tipeAbsen = urlParams.get("tipe") || "masuk";
  const titleTipe = document.getElementById("titleTipeAbsen");
  
  if (titleTipe) {
    titleTipe.textContent = `ABSEN SELFIE (${tipeAbsen.toUpperCase()})`;
  }

  // 3. Elemen-elemen HTML
  const video = document.getElementById("webcamVideo");
  const canvas = document.getElementById("photoCanvas");
  const placeholder = document.getElementById("cameraPlaceholder");

  const btnBuka = document.getElementById("btnBukaKamera");
  const btnAmbil = document.getElementById("btnAmbilFoto");
  const btnKirim = document.getElementById("btnKirimAbsen");
  const btnUlang = document.getElementById("btnUlangFoto");

  // BUKA KAMERA DEPAN
  btnBuka.addEventListener("click", async function () {
    try {
      streamKamera = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }, // Kamera Depan
        audio: false
      });

      video.srcObject = streamKamera;
      video.style.display = "block";
      placeholder.style.display = "none";

      btnBuka.style.display = "none";
      btnAmbil.style.display = "flex";
    } catch (err) {
      alert("Gagal membuka kamera depan. Pastikan izin kamera telah diberikan! " + err);
    }
  });

  // AMBIL FOTO SELFIE
  btnAmbil.addEventListener("click", function () {
    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Gambar frame dari video ke canvas
    context.translate(canvas.width, 0);
    context.scale(-1, 1); // Membalik gambar agar seperti cermin
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Sembunyikan Video, Tampilkan Canvas
    video.style.display = "none";
    canvas.style.display = "block";

    btnAmbil.style.display = "none";
    btnKirim.style.display = "flex";
    btnUlang.style.display = "flex";
  });

  // FOTO ULANG
  btnUlang.addEventListener("click", function () {
    canvas.style.display = "none";
    video.style.display = "block";

    btnKirim.style.display = "none";
    btnUlang.style.display = "none";
    btnAmbil.style.display = "flex";
  });

  // KIRIM ABSENSI TO GOOGLE SHEETS
  btnKirim.addEventListener("click", function () {
    btnKirim.textContent = "Mengirim Data...";
    btnKirim.disabled = true;

    // Dapatkan data GPS
    if (typeof dapatkanLokasi === "function") {
      dapatkanLokasi()
        .then((gpsData) => {
          prosesKirimAbsensiSelfie(tipeAbsen, gpsData.keterangan);
        })
        .catch(() => {
          prosesKirimAbsensiSelfie(tipeAbsen, "GPS Tidak Aktif");
        });
    } else {
      prosesKirimAbsensiSelfie(tipeAbsen, "-");
    }
  });
});

// FUNGSI UNTUK PROSES KIRIM DATA
function prosesKirimAbsensiSelfie(jenisAbsen, gpsData) {
  const user = JSON.parse(localStorage.getItem("userLoggedIn"));
  const sekarang = new Date();
  const tanggalHariIni = sekarang.toISOString().split("T")[0];
  const jamSekarang = sekarang.toTimeString().split(" ")[0];

  const payloadData = {
    tanggal: tanggalHariIni,
    nama: user.nama,
    masuk: jenisAbsen === "masuk" ? jamSekarang : "-",
    pulang: jenisAbsen === "pulang" ? jamSekarang : "-",
    gps: gpsData,
    qr: "Selfie Verified", // Sebagai penanda absensi via foto selfie
    status: "Hadir"
  };

  fetch(SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payloadData)
  })
    .then(() => {
      // Hentikan Kamera
      const video = document.getElementById("webcamVideo");
      if (video.srcObject) {
        video.srcObject.getTracks().forEach((track) => track.stop());
      }

      alert(`Absensi Selfie ${jenisAbsen.toUpperCase()} Berhasil Berhasil Dikirim!`);
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      console.error("Error Absen Selfie:", error);
      alert("Gagal mengirim data absensi. Silakan coba lagi.");
      document.getElementById("btnKirimAbsen").disabled = false;
      document.getElementById("btnKirimAbsen").textContent = "Kirim Absensi Selfie";
    });
}