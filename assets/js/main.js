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

const nameInput = document.getElementById("name-input");
const generateButton = document.getElementById("generate-button");

generateButton.onclick = () => {
    set(ref(realdb, 'people/' + nameInput.value.replace(/[.#$[\]]/g, '')), {
        Name: nameInput.value,
        message: JSON.stringify([])
    }).then(() => {
        localStorage.setItem('reference', nameInput.value.replace(/[.#$[\]]/g, ''));
        localStorage.setItem('name', nameInput.value.replace(/[.#$[\]]/g, ''));
        location.reload();
    }).catch((error) => {
        alert('Error adding data to the database');
    });
}

const nameDiv = document.getElementById('name-div');
const messageDiv = document.getElementById('message-div');
const linkText = document.getElementById('link-text');
const linkClipboard = document.getElementById("link-clipboard");

if (localStorage.getItem('reference') != null) {
    nameDiv.style.display = 'none';
    messageDiv.style.display = 'flex';

    const baseURL = 'http://127.0.0.1:5500/pages/message.html';
    const params = new URLSearchParams({
        name: localStorage.getItem("name")
    });

    const fullURL = `${baseURL}?${params.toString()}`;
    linkText.textContent = fullURL;

    linkClipboard.onclick = () => {
        navigator.clipboard.writeText(fullURL)
            .then(() => {
                alert("URL copied to clipboard!");
            })
            .catch(err => {
                console.error("Failed to copy URL: ", err);
            });
    }

    // Whatsapp sharing
    document.getElementById("shareWhatsapp").addEventListener("click", () => {
        const whatsappURL = `https://api.whatsapp.com/send?text=Send%20me%20secret%20message:%20${encodeURIComponent(fullURL)}`;
        window.open(whatsappURL, "_blank");
    });

    // Twitter sharing
    document.getElementById("shareTwitter").addEventListener("click", () => {
        const twitterText = `Send me a secret message ${fullURL}`;
        const twitterURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}`;
        window.open(twitterURL, "_blank");
    });

    // Facebook sharing
    document.getElementById("shareFacebook").addEventListener("click", () => {
        const facebookURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullURL)}`;
        window.open(facebookURL, "_blank");
    });

    const noMessageText = document.getElementById('no-message-text');
    const messageBox = document.getElementById('message-box');

    get(child(dataRef, "people"))
        .then((snapshot) => {
            snapshot.forEach(element => {
                if (element.val().Name == localStorage.getItem('name')) {
                    if (element.val().message != '[]') {
                        noMessageText.style.display = 'none';
                        const messageOBJ = JSON.parse(element.val().message);
                        console.log(messageOBJ);
                        messageOBJ.forEach(element => {
                            const indiMessage = document.createElement('div');
                            indiMessage.setAttribute("class", "message-box");
                            indiMessage.innerHTML = `<p class="text-lg">${element.text}</p>
                    <p class="text-blue-500 w-full text-right">${element.time}</p>`;
                            messageBox.appendChild(indiMessage);

                        });
                    }
                }
            })
        })
}