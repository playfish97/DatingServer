const admin = require('firebase-admin');

const serviceAccount = require('./speeddating-69845-firebase-adminsdk-gs27f-29ba9b2300.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://speeddating-69845-default-rtdb.asia-southeast1.firebasedatabase.app/'
});

const express = require('express');
const app = express();
const database = admin.database();

app.post('/log', express.json(), (req, res) => {
  const message = req.body.message;
  console.log(`Android app log: ${message}`);
  res.status(200).send({ status: 'ok' });
});

app.get('/testServerConnect', function routeHandler(req, res) {
  res.send('ok')
})

app.listen(3000, () => {
  console.log('Server listening on port 3000');
  console.log('Hi user, nice to meet you.')
});

// Realtime Database trigger for new messages
database.ref('chatrooms').on('child_added', (snapshot) => {
  snapshot.ref.child('messages').on('child_added', async (messageSnapshot) => {
    const chatroomId = snapshot.key;
    const message = messageSnapshot.val();
    const senderId = message.sender;
    const recipientId = getRecipientId(chatroomId, senderId);

    if (recipientId) {
      const recipientToken = await getRecipientToken(recipientId);

      if (recipientToken) {
        sendNotification(recipientToken, message.message);
      }
    }
  });
});

function getRecipientId(chatroomId, senderId) {
  const userIds = chatroomId.split('_');
  return userIds.find(id => id !== senderId);
}

async function getRecipientToken(recipientId) {
  // Retrieve the FCM token of the recipient user
  const tokenSnapshot = await database.ref(`users/${recipientId}/fcmToken`).once('value');
  return tokenSnapshot.val();
}

async function sendNotification(recipientToken, messageText) {
  const message = {
    notification: {
      title: 'New Message',
      body: messageText
    },
    token: recipientToken
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
  } catch (error) {
    console.log('Error sending message:', error);
  }
}

app.get('/random', (req, res) => {
  const gender = req.query.gender; // Get the gender from the query parameters

  // Function to get a random user from the database
  getRandomUser(gender)
    .then((randomUser) => {
      res.send({ user: randomUser });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ error: 'Error getting a random user' });
    });
});

function getRandomUser(gender) {
  return new Promise((resolve, reject) => {
    // Get a reference to the users in the database
    const usersRef = admin.database().ref('users');

    // Retrieve all users from the database
    usersRef.once('value')
      .then((snapshot) => {
        const users = snapshot.val();
        const filteredUsers = [];

        // Filter users based on the chosen gender
        for (const userId in users) {
          if (users[userId].gender === gender || gender === 'random') {
          filteredUsers.push(users[userId]);
          }
          }
           // Select a random user from the filtered users
    if (filteredUsers.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredUsers.length);
      const randomUser = filteredUsers[randomIndex];
      resolve(randomUser);
    } else {
      reject(new Error('No users found for the given gender'));
    }
  })
  .catch((error) => {
    reject(error);
  });
});
}