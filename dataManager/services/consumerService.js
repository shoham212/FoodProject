const kafka = require('../../realTimeMessages/config/kafkaConfig');

const runConsumer = async () => {
    const consumer = kafka.consumer({ groupId: 'project1Group' });

    try {
        await consumer.connect();
        console.log('Consumer connected to Kafka successfully.');

        await consumer.subscribe({ topic: 'medical-updates', fromBeginning: true });
        console.log('Subscribed to topic: medical-updates');

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const { userId, message: userMessage } = JSON.parse(message.value.toString());
                    console.log(`Message for user ${userId} received: ${userMessage}`);

                    // לוגיקה נוספת כמו שמירת ההודעה ב-DB
                    // await saveMessageToDB(userId, userMessage);

                    // או שליחת הודעה דרך שירות צד שלישי
                    // await sendNotification(userId, userMessage);
                } catch (err) {
                    console.error('Error processing message:', err.message);
                }
            },
        });
    } catch (err) {
        console.error('Error starting consumer:', err.message);
    }
};

module.exports = { runConsumer };
