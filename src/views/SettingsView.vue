<template>
  <div id="settings-page">
    <div class="card">
      <div class="card-header">
        <h1>Pengaturan Formulir Antrian</h1>
        <p>Atur jadwal buka/tutup dan mode formulir publik.</p>
      </div>

      <div v-if="store.isLoading" class="loading-container">
        <div class="spinner"></div>
        <p>Memuat pengaturan...</p>
      </div>

      <form v-else @submit.prevent="saveSettings" class="settings-form">
        
        <fieldset class="form-section">
          <legend>Mode Kontrol Utama</legend>
          <p class="section-desc">Pilih mode operasional formulir antrian.</p>
          <div class="radio-group">
            <label>
              <input type="radio" v-model="localSettings.controlMode" value="otomatis">
              <strong>Otomatis (Sesuai Jadwal)</strong>
              <small>Formulir akan buka/tutup berdasarkan jam dan hari yang diatur di bawah.</small>
            </label>
            <label>
              <input type="radio" v-model="localSettings.controlMode" value="manual">
              <strong>Manual (Paksa Buka/Tutup)</strong>
              <small>Formulir akan mengikuti status "Paksa Buka" atau "Paksa Tutup" di bawah.</small>
            </label>
          </div>
        </fieldset>
        <fieldset v-if="localSettings.controlMode === 'manual'" class="form-section manual-controls">
          <legend>Kontrol Manual</legend>
           <div class="radio-group">
            <label>
              <input type="radio" v-model="localSettings.manualStatus" value="buka">
              <strong>Paksa BUKA</strong>
            </label>
            <label>
              <input type="radio" v-model="localSettings.manualStatus" value="tutup">
              <strong>Paksa TUTUP</strong>
            </label>
          </div>
        </fieldset>

        <fieldset class="form-section" :disabled="localSettings.controlMode === 'manual'">
          <legend>Pengaturan Jadwal (Otomatis)</legend>
          <p class="section-desc">Atur jam buka dan tutup untuk mode otomatis.</p>
          
          <div class="schedule-session-toggle">
            <div class="checkbox-group inline">
                <label>
                  <input type="checkbox" v-model="localSettings.schedule.sesi1_aktif">
                  Aktifkan Sesi 1 (Pagi)
                </label>
                <label>
                  <input type="checkbox" v-model="localSettings.schedule.sesi2_aktif">
                  Aktifkan Sesi 2 (Siang)
                </label>
            </div>
          </div>

          <div class="schedule-grid">
            <div class="form-group" :class="{ 'is-disabled': !localSettings.schedule.sesi1_aktif }">
              <label for="s1_start">Sesi 1: Jam Buka</label>
              <input type="time" id="s1_start" v-model="localSettings.schedule.sesi1_start" :disabled="!localSettings.schedule.sesi1_aktif">
            </div>
            <div class="form-group" :class="{ 'is-disabled': !localSettings.schedule.sesi1_aktif }">
              <label for="s1_end">Sesi 1: Jam Tutup</label>
              <input type="time" id="s1_end" v-model="localSettings.schedule.sesi1_end" :disabled="!localSettings.schedule.sesi1_aktif">
            </div>
            <div class="form-group" :class="{ 'is-disabled': !localSettings.schedule.sesi2_aktif }">
              <label for="s2_start">Sesi 2: Jam Buka</label>
              <input type="time" id="s2_start" v-model="localSettings.schedule.sesi2_start" :disabled="!localSettings.schedule.sesi2_aktif">
            </div>
            <div class="form-group" :class="{ 'is-disabled': !localSettings.schedule.sesi2_aktif }">
              <label for="s2_end">Sesi 2: Jam Tutup</label>
              <input type="time" id="s2_end" v-model="localSettings.schedule.sesi2_end" :disabled="!localSettings.schedule.sesi2_aktif">
            </div>
          </div>

          <legend style="font-size: 18px; margin-top: 20px;">Hari Operasional</legend>
           <div class="checkbox-group">
              <label>
                <input type="checkbox" v-model="localSettings.schedule.sabtu_buka">
                Buka pada hari Sabtu
              </label>
              <label>
                <input type="checkbox" v-model="localSettings.schedule.minggu_buka">
                Buka pada hari Minggu
              </label>
            </div>
            <div class="form-group" style="margin-top: 15px;">
              <label for="hari_teks">Teks Hari Operasional</label>
              <input type="text" id="hari_teks" v-model="localSettings.schedule.hari_operasional_teks" placeholder="Cth: Senin - Jumat (Sabtu/Minggu Tutup)">
            </div>
        </fieldset>

        <fieldset class="form-section">
          <legend>Pengaturan Pesan Kustom</legend>
          <div class="form-group">
            <label for="msg_buka">Pesan Saat Formulir Dibuka</label>
            <textarea id="msg_buka" v-model="localSettings.messages.buka" rows="2"></textarea>
          </div>
          <div class="form-group">
            <label for="msg_libur">Pesan Saat Hari Libur (Otomatis)</label>
            <textarea id="msg_libur" v-model="localSettings.messages.libur" rows="2"></textarea>
          </div>
          <div class="form-group">
            <label for="msg_tutup_prefix">Pesan Saat Tutup (Otomatis)</label>
            <textarea id="msg_tutup_prefix" v-model="localSettings.messages.tutup_prefix" rows="2"></textarea>
            <small>Teks ini akan diikuti oleh jam buka, cth: "...akan dibuka kembali <strong>pukul 08:00 WITA</strong>".</small>
          </div>
           <div class="form-group">
            <label for="manualMessage">Pesan Saat Ditutup (Manual)</label>
            <textarea 
              id="manualMessage" 
              v-model="localSettings.manualMessage" 
              rows="3"
              placeholder="Cth: Pendaftaran ditutup karena ada pemeliharaan sistem.">
            </textarea>
          </div>
        </fieldset>


        <button type="submit" class="btn btn-submit" :disabled="store.isLoading">
          <span v-if="store.isLoading" class="btn-spinner"></span>
          <span v-else>Simpan Pengaturan</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore'

