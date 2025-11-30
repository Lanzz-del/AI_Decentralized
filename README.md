# AI_Decentralized
​# 🔒 Private Phi-Chatbot (Client-Side & Zero-Server Cost)
​Chatbot ini dibuat berdasarkan prinsip Privacy-First. Seluruh proses kecerdasan buatan (Inferensi LLM) berjalan 100% di perangkat pengguna (client-side) menggunakan WebAssembly/WebGPU.
​✅ Nilai Jual Utama (Unique Value Proposition):
​Zero Data Leakage: Data obrolan pengguna tidak pernah meninggalkan browser. Tidak ada server eksternal yang menerima pesan Anda.
​Desentralisasi Sejati: Arsitektur statis memungkinkan hosting gratis dan menghilangkan ketergantungan pada cloud mahal.
​Zero Operational Cost: Tidak ada biaya API atau biaya cloud computing yang mahal.
​## ⚙️ Teknologi yang Digunakan
​Frontend: HTML, CSS, JavaScript Murni
​Model/Inference: \text{Phi-4-mini} compatible (diimplementasikan menggunakan \text{transformers.js} / Web LLM)
​Deployment: GitHub Pages / Vercel (Gratis/Static Hosting)
​## 🚀 Cara Menggunakan (Client-Side)
​Buka aplikasi di browser Anda.
​Tunggu sebentar. Saat pertama kali dibuka, browser Anda akan mengunduh model LLM ringan (sekitar 200-300MB) secara lokal.
​Setelah status berubah menjadi "Model siap! Chat dimulai," tombol Kirim akan aktif.
​Ketik pesan Anda. Inferensi sekarang berjalan menggunakan CPU/GPU perangkat Anda untuk memproses jawaban.
​Catatan Privasi: Data riwayat obrolan Anda disimpan hanya di Local Storage browser Anda dan tidak dikirimkan ke server manapun.
