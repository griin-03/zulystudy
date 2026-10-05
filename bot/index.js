require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates // Quan trọng: Quyền lắng nghe trạng thái Voice
    ]
});

// Lưu thời điểm bắt đầu bật cam của từng User ID
const cameraStartTime = {};

// Đường dẫn API của Cloudflare Worker
const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8787/study-session';

client.once('ready', () => {
    console.log(`🤖 Bot đã sẵn sàng! Đang đăng nhập dưới tên: ${client.user.tag}`);
    console.log(`📡 URL API nhận dữ liệu: ${BACKEND_API_URL}`);
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    const userId = newState.id;

    // --- KỊCH BẢN 1: BẬT CAMERA ---
    if (!oldState.selfVideo && newState.selfVideo) {
        cameraStartTime[userId] = Date.now();
        console.log(`[+] User ${userId} vừa bật cam. Đang đếm giờ...`);
    }

    // --- KỊCH BẢN 2: TẮT CAMERA ---
    // (Lưu ý: Nếu user rời phòng (disconnect), newState.selfVideo cũng sẽ là false/null)
    if (oldState.selfVideo && !newState.selfVideo) {
        if (cameraStartTime[userId]) {
            const durationMs = Date.now() - cameraStartTime[userId];
            const durationSeconds = Math.floor(durationMs / 1000);
            
            console.log(`[-] User ${userId} tắt cam. Học được: ${durationSeconds} giây`);
            delete cameraStartTime[userId]; // Xoá trạng thái đếm giờ

            // Gửi dữ liệu về API Cloudflare Backend
            try {
                const response = await fetch(BACKEND_API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, durationSeconds })
                });
                
                const result = await response.json();
                console.log(`[API Response]`, result);
            } catch (error) {
                console.error(`[LỖI API] Không thể gửi dữ liệu lên server:`, error.message);
            }
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
