// file: src/stores/operatorStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const SCRIPT_URL = import.meta.env.VITE_SCRIPT_URL;

export const useOperatorStore = defineStore('operator', () => {
    // State
    const allQueues = ref([]);
    const isFetching = ref(false);
    const isUpdating = ref(false);
    // Getters
    const currentQueue = computed(() => allQueues.value.find(q => q.status === 'Mengantre'));
    const nextQueues = computed(() => allQueues.value.filter(q => q.status === 'Mengantre').slice(1));
    const skippedQueues = computed(() => allQueues.value.filter(q => q.status === 'Dilewati'));

    // Actions
    async function fetchQueues() {
        isFetching.value = true;
        try {
            const response = await fetch(`${SCRIPT_URL}?action=getQueueData`);
            const result = await response.json();
            if (result.status === 'sukses') {
                allQueues.value = result.data.sort((a, b) => a.nomor - b.nomor);
            }
        } catch (error) {
            console.error("Gagal mengambil data antrian:", error);
        } finally {
            isFetching.value = false;
        }
    }

    async function updateQueueStatus(nomor, status) {
        const formData = new FormData();
        formData.append('action', 'updateStatus');
        formData.append('nomor', nomor);
        formData.append('status', status);
        isUpdating.value = true;
        try {
            await fetch(SCRIPT_URL, { method: 'POST', body: formData });
            await fetchQueues(); // Ambil data terbaru setelah update
        } catch (error) {
            console.error("Gagal update status:", error);
            alert("Gagal memperbarui status. Periksa koneksi.");
        } finally {
            isUpdating.value = false;
        }
    }

    return { allQueues, isFetching, isUpdating, currentQueue, nextQueues, skippedQueues, fetchQueues, updateQueueStatus };
})