const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");
// const http = require("http");

const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://revolve-ai-leak-detector-default-rtdb.firebaseio.com",
});

exports.onChangeLeakType = functions.database
    .ref("devices/{deviceId}/flags/leak_type")
    .onUpdate((change, context) => {
      const deviceId = context.params.deviceId;
      const type = change.after.val();
      console.log(`Device Id ${deviceId} with value ${type}`);
      sendLeakType(type, deviceId);
    });

function sendLeakType(type, deviceId) {
  fetch("http://waterx-new.revolveai.com/api/device/"+deviceId+"/leaks", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({"leak_type": type}),
  })
      .then((response) => response.json())
      .then((response) => console.log(JSON.stringify(response)));
}


