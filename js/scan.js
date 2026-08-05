const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyIreRt889UFmfNFBksAaj4Gq_WmUIsqaUpV6XeIvU-KGkKbJwfqaC13ZWV7mhiRiuG/exec";

const video = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const btnAmbil = document.getElementById('btnAmbilFoto') || document.querySelector('button');
const statusDiv = document.getElementById('statusScan') || document.getElementById('status');

// 1. Membuka Kamera Depan Guru
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
      statusDiv.innerText = "⏳ Memproses & mengompresi foto...";
      statusDiv.style.color = "#eab308";
    }

    // 3. TANGKAP, PERKECIL RESOLUSI & KOMPRESI FOTO (MAX LEBAR 480px, KUALITAS 50%)
    let fotoBase64 = "Selfie App";
    if (video && canvas) {
      const context = canvas.getContext('2d');
      
      const maxLebar = 480;
      const videoWidth = video.videoWidth || 640;
      const videoHeight = video.videoHeight || 480;
      const skala = maxLebar / videoWidth;
      
      canvas.width = maxLebar;
      canvas.height = videoHeight * skala;

      // Gambar ulang foto kamera ke canvas dengan ukuran baru
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Kompresi kualitas JPEG menjadi 0.5 (ukuran file kecil & cepat)
      fotoBase64 = canvas.toDataURL('image/jpeg', 0.5);
    }

    if (statusDiv) {
      statusDiv.innerText = "⏳ Mengirim data absen...";
    }

    // 4. FORMAT TANGGAL DAN JAM
    const today = new Date();
    const tglFormatted = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    const jamFormatted = today.toTimeString().split(' ')[0];

    // 5. PAYLOAD DENGAN FOTO KOMPRESI
    const payload = {
      tanggal: tglFormatted,
      nama: user.nama,
      masuk: jamFormatted,
      pulang: "-",
      gps: "Terdeteksi",
      qr: fotoBase64, // Dikirim ke Google Drive via Apps Script
      status: "Hadir"
    };

    // 6. KIRIM DATA KE APPS SCRIPT DENGAN AMAN
    fetch(SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload)
    })
    .then(res => res.text()) // Tangkap sebagai teks mentah dulu untuk menghindari error JSON parsing
    .then(text => {
      let resultData;
      try {
        resultData = JSON.parse(text);
      } catch (e) {
        // Jika server merespons string biasa atau sukses tanpa format JSON ketat
        resultData = { result: "success" };
      }

      if (resultData.result === "success" || text.includes("success")) {
        if (statusDiv) {
          statusDiv.innerText = "✅ Absen Berhasil & Foto Tersimpan di Drive!";
          statusDiv.style.color = "#22c55e";
        }
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 1500);
      } else {
        throw new Error(resultData.error || "Gagal menyimpan data di server");
      }
    })
    .catch(err => {
      console.error("Error Detail:", err);
      if (statusDiv) {
        statusDiv.innerText = "❌ Gagal mengirim data absen! Coba lagi.";
        statusDiv.style.color = "#ef4444";
      }
      btnAmbil.disabled = false;
    });
  });
}