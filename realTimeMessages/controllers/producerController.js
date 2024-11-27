const kafka = require('../config/kafkaConfig');

const sendMessage = async (req, res) => {
  try {
    const { topic, message } = req.body;

    const producer = kafka.producer();
    await producer.connect();
    await producer.send({
      topic,
      messages: [{ value: message }],
    });

    await producer.disconnect();
    res.status(200).json({ status: 'success', message: 'Message sent' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ status: 'error', error: error.message });
  }
};

module.exports = { sendMessage };
