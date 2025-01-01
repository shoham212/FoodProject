const kafka = require('../../realTimeMessages/config/kafkaConfig');

const runConsumer = async () => {
    const consumer = kafka.consumer({ groupId: 'projectGroup' });
    await consumer.connect();

    await consumer.subscribe({ topic: 'medical-updates', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const { userId, message: userMessage } = JSON.parse(message.value.toString());
            console.log(`Message received from topic "${topic}" for user ${userId}: ${userMessage}`);
            // כאן ניתן להוסיף לוגיקה נוספת, כמו שמירת ההודעה ב-DB
        },
    });
};

module.exports = { runConsumer };
