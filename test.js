const admin = require('firebase-admin');

const serviceAccount = require('./speeddating-69845-firebase-adminsdk-gs27f-29ba9b2300.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://speeddating-69845-default-rtdb.asia-southeast1.firebasedatabase.app/'
});

const express = require('express');
const app = express();

app.get('/calculate', (req, res) => {
    const data = req.query.data; // Get the value of the 'data' query parameter
    const result = data * 2; // Perform a calculation using the data

    res.send({ result }); // Send the result back to the client
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
  console.log('Hi user, nice to meet you.')
});

const message = {
  notification: {
    title: 'Title of the notification',
    body: 'Body of the notification'
  },
  token: '<device-token>'
};

admin.messaging().send(message)
  .then((response) => {
    console.log('Successfully sent message:', response);
  })
  .catch((error) => {
    console.log('Error sending message:', error);
  });
