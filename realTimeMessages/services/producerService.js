const kafka = require('../../realTimeMessages/config/kafkaConfig');

const sendMessage = async (topic, userId, message) => {
    try {
        const producer = kafka.producer();
        await producer.connect();

        const payload = {
            userId,
            message,
        };

        await producer.send({
            topic: topic, // שימוש בנושא שנשלח בבקשה
            messages: [
                { value: JSON.stringify(payload) }
            ]
        });

        console.log(`Message sent to topic "${topic}" for user ${userId}`);
        await producer.disconnect();
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};

module.exports = { sendMessage };


