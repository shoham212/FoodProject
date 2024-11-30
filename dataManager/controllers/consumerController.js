const { runConsumer } = require('../services/consumerService');

const startConsumer = async (req, res) => {
    try {
        const userId = req.user.id; // קבלת ה-userId מתוך האסימון (JWT)

        // הפעלת הצרכן בהקשר של המשתמש
        await runConsumer(userId);
        res.status(200).send({ message: 'Consumer started successfully' });
    } catch (error) {
        console.error('Error starting consumer:', error);
        res.status(500).send({ error: 'Failed to start consumer', details: error.message });
    }
};

module.exports = { startConsumer };
