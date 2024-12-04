const predictClassification = require('../services/inferenceService');
const storeData = require('../services/storeData');
const getHistories = require('../services/getHistories');
const crypto = require('crypto');

const postPredictHandler = async (request, h) => {
  try {
    // Extract the image from the request payload
    const { image } = request.payload;

    // Generate a unique ID for the prediction
    const id = crypto.randomUUID();

    // Get the model from the server context
    const model = request.server.app.model;

    // Perform the prediction
    const { confidenceScore, label, explanation, suggestion } = await predictClassification(model, image);

    // Generate the current timestamp
    const createdAt = new Date().toISOString();

    // Construct the data object
    const data = {
      id: id,
      result: label,
      explanation: explanation,
      suggestion: suggestion,
      confidenceScore: confidenceScore,
      createdAt: createdAt
    };

    // Store the data in Firestore
    await storeData(data);

    // Construct the response
    const response = h.response({
      status: 'success',
      message: 'Model is predicted successfully',
      data: {
        id: data.id,
        result: data.result,
        suggestion: data.suggestion,
        createdAt: data.createdAt
      }
    });

    // Set the response code
    response.code(201);

    // Return the response
    return response;
  } catch (error) {
    // Handle errors and return a proper response
    const response = h.response({
      status: 'fail',
      message: 'Terjadi kesalahan dalam melakukan prediksi'
    });
    response.code(400);
    return response;
  }
};

const getHistoriesHandler = async (request, h) => {
  try {
    const histories = await getHistories();
    const response = h.response({
      status: 'success',
      data: histories
    });
    response.code(200);
    return response;
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: 'Terjadi kesalahan dalam mengambil data riwayat prediksi'
    });
    response.code(500);
    return response;
  }
};

module.exports = {
  postPredictHandler,
  getHistoriesHandler
};