const { Firestore } = require('@google-cloud/firestore');
const firestore = new Firestore();

async function storeData(data) {
  const docRef = firestore.collection('predictions').doc(data.id);
  await docRef.set({
    id: data.id,
    result: data.result,
    suggestion: data.suggestion,
    createdAt: data.createdAt
  });
}

module.exports = storeData;
