import firebase from "firebase";

const  config = {
    apiKey: "AIzaSyDUw_5o7m_2HJfF7V5_gaJhvAXAhnrc6uc",
    authDomain: "shipmodule.firebaseapp.com",
    databaseURL: "https://shipmodule.firebaseio.com",
    projectId: "shipmodule",
    storageBucket: "shipmodule.appspot.com",
    messagingSenderId: "802645309579"
  };

  firebase.initializeApp(config)

export const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account'
})
export const auth = firebase.auth();
export default firebase;