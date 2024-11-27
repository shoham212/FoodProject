const kafka = require('../config/kafkaConfig');

const sendMessage = async (message) => {
    const producer = kafka.producer();
    await producer.connect().catch((err) => console.error('Error connecting to Kafka:', err));

    await producer.send({
        topic: 'medical-updates', // Topic שדרכו נשלחות ההודעות
        messages: [
            { value: JSON.stringify(message) }, // ההודעה נשלחת בפורמט JSON
        ],
    });

    console.log(`Message sent: ${JSON.stringify(message)}`);
    await producer.disconnect();
};

module.exports = { sendMessage };
