// Konfigurasi MQTT
const brokerUrl = 'wss://8cb15def763044589905db3abee4c47d.s1.eu.hivemq.cloud:8884/mqtt';
const clientId = 'web_dashboard_client';
const username = 'hivemq.webclient.1737922294562';
const password = 'r3z:qeG1DV$ab09MQ*;P';

// Membuat koneksi ke broker MQTT menggunakan WebSocket Secure (WSS)
const client = mqtt.connect(brokerUrl, {
    clientId: clientId,
    username: username,
    password: password,
    clean: true,
    reconnectPeriod: 1000,
});

// Elemen DOM
const statusElement = document.getElementById('status');
const screen1 = document.getElementById('screen1');
const screen2 = document.getElementById('screen2');
const lcd = document.getElementById('lcd');
const timePickerForm = document.getElementById('time-picker-form');
const backgroundInput = document.getElementById('background-input');
const exitBtn = document.getElementById('exitBtn');

// Event: MQTT terhubung
client.on('connect', function () {
    console.log('Connected to MQTT Broker');
    statusElement.innerText = 'Connected to MQTT Broker';
    statusElement.style.color = 'green';

    // Subscribe ke topik
    client.subscribe('servo/control', { qos: 1 });
    client.subscribe('servo/schedule', { qos: 1 });
    client.subscribe('device/status', { qos: 1 });

    // Pindah ke screen 2 setelah koneksi
    setTimeout(() => {
        screen1.style.display = 'none';
        screen2.style.display = 'block';
    }, 1000);
});

// Event: Pesan diterima
client.on('message', function (topic, message) {
    console.log(`Message received on topic ${topic}:`, message.toString());

    // Tampilkan pesan di LCD
    if (topic === 'device/status') {
        lcd.innerText = message.toString();
    }
});

// Tombol: Kontrol manual servo
document.getElementById('manualBtn').addEventListener('click', function () {
    const message = 'MANUAL';
    client.publish('servo/control', message, { qos: 1 });
    lcd.innerText = 'Manual Mode Activated';
    console.log('Manual mode activated');
});

// Tombol: Kontrol otomatis servo
document.getElementById('autoBtn').addEventListener('click', function () {
    const message = 'AUTO';
    client.publish('servo/control', message, { qos: 1 });
    lcd.innerText = 'Automatic Mode Activated';
    console.log('Automatic mode activated');
});

// Form: Update jadwal pakan
timePickerForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const time1 = document.getElementById('time1').value;
    const time2 = document.getElementById('time2').value;
    const time3 = document.getElementById('time3').value;

    const schedule = {
        schedule: [time1, time2, time3],
    };

    client.publish('servo/schedule', JSON.stringify(schedule), { qos: 1 });
    lcd.innerText = 'Schedule Updated';
    console.log('Schedule updated:', schedule);
});

// Input: Ubah background
backgroundInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.body.style.backgroundImage = `url(${e.target.result})`;
        };
        reader.readAsDataURL(file);
    }
});

// Tombol: Keluar
exitBtn.addEventListener('click', function () {
    screen1.style.display = 'block';
    screen2.style.display = 'none';
    client.end();
    console.log('Disconnected and returned to login screen');
});
