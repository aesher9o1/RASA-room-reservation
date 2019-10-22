import * as firebase from 'firebase/app'
import 'firebase/auth';
import 'firebase/database'

const firebaseConfig = {
    apiKey: "AIzaSyC_giIAvBlRorTW5uRyj6gxuw2U6p0Qr5A",
    authDomain: "placement-portalmuj.firebaseapp.com",
    databaseURL: "https://placement-portalmuj.firebaseio.com",
    projectId: "placement-portalmuj",
    storageBucket: "placement-portalmuj.appspot.com",
    messagingSenderId: "166993932389",
    appId: "1:166993932389:web:71c6e303d4ee963195568c"
};

firebase.initializeApp(firebaseConfig)
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)

export default firebase;