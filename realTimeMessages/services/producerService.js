const kafka = require('../../realTimeMessages/config/kafkaConfig');

const sendMessage = async (userId, message) => {
    const producer = kafka.producer();
    await producer.connect();

    await producer.send({
        topic: 'medical-updates',
        messages: [
            { value: JSON.stringify({ userId, message }) }, // כולל userId עם ההודעה
        ],
    });

    console.log(`Message sent for user ${userId}: ${message}`);
    await producer.disconnect();
};

module.exports = { sendMessage };
