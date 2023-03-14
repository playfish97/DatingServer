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


app.get('/testServerConnect', function routeHandler(req, res) {
  res.send('ok')
})

app.listen(3000, () => {
  console.log('Server listening on port 3000');
  console.log('Hi user, nice to meet you.')
});

const message = {
  notification: {
    title: 'Title of the notification',
    body: 'Body of the notification'
  },
  token: 'ceyNntuCSYCc4vPk6wuTHw:APA91bHqKij7f1PTonswcl19lj3hl-f1uuxnybHdWCr3wE46IcHR2Wk2Kk4-zeA-WGecHmyBzYJkgLBjz6rHhkyCj2XRuOvzmLHPT2H-MxpsEvdOcmUftSEsEDuN7itKcAFXrykoSayH'
};

admin.messaging().send(message)
  .then((response) => {
    console.log('Successfully sent message:', response);
  })
  .catch((error) => {
    console.log('Error sending message:', error);
  });

  /*
const socket = io();
  io.on('connection', (socket) => {
    console.log('a user connected');
    
    socket.emit('message', 'Hi, server is working');
    
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
  */