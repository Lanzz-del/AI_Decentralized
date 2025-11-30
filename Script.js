// === KONFIGURASI MODEL & ELEMEN DOM ===
const MODEL_NAME = 'Xenova/TinyLlama-v0.0'; // Model paling ringan dan kompatibel
let pipeline = null; // Variable untuk menyimpan pipeline LLM

const chatHistory = document.getElementById('chat-history');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const statusMessage = document.getElementById('status-message');
const progressBar = document.getElementById('progress-bar');
const progressBarContainer = document.getElementById('progress-bar-container');
const clearChatButton = document.getElementById('clear-chat-button');

// === FUNGSI UTILITAS ===

// Menambahkan pesan ke tampilan chat
function addMessage(sender, text, isError = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message ${isError ? 'error-message' : ''}`;
    messageDiv.innerHTML = `<p>${text}</p>`;
    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight; // Auto-scroll ke bawah
}

// Memperbarui progress bar saat download model
function updateProgress(data) {
    if (data.status === 'download' && data.progress) {
        progressBar.style.width = `${data.progress}%`;
        statusMessage.textContent = `Mengunduh model (${data.progress.toFixed(2)}%)...`;
    } else if (data.status === 'ready') {
        progressBarContainer.style.display = 'none';
        statusMessage.textContent = 'Model siap! Chat dimulai.';
    } else if (data.status === 'initiate') {
        progressBarContainer.style.display = 'block';
        progressBar.style.width = '0%';
        statusMessage.textContent = 'Memulai inisialisasi model...';
    } else {
        statusMessage.textContent = `Status: ${data.status}`;
    }
}

// Menyimpan riwayat obrolan ke Local Storage (Client-Side)
function saveHistory() {
    localStorage.setItem('chatHistory', chatHistory.innerHTML);
}

// Memuat riwayat obrolan dari Local Storage
function loadHistory() {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
        chatHistory.innerHTML = savedHistory;
    }
}

// Menghapus riwayat obrolan dari tampilan dan Local Storage
function clearChatHistory() {
    if (confirm("Apakah Anda yakin ingin menghapus seluruh riwayat obrolan? Ini tidak dapat dibatalkan.")) {
        chatHistory.innerHTML = `
            <div class="message bot-message">
                <p>Halo! Saya adalah chatbot AI privat Anda. Semua percakapan diproses di perangkat Anda dan tidak dikirim ke server manapun.</p>
            </div>
        `;
        localStorage.removeItem('chatHistory');
    }
}


// === FUNGSI INTI LLM ===

// 1. Inisialisasi Model dengan transformers.js
async function initializeModel() {
    try {
        updateProgress({ status: 'initiate' });
        // Menggunakan self.transformers untuk akses global dari CDN
        pipeline = await self.transformers.pipeline(
            'text-generation', 
            MODEL_NAME, 
            { 
                revision: 'main',
                progress_callback: updateProgress // Callback untuk update progress
            }
        );
        
        sendButton.disabled = false;
        sendButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-send"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`;
        userInput.focus();
        updateProgress({ status: 'ready' });

    } catch (error) {
        console.error('Fatal Error: Gagal memuat atau menginisialisasi model LLM:', error);
        statusMessage.textContent = 'Error fatal: Gagal memuat model. Periksa konsol browser atau coba di perangkat/browser lain.';
        statusMessage.style.color = '#e74c3c'; // Merah untuk error
        progressBarContainer.style.display = 'none';
        sendButton.disabled = true;
    }
}

// 2. Fungsi Inferensi (Pemrosesan di perangkat pengguna)
async function runInference(prompt) {
    if (!pipeline) {
        addMessage('bot', 'Model belum siap. Mohon tunggu atau refresh halaman.', true);
        return;
    }

    sendButton.disabled = true;
    sendButton.innerHTML = `<span class="spinner"></span>`; // Indikator loading
    statusMessage.textContent = 'AI berpikir di perangkat Anda...';
    
    try {
        const output = await pipeline(prompt, {
            max_new_tokens: 150, // Menambah jumlah token untuk balasan lebih kaya
            temperature: 0.7,
            do_sample: true,
            // TinyLlama tidak memiliki template khusus seperti Gemma, jadi kita biarkan standar
        });

        const generatedText = output[0].generated_text.trim();
        // Karena TinyLlama seringkali hanya mengembalikan prompt + jawaban, kita perlu membersihkannya
        const cleanResponse = generatedText.startsWith(prompt) 
                            ? generatedText.substring(prompt.length).trim() 
                            : generatedText;
        
        statusMessage.textContent = 'Model siap! Chat dimulai.';
        sendButton.disabled = false;
        sendButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-send"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`;
        return cleanResponse;

    } catch (error) {
        console.error('Error saat menjalankan inferensi:', error);
        addMessage('bot', 'Maaf, terjadi error saat AI memproses jawaban Anda. Coba lagi.', true);
        statusMessage.textContent = 'Error: Inferensi gagal. Coba lagi.';
        statusMessage.style.color = '#e74c3c';
        sendButton.disabled = false;
        sendButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-send"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`;
        return "Terjadi kesalahan.";
    }
}

// === HANDLER PENGIRIMAN PESAN ===
async function sendMessage() {
    const userText = userInput.value.trim();
    if (!userText || sendButton.disabled) return;

    addMessage('user', userText);
    userInput.value = '';
    userInput.style.height = 'auto'; // Reset textarea height

    const botResponse = await runInference(userText);
    addMessage('bot', botResponse);
    saveHistory();
}

// === EVENT LISTENERS & INISIALISASI ===

// Otomatis adjust tinggi textarea
userInput.addEventListener('input', () => {
    userInput.style.height = 'auto';
    userInput.style.height = userInput.scrollHeight + 'px';
});

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { // Kirim saat Enter, bukan Shift + Enter
        e.preventDefault(); // Mencegah baris baru
        sendMessage();
    }
});
clearChatButton.addEventListener('click', clearChatHistory);

loadHistory(); // Muat riwayat saat aplikasi dibuka
initializeModel(); // Mulai memuat model saat halaman dimuat

