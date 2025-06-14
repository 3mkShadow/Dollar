const express = require('express');
const path = require('path');
const Discord = require('discord.js');
const app = express();
const port = 20136; // بورت الموقع
const db = require('pro.db');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// يمكنك إضافة صفحات أخرى بنفس الطريقة إذا احتجت
app.get('/:page', (req, res) => {
  const filePath = path.join(__dirname, `${req.params.page}.html`);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).send('الصفحة غير موجودة');
    }
  });
});
app.get('/services', (req, res) => {
  res.sendFile(path.join(__dirname, 'services.html'));
});
// مثال على API وهمي (اختياري)
app.get('/api/users', (req, res) => {
const data = db.get("users") || [];
  res.json(data);
});

// بدء تشغيل السيرفر
app.listen(port, () => {
  console.log(`✅ الموقع يعمل على http://localhost:${port}`);
});

// كود بوت الديسكورد (مثل اللي سبق)
const client = new Discord.Client({
  intents: ['GUILDS', 'GUILD_MESSAGES', 'MESSAGE_CONTENT']
});

const prefix = "!";

client.on('messageCreate', async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  if (command === "adduser") {
const member = message.member;
  const hasRole = member.roles.cache.some(role => role.name === `$`);

  if (!hasRole) {
    return message.reply("ليس لديك صلاحية استخدام هذا الأمر.");
  }

  const user = message.mentions.users.first();
  if (!user) return message.reply("منشن الشخص المطلوب.");

  const name = args.slice(1, 3).join(' '); // الكلمة الثانية والثالثة تكون الاسم
  const desc = args.slice(3).join(' ');    // من الرابعة وما بعد للوصف

  if (!name || !desc) return message.reply("اكتب الاسم (كلمتين) ثم الوصف.");

  let data = db.get("users") || [];
  const existingIndex = data.findIndex(u => u.id === user.id);
    if (existingIndex !== -1) {
      data[existingIndex].boxes.push({ name, desc });
    } else {
      data.push({
        id: user.id,
        displayName: user.username,
        boxes: [{ name, desc, images: [] }]
      });
    }
    db.set("users", data);
    message.channel.send(`تمت إضافة المربع لـ ${user.username}`);
  }

  if (command === "addimages") {
const member = message.member;
  const hasRole = member.roles.cache.some(role => role.name === `$`);

  if (!hasRole) {
    return message.reply("ليس لديك صلاحية استخدام هذا الأمر.");
  }
    const user = message.mentions.users.first();
    if (!user) return message.reply("منشن الشخص المطلوب.");
    if (!message.attachments.size) return message.reply("ارفق صور مع الأمر.");

    let data = db.get("users") || [];
    const userIndex = data.findIndex(u => u.id === user.id);
    if (userIndex === -1) return message.reply("المستخدم غير موجود.");

    // نضيف الصور للـ boxes الأخيرة (آخر مربع مضاف)
    const imgs = message.attachments.map(a => a.url);
    data[userIndex].boxes[data[userIndex].boxes.length - 1].images.push(...imgs);

    db.set("users", data);
    message.channel.send(`تمت إضافة الصور لـ ${user.username}`);
  }
});

client.login('MTMyNzY4OTU1NzYyOTczNDk0Mg.GRA4KD.RdctITG6HKqZNhOfjNqNKipqrJa4K_cYU-0haI');
