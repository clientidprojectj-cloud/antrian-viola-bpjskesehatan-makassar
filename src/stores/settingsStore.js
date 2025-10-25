import { defineStore } from 'pinia'
import { ref as vueRef } from 'vue' 
import { db } from '@/firebase/config'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'

const defaultSettings = {
  controlMode: 'otomatis',
  manualStatus: 'tutup',
  manualMessage: 'Pendaftaran ditutup sementara oleh operator.',
  
  schedule: {
    sesi1_start: '08:00',
    sesi1_end: '11:50',
    sesi1_aktif: true, 
    sesi2_start: '13:00',
    sesi2_end: '15:00',
    sesi2_aktif: true, 
    sabtu_buka: false, 
    minggu_buka: false,
    hari_operasional_teks: "Senin - Jumat (Sabtu, Minggu, dan Hari Libur Nasional Tutup)"
  },
  
  messages: {
    buka: "Formulir sedang dibuka.",
    libur: "Pendaftaran antrian online tutup pada hari Sabtu dan Minggu.",
    tutup_prefix: "Saat ini pendaftaran ditutup. Akan dibuka kembali"
  }
};
// ---------------------------------

export const useSettingsStore = defineStore('settings', () => {
    const settingsDocRef = doc(db, 'appSettings', 'formSettings');
    const settings = vueRef(defaultSettings);
    const isLoading = vueRef(true);
    let listener = null;

    function initListener() {
        if (listener) return; 
        
        isLoading.value = true;
        

        listener = onSnapshot(settingsDocRef, (snapshot) => {
            if (snapshot.exists()) {
                const dbData = snapshot.data();
                
                settings.value = {
                  ...defaultSettings,
                  ...dbData,
                  schedule: { ...defaultSettings.schedule, ...dbData.schedule },
                  messages: { ...defaultSettings.messages, ...dbData.messages }
                };
            } else {
                setDoc(settingsDocRef, defaultSettings);
                settings.value = defaultSettings;
            }
            isLoading.value = false;
        }, (error) => {
            console.error("Gagal mendengarkan status form (Firestore):", error);
            isLoading.value = false;
        });
    }
    
    async function updateSettings(newSettings) {
        isLoading.value = true; 
        try {
            await setDoc(settingsDocRef, newSettings);
        } catch (error) {
            console.error("Gagal update status form (Firestore):", error);
            alert("Gagal memperbarui status. Cek koneksi.");
        }
        isLoading.value = false;
    }

    return { 
        settings, 
        isLoading, 
        initListener, 
        updateSettings 
    };
})