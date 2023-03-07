const admin = require('firebase-admin');

const serviceAccount = require('C:\Users\p8148\AndroidStudioProjects\Dating\app\google-services.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://speeddating-69845-default-rtdb.asia-southeast1.firebasedatabase.app/'
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