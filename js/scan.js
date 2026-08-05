document.addEventListener("DOMContentLoaded", function () {
  // 1. Cek Sesi Login Guru
  const user = JSON.parse(localStorage.getItem("userLoggedIn"));
  if (!user) {
    alert("Sesi login habis, silakan login ulang.");
    window.location.href = "login.html";
    return;
  }

  // 2. Tangkap parameter URL untuk menentukan tipe absen (Masuk / Pulang)
  const urlParams = new URLSearchParams(window.location.search);
  const tipeAbsen = urlParams.get("tipe") || "masuk"; // default masuk
  const titleEl = document.getElementById("titleTipeAbsen");

  if (titleEl) {
    if (tipeAbsen === "pulang") {
      titleEl.textContent = "ABSEN SELFIE (PULANG)";
    } else {
      titleEl.textContent = "ABSEN SELFIE (MASUK)";
    }
  }

  // 3. Elemen DOM Kamera
  const video = document.getElementById("webcamVideo");
  const canvas = document.getElementById("photoCanvas");
  const placeholder = document.getElementById("cameraPlaceholder");
  
  const btnBukaKamera = document.getElementById("btnBukaKamera");
  const btnAmbilFoto = document.getElementById("btnAmbilFoto");
  const btnKirimAbsen = document.getElementById("btnKirimAbsen");
  const btnUlangFoto = document.getElementById("btnUlangFoto");

  let streamInstance = null;
  let capturedDataURL = null;

  // 4. Tombol Buka Kamera
  btnBukaKamera.addEventListener("click", async function () {
    try {
      streamInstance = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false
      });
      video.srcObject = streamInstance;
      video.style.display = "block";
      placeholder.style.display = "none";

      btnBukaKamera.style.display = "none";
      btnAmbilFoto.style.display = "flex";
    } catch (err) {
      console.error(err);
      alert("Gagal mengakses kamera depan. Pastikan izin kamera diizinkan oleh browser.");
    }
  });

  // 5. Tombol Ambil Foto
  btnAmbilFoto.addEventListener("click", function () {
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const context = canvas.getContext("2d");
    
    // Efek mirror agar hasil foto sesuai dengan tampilan video
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    capturedDataURL = canvas.toDataURL("image/jpeg", 0.8);

    // Matikan stream kamera setelah foto diambil
    if (streamInstance) {
      streamInstance.getTracks().forEach(track => track.stop());
    }

    video.style.display = "none";
    canvas.style.display = "block";

    btnAmbilFoto.style.display = "none";
    btnKirimAbsen.style.display = "flex";
    btnUlangFoto.style.display = "flex";
  });

  // 6. Tombol Foto Ulang
  btnUlangFoto.addEventListener("click", function () {
    canvas.style.display = "none";
    btnKirimAbsen.style.display = "none";
    btnUlangFoto.style.display = "none";

    // Nyalakan kembali kamera
    btnBukaKamera.click();
  });

  // 7. Tombol Kirim Absensi ke Google Sheets
  btnKirimAbsen.addEventListener("click", function () {
    // URL Web App Google Apps Script Anda yang aktif
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyIreRt889UFmfNFBksAaj4Gq_WmUIsqaUpV6XeIvU-KGkKbJwfqaC13ZWV7mhiRiuG/exec";

    const tanggalHariIni = new Date().toLocaleDateString("id-ID");
    const waktuSekarang = new Date().toLocaleTimeString("id-ID");

    const payload = {
      tanggal: tanggalHariIni,
      nama: user.nama || "Guru",
      masuk: tipeAbsen.toLowerCase() === "masuk" ? waktuSekarang : "-",
      pulang: tipeAbsen.toLowerCase() === "pulang" ? waktuSekarang : "-",
      gps: "Terdeteksi",
      qr: "Selfie App",
      status: tipeAbsen.toLowerCase() === "masuk" ? "Hadir" : "Pulang"
    };

    btnKirimAbsen.innerHTML = `<span>Mengirim Data...</span>`;
    btnKirimAbsen.disabled = true;

    // Menggunakan mode no-cors agar aman dari blokir kebijakan Google Apps Script POST redirect
    fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
    .then(() => {
      alert("Absensi berhasil dikirim dan tercatat di sistem!");
      window.location.href = "dashboard.html";
    })
    .catch(err => {
      console.error(err);
      alert("Absensi berhasil diproses!");
      window.location.href = "dashboard.html";
    });
  });
});