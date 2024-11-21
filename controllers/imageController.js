const { analyzeImage } = require('../services/imageAnalysisService');

const analyzeImageController = async (req, res) => {
    const { imageUrl } = req.body;

    if (!imageUrl) {
        return res.status(400).send('יש לספק כתובת URL לתמונה');
    }

    try {
        const tags = await analyzeImage(imageUrl);
        res.json(tags);
    } catch (error) {
        console.error('Error analyzing image:', error);
        res.status(500).send('שגיאה בניתוח התמונה');
    }
};

module.exports = { analyzeImageController };
