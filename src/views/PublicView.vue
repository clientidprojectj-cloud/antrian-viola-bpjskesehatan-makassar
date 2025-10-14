<template>
  <div class="public-view-wrapper">
    
    <main class="main-content-public">
      <LoadingSpinner v-if="store.isLoading" />
      <TicketDisplay v-else-if="store.hasActiveTicket" />
      <FormClosedMessage 
        v-else-if="!store.formStatus.isOpen" 
        :message="store.formStatus.message" 
      />
      <QueueForm v-else />
    </main>

    <footer class="public-footer">
      <p class="copyright">
        &copy; {{ new Date().getFullYear() }} BPJS Kesehatan Cabang Makassar
      </p>
    </footer>
    
  </div>
</template>

<script setup>
// 1. Import komponen baru yang sudah kita buat
import { onMounted } from 'vue'
import { useQueueStore } from '@/stores/queueStore'
import QueueForm from '@/components/QueueForm.vue'
import TicketDisplay from '@/components/TicketDisplay.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import FormClosedMessage from '@/components/FormClosedMessage.vue' // <-- IMPORT INI

const store = useQueueStore()

onMounted(() => {
  store.checkLocalStorage()
})
</script>