// Mengatur URL broker dan kredensial menggunakan MQTT standar (port 1883)
const brokerUrl = 'mqtt://0871555e31eb4d6ebc239cafde0798c1.s1.eu.hivemq.cloud';  // URL HiveMQ Cloud tanpa TLS
const clientId = 'web_dashboard_client';  // Ganti dengan Client ID unik
const username = 'Wan75000';  // Username MQTT dari HiveMQ
const password = 'Ksd75400';  // Password MQTT dari HiveMQ

// Membuat koneksi ke broker MQTT menggunakan port standar (1883)
const client = mqtt.connect(brokerUrl, {
    clientId: clientId,
    username: username,
    password: password,
    clean: true,  // Session bersih setelah disconnect
    reconnectPeriod: 1000,  // Waktu untuk mencoba reconnect
});

client.on('connect', function () {
    document.getElementById('status').innerText = 'Connected to MQTT Broker';
    console.log('Connected to MQTT Broker');
    // Subscribe ke topik
    client.subscribe('home/servo', function (err) {
        if (err) {
            console.log('Subscription error: ', err);
        } else {
            console.log('Subscribed to topic: home/servo');
        }
    });
});

client.on('message', function (topic, message) {
    console.log('Message received:', topic, message.toString());
    // Logika untuk menampilkan pesan di dashboard (misal untuk kontrol servo)
});

// Mengirim pesan ke topik tertentu saat tombol ditekan
document.getElementById('publishBtn').addEventListener('click', function() {
    const message = 'Servo ON';  // Pesan yang akan dikirim
    client.publish('home/servo', message, function() {
        console.log('Message sent:', message);
    });
});
