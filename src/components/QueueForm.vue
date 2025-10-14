<template>
  <div class="card fade-in-up"> 
    <div class="card-header">
      <img src="@/assets/logo-bpjs.png" alt="Logo BPJS Kesehatan" class="logo-bpjs">
      <h1>Antrian VIOLA <br>(Virtual Office Layanan Peserta)</br></h1>
      <p>BPJS Kesehatan Cabang Makassar</p>
    </div>

    <form id="antrianForm" novalidate @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="nama">Nama Sesuai KTP</label>
        <input 
          type="text" 
          id="nama" 
          name="nama" 
          placeholder="Cth: Ahmad Mustajab" 
          required 
          v-model.trim="form.nama"
          @input="formatNameInput"> <span class="validation-message" v-if="errors.nama">{{ errors.nama }}</span>
      </div>

      <div class="form-group">
        <label for="hp">Nomor Handphone Aktif</label>
        <input 
          type="tel" 
          id="hp" 
          name="hp" 
          placeholder="Contoh: 081234567890" 
          required 
          v-model.trim="form.hp"
          @input="formatHpInput"
          maxlength="13"> <span class="validation-message" v-if="errors.hp">{{ errors.hp }}</span>
      </div>

      <div class="form-group">
        <label>Pilih Jenis Layanan</label>
        <div class="radio-card-group">
          <label class="radio-card">
            <input type="radio" name="layanan" value="Administrasi" required v-model="form.layanan">
            <span class="radio-title">Administrasi</span>
          </label>
          <label class="radio-card">
            <input type="radio" name="layanan" value="Informasi" required v-model="form.layanan">
            <span class="radio-title">Informasi</span>
          </label>
          <label class="radio-card">
            <input type="radio" name="layanan" value="Penanganan Pengaduan" required v-model="form.layanan">
            <span class="radio-title">Penanganan Pengaduan</span>
          </label>
        </div>
        <span class="validation-message" v-if="errors.layanan">{{ errors.layanan }}</span>
      </div>
      
      <button type="submit" id="submitButton" class="btn btn-submit" :disabled="!isFormValid">
        Dapatkan Nomor Antrian
      </button>
    </form>
  </div>
</template>

<script setup>
import { reactive, computed, watch } from 'vue' // Tambahkan 'watch'
import { useQueueStore } from '@/stores/queueStore'

const store = useQueueStore()

const form = reactive({
  nama: '',
  hp: '',
  layanan: null,
})

const errors = reactive({
  nama: '',
  hp: '',
  layanan: '',
})

// --- VALIDASI REAL-TIME MENGGUNAKAN WATCH ---

// 1. Memantau perubahan pada kolom NAMA
watch(() => form.nama, (newValue) => {
  if (newValue.length > 0 && newValue.length <= 2) {
    errors.nama = 'Nama lengkap minimal 3 huruf.'
  } else {
    // Hapus pesan error jika sudah valid
    errors.nama = ''
  }
})

// 2. Memantau perubahan pada kolom NOMOR HP
watch(() => form.hp, (newValue) => {
  if (newValue.length > 0 && !newValue.startsWith('0')) {
    // Prioritas 1: Cek awalan '0'. Jika salah, langsung tampilkan error ini.
    errors.hp = 'Nomor Handphone harus diawali dengan angka 0.'
  } else if (newValue.length > 0 && newValue.length < 10) {
    // Prioritas 2: Jika awalan sudah benar, baru cek panjang minimal.
    errors.hp = 'Nomor Handphone minimal 10 digit.'
  } else {
    // Jika semua kondisi di atas tidak terpenuhi (artinya valid atau kosong), hapus error.
    errors.hp = ''
  }
})

// --- Fungsi pemfilteran input (tidak berubah) ---
const formatNameInput = (event) => {
  form.nama = event.target.value.replace(/[^a-zA-Z\s]/g, '');
}

const formatHpInput = (event) => {
  form.hp = event.target.value.replace(/[^0-9]/g, '');
}

// --- Logika untuk Tombol Submit (tidak berubah) ---
const isFormValid = computed(() => {
    const isNameValid = form.nama.length > 2 && /^[a-zA-Z\s]+$/.test(form.nama);
    const isHpValid = /^[0-9]{10,13}$/.test(form.hp) && form.hp.startsWith('0');
    return isNameValid && isHpValid && form.layanan;
});

const handleSubmit = () => {
  // Lakukan pengecekan terakhir untuk memastikan semua terisi
  if (!form.nama) errors.nama = 'Nama lengkap wajib diisi.';
  if (!form.hp) errors.hp = 'Nomor Handphone wajib diisi.';
  if (form.hp && !form.hp.startsWith('0')) errors.hp = 'Nomor Handphone harus diawali dengan angka 0.'
  if (!form.layanan) errors.layanan = 'Anda harus memilih salah satu layanan.';

  if (isFormValid.value) {
    store.submitQueue(form)
  }
}
</script>

<style scoped>
/* --- Gaya Baru untuk Header Kartu --- */
.card-header .logo-bpjs {
    max-width: 180px;
    margin-bottom: 20px;
    transition: transform 0.3s ease;
}

.card-header .logo-bpjs:hover {
    transform: scale(1.05);
}

.card-header h1 {
    font-size: 32px;
    font-weight: 700;
    /* Variabel CSS dari main.css tetap bisa diakses */
    color: var(--text-dark); 
}

.card-header p {
    font-size: 16px;
    color: var(--text-muted);
}

/* --- Desain Ulang Form Group & Input --- */
.form-group {
    margin-bottom: 28px;
    text-align: left;
}

.form-group label {
    display: block;
    margin-bottom: 12px;
    font-weight: 600;
    font-size: 16px;
    color: #3d5166;
}

.form-group input[type="text"], 
.form-group input[type="tel"] {
    width: 100%;
    padding: 18px 20px;
    border: 1px solid var(--border-color);
    border-radius: 12px;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
    font-size: 1rem;
    transition: all 0.3s ease-in-out;
    background-color: #f8f9fa;
}

.form-group input:focus {
    outline: none;
    border-color: var(--bpjs-blue);
    background-color: #fff;
    box-shadow: 0 0 0 4px rgba(0, 91, 172, 0.15);
}

/* --- Desain Ulang Pilihan Layanan (Radio Card) --- */
.radio-card-group {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.radio-card {
    display: flex;
    align-items: center;
    position: relative;
    padding: 18px 20px;
    border: 2px solid var(--border-color);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    background-color: #fff;
}

.radio-card:hover {
    border-color: var(--bpjs-blue);
    transform: translateY(-2px);
}

.radio-card:has(input:checked) {
    border-color: var(--bpjs-blue);
    background-color: var(--bpjs-blue-light);
    box-shadow: 0 4px 15px rgba(0, 91, 172, 0.1);
}

.radio-card input {
    display: none;
}

.radio-card .radio-title {
    font-size: 1rem;
    font-weight: 500;
    color: var(--text-dark);
}

/* --- Desain Ulang Tombol Submit --- */
.btn.btn-submit {
    padding: 20px;
    font-size: 18px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 91, 172, 0.2);
}

/* --- Animasi Halus --- */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.fade-in-up {
    animation: fadeInUp 0.7s ease-out forwards;
}
.validation-message {
    display: block;
    color: var(--danger, #dc3545);
    font-size: 14px;
    margin-top: 8px;
    font-weight: 500;
}
</style>