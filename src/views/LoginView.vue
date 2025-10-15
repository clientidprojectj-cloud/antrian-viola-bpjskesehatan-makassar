<template>
  <div class="login-container">
    <div class="card login-card fade-in-up">
      <div class="card-header">
        <img src="@/assets/logo-bpjs.png" alt="Logo BPJS Kesehatan" class="logo-bpjs">
        <h1>Portal Operator VIOLA</h1>
        <p>Silakan masuk untuk mengakses panel antrian.</p>
      </div>

      <form @submit.prevent="handleLogin">
        <!-- Input Email dengan Ikon -->
        <div class="input-group">
          <i class="fa-solid fa-envelope input-icon"></i>
          <input 
            type="email" 
            id="email" 
            placeholder="Alamat Email" 
            required
            v-model="email">
        </div>

        <!-- Input Password dengan Ikon -->
        <div class="input-group">
          <i class="fa-solid fa-lock input-icon"></i>
          <input 
            type="password" 
            id="password" 
            placeholder="Password" 
            required
            v-model="password">
        </div>

        <!-- Link Lupa Password -->
        <div class="extra-options">
          <a href="#" @click.prevent="openResetModal" class="forgot-password-link">Lupa Password?</a>
        </div>
        
        <!-- Pesan Error -->
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <button type="submit" class="btn btn-submit" :disabled="isLoading">
          <span v-if="isLoading" class="btn-spinner"></span>
          <span v-else>Masuk</span>
        </button>
      </form>
    </div>
     <p class="copyright">
      &copy; {{ new Date().getFullYear() }} BPJS Kesehatan Cabang Makassar
    </p>

    <div v-if="showResetModal" class="modal-overlay" @click.self="closeResetModal">
        <div class="modal-card fade-in-up">
            <h3>Reset Password</h3>
            <p>Masukkan alamat email Anda yang terdaftar. Kami akan mengirimkan link untuk mereset password Anda.</p>
            
            <div class="input-group">
                <i class="fa-solid fa-envelope input-icon"></i>
                <input type="email" v-model="resetEmail" placeholder="Email terdaftar">
            </div>

            <div v-if="resetMessage" :class="['reset-message', isResetError ? 'error' : 'success']">
                {{ resetMessage }}
            </div>

            <div class="modal-actions">
                <button class="btn btn-secondary" @click="closeResetModal" :disabled="isSendingReset">Batal</button>
                <button class="btn btn-submit" @click="handleResetPassword" :disabled="isSendingReset || isResetEmailSent">
                    <span v-if="isSendingReset" class="btn-spinner"></span>
                    <span v-else>Kirim Link</span>
                </button>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from '@/firebase/config';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);
const router = useRouter();

const showResetModal = ref(false);
const resetEmail = ref('');
const isSendingReset = ref(false);
const resetMessage = ref('');
const isResetError = ref(false);
const isResetEmailSent = ref(false);
const openResetModal = () => {
    showResetModal.value = true;
    resetMessage.value = '';
    resetEmail.value = email.value; 
    isResetEmailSent.value = false;
};
const closeResetModal = () => {
    showResetModal.value = false;
};

const handleResetPassword = async () => {
    if (!resetEmail.value) {
        resetMessage.value = 'Alamat email tidak boleh kosong.';
        isResetError.value = true;
        return;
    }
    isSendingReset.value = true;
    resetMessage.value = '';
    isResetError.value = false;

    try {
        await sendPasswordResetEmail(auth, resetEmail.value);
        resetMessage.value = 'Link reset password telah berhasil dikirim ke email Anda. Silakan periksa SPAM EMAIL atau kotak masuk Anda.';
        isResetEmailSent.value = true;
    } catch (error) {
        isResetError.value = true;
        resetMessage.value = 'Gagal mengirim email. Pastikan alamat email sudah benar dan terdaftar.';
        console.error("Error sending password reset email:", error);
    } finally {
        isSendingReset.value = false;
    }
};

const handleLogin = async () => {
  isLoading.value = true;
  errorMessage.value = '';

  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push({ name: 'operator' });
  } catch (error) {
    errorMessage.value = 'Email atau password yang Anda masukkan salah.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--bg-page, #f4f7fa);
  padding: 20px;
}

.login-card {
  max-width: 420px;
  width: 100%;
  padding: 40px;
}

.logo-bpjs {
  max-width: 150px;
  margin: 0 auto 20px;
  display: block;
}

.card-header h1 {
    font-size: 24px;
    font-weight: 700;
}
.card-header p {
    color: var(--text-muted);
}

.input-group {
    position: relative;
    margin-bottom: 25px;
}
.input-icon {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
    font-size: 16px;
}
.input-group input {
    width: 100%;
    border: none;
    border-bottom: 2px solid var(--border-color);
    padding: 10px 10px 10px 35px; 
    font-size: 1rem;
    background-color: transparent;
    transition: border-color 0.3s;
}
.input-group input:focus {
    outline: none;
    border-bottom-color: var(--bpjs-blue);
}

.extra-options {
    text-align: right;
    margin-bottom: 25px;
    margin-top: -15px;
}
.forgot-password-link {
    font-size: 14px;
    color: var(--bpjs-blue);
    text-decoration: none;
    font-weight: 500;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
  font-size: 14px;
}

.btn-submit {
  width: 100%;
  padding: 16px;
  font-size: 16px;
  font-weight: 700;
}

.copyright {
    text-align: center;
    margin-top: 30px;
    font-size: 13px;
    color: var(--text-muted);
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}
.modal-card {
    background-color: white;
    padding: 30px;
    border-radius: 16px;
    width: 90%;
    max-width: 450px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}
.modal-card h3 {
    font-size: 22px;
    font-weight: 600;
    margin-bottom: 10px;
}
.modal-card p {
    font-size: 15px;
    color: var(--text-muted);
    margin-bottom: 25px;
}
.reset-message {
    padding: 12px;
    border-radius: 8px;
    margin-top: 20px;
    font-size: 14px;
    text-align: center;
}
.reset-message.success { background-color: #d4edda; color: #155724; }
.reset-message.error { background-color: #f8d7da; color: #721c24; }
.modal-actions {
    margin-top: 30px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}
.modal-actions .btn { width: auto; padding: 10px 20px; }
.modal-actions .btn-secondary { background-color: #6c757d; }

@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
}
.fade-in-up {
    animation: fadeInUp 0.5s ease-out forwards;
}
</style>
