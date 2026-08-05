const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyIreRt889UFmfNFBksAaj4Gq_WmUIsqaUpV6XeIvU-KGkKbJwfqaC13ZWV7mhiRiuG/exec";

const video = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const btnAmbil = document.getElementById('btnAmbilFoto');
const statusDiv = document.getElementById('statusIzin');

// Membuka Kamera Belakang
navigator.mediaDevices.getUserMedia({
  video: { facingMode: "environment" }
}).then(stream => {
  video.srcObject = stream;
}).catch(err => {
  console.warn("Gagal menggunakan kamera belakang, mencoba kamera standar:", err);
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => { video.srcObject = stream; })
    .catch(() => alert("Kamera tidak dapat diakses. Mohon berikan izin kamera pada browser Anda."));
});

btnAmbil.addEventListener('click', function() {
  const user = JSON.parse(localStorage.getItem('userLoggedIn'));
  const alasan = document.getElementById('keteranganIzin').value.trim();

  if (!user) {
    alert("Sesi login berakhir! Silakan login ulang.");
    window.location.href = "index.html";
    return;
  }

  if (!alasan) {
    alert("Mohon isi alasan izin terlebih dahulu!");
    return;
  }

  btnAmbil.disabled = true;
  statusDiv.innerText = "⏳ Ambil foto & mengirim data izin...";
  statusDiv.style.color = "#eab308";

  // 1. PROSES TANGKAP FOTO DARI WEBCAM KE CANVAS
  const context = canvas.getContext('2d');
  canvas.width = video.videoWidth || 640;
  canvas.height = video.videoHeight || 480;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // 2. UBAH GAMBAR CANVAS MENJADI BASE64
  const fotoBase64 = canvas.toDataURL('image/jpeg', 0.7);

  // 3. FORMAT TANGGAL DAN JAM
  const today = new Date();
  const tglFormatted = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
  const jamFormatted = today.toTimeString().split(' ')[0];

  // 4. BENTUK PAYLOAD (KIRIM fotoBase64 KE KOLOM qr)
  const payload = {
    tanggal: tglFormatted,
    nama: user.nama,
    masuk: jamFormatted,
    pulang: "-",
    gps: "Terdeteksi",
    qr: fotoBase64, // Memasukkan foto Base64 untuk dikonversi jadi file Google Drive di Apps Script
    status: "Izin (" + alasan + ")"
  };

  fetch(SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(res => {
    if (res.result === "success") {
      statusDiv.innerText = "✅ Absen Izin & Foto Berhasil Dikirim!";
      statusDiv.style.color = "#22c55e";
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1500);
    } else {
      throw new Error(res.error || "Gagal menyimpan");
    }
  })
  .catch(err => {
    console.error(err);
    statusDiv.innerText = "❌ Gagal mengirim data izin!";
    statusDiv.style.color = "#ef4444";
    btnAmbil.disabled = false;
  });
});