const store = useSettingsStore()
const localSettings = ref(JSON.parse(JSON.stringify(store.settings)))

watch(() => store.settings, (newSettings) => {
  localSettings.value = JSON.parse(JSON.stringify(newSettings))
}, { deep: true })

const saveSettings = () => {
  if (confirm('Anda yakin ingin menyimpan pengaturan ini? Halaman publik akan terpengaruh.')) {
    store.updateSettings(localSettings.value)
    alert('Pengaturan berhasil disimpan!')
  }
}
onMounted(() => {
  store.initListener()
})
</script>


<style scoped>
.schedule-session-toggle {
  background-color: #f8f9fa;
  border: 1px solid var(--border-color);
  padding: 15px 20px;
  border-radius: 10px;
  margin-bottom: 25px;
}
.checkbox-group.inline {
  display: flex;
  gap: 25px;
  flex-wrap: wrap;
}
.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
.checkbox-group input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: var(--bpjs-blue);
}
.form-group.is-disabled {
  opacity: 0.5;
}
.form-group.is-disabled label {
  color: var(--text-muted);
}
.loading-container {
  text-align: center;
  padding: 40px;
}
.loading-container p {
  margin-top: 15px;
  font-size: 16px;
  color: var(--text-muted);
}
.settings-form {
  max-width: 800px;
  margin: 0 auto;
  text-align: left;
}
.form-section {
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 30px;
  background-color: #fcfcfc;
}
.form-section:disabled {
  background-color: #f9f9f9;
  opacity: 0.7;
}
.form-section legend {
  font-size: 20px;
  font-weight: 600;
  padding: 0 10px;
  margin-left: 10px;
  color: var(--bpjs-blue);
}
.section-desc {
  font-size: 14px;
  color: var(--text-muted);
  margin-top: -10px;
  margin-bottom: 20px;
}

.radio-group label {
  display: block;
  background-color: #fff;
  border: 2px solid var(--border-color);
  border-radius: 10px;
  padding: 15px 20px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.2s;
}
.radio-group label:has(input:checked) {
  border-color: var(--bpjs-blue);
  background-color: var(--bpjs-blue-light);
  box-shadow: 0 4px 12px rgba(0, 91, 172, 0.1);
}
.radio-group input[type="radio"] {
  margin-right: 12px;
  transform: scale(1.2);
  accent-color: var(--bpjs-blue);
}
.radio-group strong {
  font-size: 16px;
  color: var(--text-dark);
}
.radio-group small {
  display: block;
  font-size: 13px;
  color: var(--text-muted);
  margin-left: 28px;
  margin-top: 2px;
}

.manual-controls {
  border-color: #f39c12;
  background-color: #fef9f2;
}
.manual-controls legend {
  color: #f39c12;
}

.form-group {
  margin-bottom: 20px;
}
.form-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 8px;
}
.form-group input[type="time"],
.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
}
.form-group textarea {
  resize: vertical;
  min-height: 80px;
}
.schedule-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.btn-submit {
  width: 100%;
  padding: 18px;
  font-size: 18px;
}

@media (max-width: 600px) {
  .schedule-grid {
    grid-template-columns: 1fr;
  }
  .form-section {
    padding: 20px 15px;
  }
}
</style>