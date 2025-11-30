// === LOGIKA JAVASCRIPT MURNI (NON-AI) ===

const chatHistory = document.getElementById('chat-history');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const statusMessage = document.getElementById('status-message');
const clearChatButton = document.getElementById('clear-chat-button');

// Daftar balasan yang sudah ditentukan
const predefinedResponses = [
    "Terima kasih atas pesan Anda! Sebagai *chatbot* portofolio, saya fokus pada *user experience* dan kebersihan kode JavaScript.",
    "Semua fungsionalitas di sini (input, output, history) diimplementasikan menggunakan Vanilla JS.",
    "Pertanyaan Anda sangat menarik! Dalam konteks *chatbot* ini, kami mengutamakan efisiensi dan *zero operational cost*.",
    "Ini adalah respon acak. Saya tidak memiliki model bahasa besar, tetapi saya bisa mensimulasikan interaksi.",
    "Bagaimana pendapat Anda tentang *styling* dan desain *dark mode* yang kami gunakan? Feedback Anda penting untuk portofolio ini!"
];

let responseIndex = 0;

// === FUNGSI UTILITAS ===

// Menambahkan pesan ke tampilan chat
function addMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.innerHTML = `<p>${text}</p>`;
    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

// Menyimpan riwayat obrolan ke Local Storage
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

// Menghapus riwayat obrolan
function clearChatHistory() {
    if (confirm("Apakah Anda yakin ingin menghapus seluruh riwayat obrolan?")) {
        chatHistory.innerHTML = `
            <div class="message bot-message">
                <p>Halo! Saya adalah *chatbot* murni JavaScript. Saya dirancang untuk menunjukkan keahlian UI/UX, bukan inferensi AI. Silakan ketik apa saja!</p>
            </div>
        `;
        localStorage.removeItem('chatHistory');
    }
}


// === HANDLER CHAT NON-AI ===

async function sendMessage() {
    const userText = userInput.value.trim();
    if (!userText) return;

    // 1. Tampilkan Pesan Pengguna
    addMessage('user', userText);
    userInput.value = '';
    userInput.style.height = 'auto'; 

    // 2. Simulasikan Loading (Tombol Kirim Dinonaktifkan)
    sendButton.disabled = true;
    sendButton.innerHTML = `<span class="spinner">⏳</span>`; 
    statusMessage.textContent = 'Bot sedang mensimulasikan pemrosesan...';

    // 3. Simulasikan Delay (1 detik)
    await new Promise(resolve => setTimeout(resolve, 1000)); 

    // 4. Ambil Balasan (Rotasi Sederhana)
    const botResponse = predefinedResponses[responseIndex % predefinedResponses.length];
    responseIndex++;

    // 5. Tampilkan Balasan Bot
    addMessage('bot', botResponse);
    saveHistory();
    
    // 6. Kembalikan Tombol ke Status Aktif
    sendButton.disabled = false;
    sendButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-send"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`;
    statusMessage.textContent = 'Sistem Siap. (Tidak ada *loading* model).';
}


// === EVENT LISTENERS & INISIALISASI AWAL ===
userInput.addEventListener('input', () => {
    userInput.style.height = 'auto';
    userInput.style.height = userInput.scrollHeight + 'px';
});

// *--- PERHATIAN: Memastikan tombol Kirim bekerja saat di-klik ---*
sendButton.addEventListener('click', sendMessage);

// *--- PERHATIAN: Memastikan tombol Kirim bekerja saat ENTER ditekan ---*
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { 
        e.preventDefault(); 
        sendMessage();
    }
});

clearChatButton.addEventListener('click', clearChatHistory);

loadHistory(); 
sendButton.disabled = false;
statusMessage.textContent = 'Sistem Siap. (Tidak ada *loading* model).';
