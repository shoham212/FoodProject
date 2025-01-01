const { sendMessage } = require('../services/producerService');

const sendUserMessage = async (req, res) => {
    const { topic, userId, message } = req.body; // קבלת הנושא, userId, והודעה מהבקשה
    try {
        if (!topic || !userId || !message) {
            return res.status(400).json({ error: 'topic, userId, and message are required' });
        }

        await sendMessage(topic, userId, message);
        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message', details: error.message });
    }
};

module.exports = { sendUserMessage };

