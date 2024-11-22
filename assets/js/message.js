// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getDatabase, ref, set, child, get, update, remove } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBAqMqVFchbbedFgxPcVR3MxXYpfdgP128",
    authDomain: "send-me-secret-message.firebaseapp.com",
    projectId: "send-me-secret-message",
    storageBucket: "send-me-secret-message.firebasestorage.app",
    messagingSenderId: "583111542137",
    appId: "1:583111542137:web:1d3c1fdfc0e94152e9dba8",
    measurementId: "G-S5910JFL1V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const realdb = getDatabase(app);
var database = getDatabase();
var dataRef = ref(database);

function getTimeDate() {
    const now = new Date(); // Create a new Date object

    // Get the components of the date and time
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(now.getDate()).padStart(2, '0');

    // Get the hours and convert to AM/PM format
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    // Determine AM or PM
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? String(hours).padStart(2, '0') : '12'; // Handle 0-hour case (midnight)

    const currentDate = `${day}-${month}-${year}`;
    const currentTime = `${hours}:${minutes}:${seconds} ${ampm}`;

    return `${currentTime} ${currentDate}`;
}

const params = new URLSearchParams(window.location.search);

const messageText = document.getElementById("message-text");
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const linkButton = document.getElementById('link-button');
let messageOBJ, name;

linkButton.onclick = () => {
    window.location.href = '../index.html';
}
get(child(dataRef, "people"))
    .then((snapshot) => {
        snapshot.forEach(element => {
            if (element.val().Name == params.get("name")) {

                if (localStorage.getItem('sent') == element.val().Name) {
                    messageInput.style.display = 'none';
                    messageText.textContent = `You have already sent message to ${element.val().Name}`;
                    sendButton.style.display = 'none';
                } else {
                    name = element.val().Name;
                    messageText.textContent = `Send ${element.val().Name} a Secret Message`;
                    messageOBJ = JSON.parse(element.val().message);
                    console.log(messageOBJ);
                }
            }
        })
    })


sendButton.onclick = () => {
    if (messageInput.value.trim() === '') {
        alert("Enter a valid message!");
    } else {
        const newMSG = {
            text: messageInput.value,
            time: getTimeDate(),
        }
        messageOBJ.push(newMSG);
        set(ref(realdb, 'people/' + name.replace(/[.#$[\]]/g, '')), {
            Name: name,
            message: JSON.stringify(messageOBJ),
        }).then(() => {
            localStorage.setItem('sent', name);
        }).catch((error) => {
            alert('Error adding data to the database');
        });
    }
}