const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function predictClassification(model, image) {
    try {
        // Decode the image and resize it to the required input shape
        const tensor = tf.node
            .decodeJpeg(image, 3) // Decode JPEG image with 3 color channels (RGB)
            .resizeNearestNeighbor([224, 224]) // Resize to 224x224 pixels
            .expandDims() // Add a batch dimension
            .toFloat(); // Convert to float32

        // Perform the prediction
        const prediction = model.predict(tensor);
        const score = await prediction.data();
        const confidenceScore = score[0] * 100; // Assuming the model returns a single value for binary classification

        // Determine the predicted class based on the confidence score
        const label = confidenceScore > 50 ? 'Cancer' : 'Non-cancer';

        let explanation, suggestion;

        if (label === 'Cancer') {
            explanation = "Segera periksa ke dokter!";
            suggestion = "Segera konsultasi dengan dokter terdekat untuk mengetahui detail terkait tingkat bahaya penyakit.";
        } else {
            explanation = "Penyakit kanker tidak terdeteksi.";
            suggestion = "Tetap jaga kesehatan dan lakukan pemeriksaan rutin.";
        }

        return { confidenceScore, label, explanation, suggestion };
    } catch (error) {
        throw new InputError(`Terjadi kesalahan input: ${error.message}`);
    }
}

module.exports = predictClassification;