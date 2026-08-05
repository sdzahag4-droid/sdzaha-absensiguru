const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyIreRt889UFmfNFBksAaj4Gq_WmUIsqaUpV6XeIvU-KGkKbJwfqaC13ZWV7mhiRiuG/exec";

const video = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const btnAmbil = document.getElementById('btnAmbilFoto') || document.querySelector('button');
const statusDiv = document.getElementById('statusScan') || document.getElementById('status');

// 1. Membuka Kamera Kamera
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({
    video: { facingMode: "user" } // Menghadap ke wajah/depan
  }).then(stream => {
    if (video) video.srcObject = stream;
  }).catch(err => {
    console.warn("Kamera depan gagal, mencoba kamera default:", err);
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => { if (video) video.srcObject = stream; })
      .catch(() => alert("Kamera tidak dapat diakses. Mohon berikan izin kamera pada browser Anda."));
  });
}

// 2. Aksi Saat Tombol Absen / Scan Diklik
if (btnAmbil) {
  btnAmbil.addEventListener('click', function() {
    const user = JSON.parse(localStorage.getItem('userLoggedIn'));

    if (!user) {
      alert("Sesi login berakhir! Silakan login ulang.");
      window.location.href = "index.html";
      return;
    }

    btnAmbil.disabled = true;
    if (statusDiv) {
      statusDiv.innerText = "⏳ Ambil foto & mengirim data absen...";
      statusDiv.style.color = "#eab308";
    }

    // 3. TANGKAP FOTO DARI WEBCAM KE CANVAS
    let fotoBase64 = "Selfie App";
    if (video && canvas) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Ubah gambar menjadi format Base64
      fotoBase64 = canvas.toDataURL('image/jpeg', 0.7);
    }

    // 4. FORMAT TANGGAL DAN JAM
    const today = new Date();
    const tglFormatted = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    const jamFormatted = today.toTimeString().split(' ')[0];

    // 5. PAYLOAD KIRIM FOTO BASE64 KE APPS SCRIPT
    const payload = {
      tanggal: tglFormatted,
      nama: user.nama,
      masuk: jamFormatted,
      pulang: "-",
      gps: "Terdeteksi",
      qr: fotoBase64, // Dikirim ke Google Drive via Apps Script
      status: "Hadir"
    };

    fetch(SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(res => {
      if (res.result === "success") {
        if (statusDiv) {
          statusDiv.innerText = "✅ Absen Berhasil & Foto Tersimpan di Drive!";
          statusDiv.style.color = "#22c55e";
        }
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 1500);
      } else {
        throw new Error(res.error || "Gagal menyimpan");
      }
    })
    .catch(err => {
      console.error(err);
      if (statusDiv) {
        statusDiv.innerText = "❌ Gagal mengirim data absen!";
        statusDiv.style.color = "#ef4444";
      }
      btnAmbil.disabled = false;
    });
  });
}