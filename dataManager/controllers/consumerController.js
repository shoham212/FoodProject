const { runConsumer } = require('../services/consumerService');


const startConsumer = async (req, res) => {
    try {
        await runConsumer();
        res.status(200).send({ message: 'Consumer started successfully' });
    } catch (error) {
        console.error('Error starting consumer:', error);
        res.status(500).send({ error: 'Failed to start consumer', details: error.message });
    }
};

module.exports = { startConsumer };
