const { Firestore } = require('@google-cloud/firestore');
const firestore = new Firestore();

async function getHistories() {
  const snapshot = await firestore.collection('predictions').get();
  const histories = [];
  snapshot.forEach(doc => {
    histories.push({
      id: doc.id,
      history: doc.data()
    });
  });
  return histories;
}

module.exports = getHistories;