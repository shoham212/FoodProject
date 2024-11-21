const { analyzeImage, isImageFood } = require('../services/imageAnalysisService');

const analyzeImageController = async (req, res) => {
    const { imageUrl } = req.body;

    if (!imageUrl) {
        return res.status(400).send('יש לספק כתובת URL לתמונה');
    }

    try {
        const tags = await analyzeImage(imageUrl);
        const isFood = isImageFood(tags);

        if (isFood) {
            res.json({
                message: 'התמונה מכילה מאכל',
                tags
            });
        } else {
            res.status(400).json({
                message: 'התמונה אינה מכילה מאכל',
                tags
            });
        }
    } catch (error) {
        console.error('Error analyzing image:', error.message);
        res.status(500).send('שגיאה בניתוח התמונה');
    }
};

module.exports = { analyzeImageController };
