const { sendMessage } = require('../services/producerService');

const sendUserMessage = async (req, res) => {
    try {
        const { userId, message } = req.body; // קבלת userId והודעה מהבקשה

        if (!userId || !message) {
            return res.status(400).send({ error: 'userId and message are required' });
        }

        // בדיקת הרשאות: אימות שהשולח הוא רופא
        if (req.user.role !== 'doctor') {
            return res.status(403).send({ error: 'Unauthorized: Only doctors can send messages' });
        }

        // שליחת ההודעה
        await sendMessage(userId, message);

        res.status(200).send({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).send({ error: 'Failed to send message', details: error.message });
    }
};

module.exports = { sendUserMessage };
