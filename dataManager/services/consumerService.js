const kafka = require('../../realTimeMessages/config/kafkaConfig');


const runConsumer = async () => {
    const consumer = kafka.consumer({ groupId: 'project1Group' }); // הגדרת הקבוצה של הצרכן
    await consumer.connect();

    await consumer.subscribe({ topic: 'medical-updates', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const receivedMessage = message.value.toString(); // המרת ההודעה לטקסט
            console.log(`Message received on topic ${topic}: ${receivedMessage}`);
        },
    });
};

module.exports = { runConsumer };
