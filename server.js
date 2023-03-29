const admin = require('firebase-admin');

const serviceAccount = require('./speeddating-69845-firebase-adminsdk-gs27f-29ba9b2300.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://speeddating-69845-default-rtdb.asia-southeast1.firebasedatabase.app/'
});

const express = require('express');
const app = express();

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

app.get('/calculate', (req, res) => {
  const userId = req.query.userId; // Get the user ID from the query parameters
  const userPrefsRef = admin.database().ref(`users/${userId}/preferences`); // Reference to the user preferences in the database

  userPrefsRef.once('value')
    .then((snapshot) => {
      const userPrefs = snapshot.val(); // Retrieve the user preferences from the snapshot
      // Calculate the matching score based on the user preferences
      const matchingScore = calculateMatchingScore(userPrefs);
      res.send({ result: matchingScore }); // Send the matching score as the response
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ error: 'Error retrieving user preferences' });
    });
});

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

function sendNotification(toUserId, title, body) {
  const userTokenRef = admin.database().ref(`users/${toUserId}/token`);

  return userTokenRef.once('value').then((snapshot) => {
    const userToken = snapshot.val();

    if (!userToken) {
      throw new Error('User token not found');
    }

    const message = {
      notification: {
        title: title,
        body: body,
      },
      token: userToken,
    };

    return admin.messaging().send(message);
  });
}


/*
function calculateMatchingScore(userPrefs) {
  // Your calculation code goes here
  // For example, you can calculate the matching score based on the selected age and constellation preferences
  const agePref = userPrefs.agePref;
  const constellationPref = userPrefs.constellationPref;
  let matchingScore = 0;
  if (agePref === 'Younger') {
    matchingScore += 10;
  } else if (agePref === 'Older') {
    matchingScore -= 10;
  }
  if (constellationPref.includes('Leo')) {
    matchingScore += 5;
  }
  if (constellationPref.includes('Virgo')) {
    matchingScore += 5;
  }
  if (constellationPref.includes('Libra')) {
    matchingScore += 5;
  }
  return matchingScore;
}

  const userPrefsRef = admin.database().ref(`users/${userId}/preferences`);
  //Replace userId with the ID of the user whose preferences you want to retrieve.

  userPrefsRef.once('value')
  .then((snapshot) => {
    const userPrefs = snapshot.val();
    // Your calculation code goes here
  })
  .catch((error) => {
    // Handle errors here
  });

  //Use Firebase's once() method to read the data from the database at the specified location.

  res.send({ result: matchingScore });
  //Replace matchingScore with the result of your calculation.
  */