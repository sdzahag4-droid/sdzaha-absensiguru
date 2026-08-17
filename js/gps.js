// ==========================================
// KOORDINAT LOKASI SEKOLAH (SD Zainul Hasan Genggong)
// Silakan sesuaikan titik Latitude & Longitude sekolah
// ==========================================
const SEKOLAH_LAT = -7.787930;  // Ganti dengan Latitude sekolah Anda
const SEKOLAH_LNG = 113.375122; // Ganti dengan Longitude sekolah Anda
const RADIUS_MAKSIMAL_METER = 50; // Jarak maksimal dalam meter (misal: 50 meter)

/**
 * Fungsi untuk menghitung jarak antara 2 koordinat (Haversine Formula)
 * Mengembalikan hasil dalam satuan meter
 */
function hitungJarak(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Radius bumi dalam meter
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLon = (lon2 - lon1) * rad;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * rad) * Math.cos(lat2 * rad) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Hasil dalam meter
}

/**
 * Fungsi utama untuk mendapatkan lokasi pengguna via Browser GPS
 */
function dapatkanLokasi() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Fitur GPS / Geolocation tidak didukung di browser ini.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        
        // Hitung jarak user ke lokasi sekolah
        const jarak = hitungJarak(userLat, userLng, SEKOLAH_LAT, SEKOLAH_LNG);
        const didalamRadius = jarak <= RADIUS_MAKSIMAL_METER;

        resolve({
          latitude: userLat,
          longitude: userLng,
          jarak: Math.round(jarak),
          isSuccess: didalamRadius,
          keterangan: `${userLat.toFixed(6)}, ${userLng.toFixed(6)} (${Math.round(jarak)}m)`
        });
      },
      (error) => {
        let pesanError = "Gagal mengambil lokasi GPS.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            pesanError = "Izin akses lokasi/GPS ditolak oleh pengguna.";
            break;
          case error.POSITION_UNAVAILABLE:
            pesanError = "Informasi lokasi tidak tersedia.";
            break;
          case error.TIMEOUT:
            pesanError = "Waktu pengambilan lokasi GPS habis (timeout).";
            break;
        }
        reject(pesanError);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
}