const os = require('os');
const settings = require('../settings.js');

function formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor(seconds % 86400 / 3600);
    const minutes = Math.floor(seconds % 3600 / 60);
    const secs = Math.floor(seconds % 60);

    const d = days > 0 ? `${days}d ` : '';
    const h = hours > 0 ? `${hours}h ` : '';
    const m = minutes > 0 ? `${minutes}m ` : '';
    const s = secs > 0 ? `${secs}s` : '0s';

    return `\( {d} \){h}\( {m} \){s}`.trim();
}

function getRamUsage() {
    const used = process.memoryUsage().rss / 1024 / 1024;
    return `${used.toFixed(2)} MB`;
}

async function pingCommand(sock, chatId, message) {
    try {
        const startTime = Date.now();

        // Step 1: Tuma "Measuring..." kwa haraka sana
        const measuringMsg = await sock.sendMessage(chatId, {
            text: "```Measuring Speed...``` ⚡"
        }, { quoted: message });

        const latency = Date.now() - startTime;

        // Bot Info Premium Style
        const uptime = formatUptime(process.uptime());
        const platform = os.type();
        const ram = getRamUsage();
        const cpu = os.cpus()[0].model.split(' ')[0] + ' ' + os.cpus().length + '-Core';

        const premiumPing = 
`┏━━━━━━┫ MANGI VIRUS™ ┣━━━━━━┓
┃  ⚡ *BOT SPEED TEST* ⚡
┣━━━━━━━━━━━━━━━━━━━━━
┃  🚀 *Latency*    : ${latency}ms
┃  🕒 *Uptime*      : ${uptime}
┃  💾 *RAM Usage*   : ${ram}
┃  🖥️ *Platform*    : ${platform}
┃  ⚙️ *Processor*   : ${cpu}
┃  📟 *Version*     : v${settings.version || '2.0'}
┃  🌙 *Mode*        : Public • Premium
┣━━━━━━━━━━━━━━━━━━━━━
┃  🟢 *Status* : Fully Active & Stable
┗━━━━━━━━━━━━━━━━━━━━━

> © 2026 MANGI VIRUS Tech™ • Powered by NodeJS + Baileys`;

        // Step 2: Edit the "Measuring..." message to final premium result
        await sock.sendMessage(chatId, {
            text: premiumPing,
            edit: measuringMsg.key
        });

        // Optional: Ongeza reaction ya rocket
        await sock.sendMessage(chatId, {
            react: { text: "⚡", key: measuringMsg.key }
        });

    } catch (error) {
        console.error('Error in premium ping command:', error);
        await sock.sendMessage(chatId, {
            text: "😭 Ping failed, bot alwaysonline! 💪"
        }, { quoted: message });
    }
}

module.exports = pingCommand;
