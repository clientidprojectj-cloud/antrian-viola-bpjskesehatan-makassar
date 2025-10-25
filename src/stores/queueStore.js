import { defineStore } from 'pinia'
import { ref, computed } from 'vue' 
import { useSettingsStore } from './settingsStore'
const SCRIPT_URL = import.meta.env.VITE_SCRIPT_URL;

export const useQueueStore = defineStore('queue', () => {
  const isLoading = ref(false);
  const ticket = ref(null); 
  const error = ref(null);
  const settingsStore = useSettingsStore();
  const hasActiveTicket = computed(() => {
    const today = new Date().toISOString().slice(0, 10);
    return ticket.value && ticket.value.tanggal === today;
  });

  const formStatus = computed(() => {
    const settings = settingsStore.settings;

    if (settings.controlMode === 'manual') {
      const isOpen = settings.manualStatus === 'buka';
      return {
        isOpen: isOpen,
        message: isOpen 
          ? settings.messages.buka 
          : settings.manualMessage 
      }
    }

    const now = new Date();
    const day = now.getDay(); 
    const currentTime = now.getHours() + (now.getMinutes() / 60);

    if ((day === 0 && !settings.schedule.minggu_buka) || (day === 6 && !settings.schedule.sabtu_buka)) {
      return { 
        isOpen: false, 
        message: settings.messages.libur 
      };
    }

    const parseTime = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours + (minutes / 60);
    };

    const sesi1_start = parseTime(settings.schedule.sesi1_start);
    const sesi1_end = parseTime(settings.schedule.sesi1_end);
    const sesi2_start = parseTime(settings.schedule.sesi2_start);
    const sesi2_end = parseTime(settings.schedule.sesi2_end);

    const sesi1_aktif = settings.schedule.sesi1_aktif;
    const sesi2_aktif = settings.schedule.sesi2_aktif;

    const isSesi1 = (sesi1_aktif && currentTime >= sesi1_start && currentTime <= sesi1_end);
    const isSesi2 = (sesi2_aktif && currentTime >= sesi2_start && currentTime <= sesi2_end);

    if (isSesi1 || isSesi2) {
      return { 
        isOpen: true, 
        message: settings.messages.buka 
      };
    }


    let nextOpen = '';
    
    if (sesi1_aktif && currentTime < sesi1_start) {
      nextOpen = `pukul ${settings.schedule.sesi1_start} WITA hari ini.`;
    
    } else if (sesi2_aktif && (currentTime < sesi2_start) && (!sesi1_aktif || currentTime > sesi1_end)) {

      nextOpen = `pukul ${settings.schedule.sesi2_start} WITA.`;

    } else { 
      
      let nextDayStartText = '';
      let nextDayStartFound = false;

      if (sesi1_aktif) {
        nextDayStartText = `pukul ${settings.schedule.sesi1_start} WITA besok hari.`;
        nextDayStartFound = true;
      } else if (sesi2_aktif) {
        nextDayStartText = `pukul ${settings.schedule.sesi2_start} WITA besok hari.`;
        nextDayStartFound = true;
      }

      if (day === 5 && !settings.schedule.sabtu_buka) {
        nextDayStartText = `hari Senin.`;
        nextDayStartFound = true;
      } else if (day === 6 && !settings.schedule.minggu_buka) { 
        nextDayStartText = `hari Senin.`;
        nextDayStartFound = true;
      } else if (day === 0 && !sesi1_aktif && !sesi2_aktif) {
        nextDayStartText = `hari Senin.`;
        nextDayStartFound = true;
      }

      if (nextDayStartFound) {
         nextOpen = nextDayStartText;
      } else {
         nextOpen = 'hari ini. Silakan cek kembali jadwal operasional.'; 
      }
    }

    return { 
      isOpen: false, 
      message: `${settings.messages.tutup_prefix} ${nextOpen}`
    };
  });

  function checkLocalStorage() {
    const storedData = localStorage.getItem('antrianData');
    if (storedData) {
      ticket.value = JSON.parse(storedData);
    }
  }

  async function submitQueue(formData) {
    isLoading.value = true;
    error.value = null;
    try {
      const formPayload = new FormData();
      formPayload.append('nama', formData.nama);
      formPayload.append('hp', `'${formData.hp}`); 
      formPayload.append('layanan', formData.layanan);

      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: formPayload,
      });

      if (!response.ok) throw new Error('Terjadi masalah pada server.');

      const data = await response.json();

      if (data.status === 'sukses') {
        const newTicket = {
          nomor: data.nomorAntrian,
          nama: formData.nama,
          layanan: formData.layanan,
          tanggal: new Date().toISOString().slice(0, 10)
        };
        ticket.value = newTicket;
        localStorage.setItem('antrianData', JSON.stringify(newTicket));
      } else {
        throw new Error(data.message || 'Gagal mendapatkan nomor antrian.');
      }
    } catch (err) {
      console.error('Error:', err);
      error.value = "Gagal mengambil nomor antrian. Mohon periksa koneksi Anda dan coba lagi.";
    } finally {
      isLoading.value = false;
    }
  }

  function clearTicket() {
    if (confirm('Anda yakin ingin menghapus nomor antrian saat ini?')) {
      ticket.value = null;
      localStorage.removeItem('antrianData');
    }
  }

  
  return {
    isLoading,
    ticket,
    error,
    hasActiveTicket,
    formStatus, 
    checkLocalStorage,
    submitQueue,
    clearTicket
  };
});
