const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyIreRt889UFmfNFBksAaj4Gq_WmUIsqaUpV6XeIvU-KGkKbJwfqaC13ZWV7mhiRiuG/exec";

const video = document.getElementById('webcam');
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
  statusDiv.innerText = "⏳ Mengirim data izin...";
  statusDiv.style.color = "#eab308";

  const today = new Date();
  const tglFormatted = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
  const jamFormatted = today.toTimeString().split(' ')[0];

  const payload = {
    tanggal: tglFormatted,
    nama: user.nama,
    masuk: jamFormatted,
    pulang: "-",
    gps: "Terdeteksi",
    qr: "Foto Bukti Izin",
    status: "Izin (" + alasan + ")"
  };

  fetch(SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(res => {
    if (res.result === "success") {
      statusDiv.innerText = "✅ Absen Izin Berhasil Dikirim!";
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