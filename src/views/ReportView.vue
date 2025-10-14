<template>
  <div id="laporan-page">
  <div class="card">
    <div class="card-header">
      <h1>Laporan Antrian Harian</h1>
      <p>Pilih tanggal untuk melihat dan mengunduh data.</p>
    </div>
    <div class="controls">
      <input type="date" v-model="selectedDate" id="report-date">
      <button @click="fetchReport" id="btn-get-data" class="btn" style="width: auto;">
        <span v-if="!isLoading">Tampilkan Data</span>
        <span v-else>Memuat...</span>
      </button>
      <button @click="downloadExcel" id="btn-download" class="btn btn-secondary" style="width: auto;" :disabled="reportData.length === 0">
        Download Excel
      </button>
    </div>
    <div class="table-container">
      <table v-if="reportData.length > 0">
        <thead>
          <tr>
            <th v-for="(header, index) in reportHeaders" :key="index">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in reportData" :key="rowIndex">
            <td v-for="(cell, cellIndex) in row" :key="cellIndex">{{ cell }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else style="text-align:center; color: var(--text-muted); padding: 20px 0;">
        {{ message }}
      </p>
    </div>
  </div>
  <p class="copyright"> &copy; 2025 BPJS Kesehatan cabang Makassar</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { utils, writeFile } from 'xlsx' // Langsung impor fungsi yang dibutuhkan

const SCRIPT_URL = import.meta.env.VITE_SCRIPT_URL;

const selectedDate = ref('');
const isLoading = ref(false);
const reportHeaders = ref([]);
const reportData = ref([]);
const message = ref('Silakan pilih tanggal dan klik "Tampilkan Data".');

onMounted(() => {
    // Set tanggal hari ini saat komponen dimuat
    const today = new Date().toISOString().split('T')[0];
    selectedDate.value = today;
});

const fetchReport = async () => {
  if (!selectedDate.value) {
    alert('Silakan pilih tanggal terlebih dahulu.');
    return;
  }
  isLoading.value = true;
  message.value = 'Sedang mengambil data...';
  reportData.value = [];
  reportHeaders.value = [];
  
  try {
    const url = `${SCRIPT_URL}?action=getData&date=${selectedDate.value}`;
    const response = await fetch(url);
    const result = await response.json();

    if (result.data && result.data.length > 0) {
      reportHeaders.value = result.header;
      reportData.value = result.data;
      message.value = ''; // Kosongkan pesan jika data ditemukan
    } else {
      message.value = 'Tidak ada data antrian untuk tanggal yang dipilih.';
    }
  } catch (error) {
    console.error(error);
    message.value = 'Gagal mengambil data. Periksa koneksi atau URL script.';
  } finally {
    isLoading.value = false;
  }
};

const downloadExcel = () => {
    if (reportData.value.length === 0) return;
    
    // Buat worksheet dari array of arrays
    const dataWithHeaders = [reportHeaders.value, ...reportData.value];
    const ws = utils.aoa_to_sheet(dataWithHeaders);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Laporan Antrian');
    
    writeFile(wb, `laporan_antrian_${selectedDate.value}.xlsx`);
};
</script>