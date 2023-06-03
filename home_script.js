// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADTqM1RjdkDjiNWzc-5DiJn1FblKPlUq4",
  authDomain: "birbal-authorization.firebaseapp.com",
  databaseURL: "https://birbal-authorization-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "birbal-authorization",
  storageBucket: "birbal-authorization.appspot.com",
  messagingSenderId: "217702969214",
  appId: "1:217702969214:web:cb33df734c8c22c9520d2f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";

const db = getDatabase();
const auth = getAuth();
const userId = localStorage.getItem('userId');
// console.log(userId);
// const userId = auth.currentUser.uid;
function initializeDB() {
  onValue(ref(db, '/users/' + userId), (snapshot) => {
    const username = (snapshot.val() && snapshot.val().full_name) || 'Anonymous';
    const email = (snapshot.val() && snapshot.val().email) || 'Anonymous';
    const favourite_song = (snapshot.val() && snapshot.val().favourite_song) || 'Anonymous';
    const tell_me = (snapshot.val() && snapshot.val().tell_me) || 'Anonymous';
    const message = (snapshot.val() && snapshot.val().message) || 'Anonymous';
    const receiver_email = (snapshot.val() && snapshot.val().receiver_email) || 'Anonymous';
    const wph_number = (snapshot.val() && snapshot.val().wph_number) || 'Anonymous';
    // const labels_db = (snapshot.val() && snapshot.val().labels) || 'Anonymous';
    const labels_db = (snapshot.val() && snapshot.val().images) || 'Anonymous';


    window.username = username;
    window.email = email;
    window.favourite_song = favourite_song;
    window.tell_me = tell_me;
    window.msg = message;
    window.receiver_email = receiver_email;
    window.wph_number= wph_number;
    window.labels_db=labels_db;
    console.log(Object.keys(window.labels_db));

    
    if (window.first){
      wishMe();
      window.first=false;
    }
    console.log(username);

  }, {
    onlyOnce: false
  });
}

const btn = document.querySelector('#talk');
const content = document.querySelector('.content');
const text = document.querySelector('#text');
const cv = document.querySelector('#cv');
const video = document.getElementById("video");
var flagcv=0;


let voices = [];
window.speechSynthesis.onvoiceschanged = function() {
  voices = window.speechSynthesis.getVoices();
};
function speak(sentence) {
  const text_speak = new SpeechSynthesisUtterance(sentence);

  text_speak.rate = 1;
  text_speak.pitch = 1;
  text_speak.voice = voices[0];
  window.speechSynthesis.speak(text_speak);
}

function wishMe() {
  var day = new Date();
  var hr = day.getHours();

  if (hr >= 0 && hr < 12) {
    speak("Good Morning " + window.username);
  }

  else if (hr == 12) {
    speak("Good noon " + window.username);
  }

  else if (hr > 12 && hr <= 17) {
    speak("Good Afternoon " + window.username);
  }

  else {
    speak("Good Evening " + window.username);
  }
}

window.addEventListener('load', () => {
  initializeDB();
  speak("Activating Beerbal");
  speak("Going online");
  window.first=true;
})

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
const mbrecognition = new SpeechRecognition();

recognition.onresult = (event) => {
  const current = event.resultIndex;
  const transcript = event.results[current][0].transcript;
  content.textContent = transcript;
  speakThis(transcript.toLowerCase());
  // recognition.abort();
  // annyang.start();
}

mbrecognition.onresult = (event) => {
  const current = event.resultIndex;
  const transcript2 = event.results[current][0].transcript;
  text.value += transcript2 + " ";
  content.textContent = "Typing finished!";
  mbrecognition.abort();
  annyang.start();
}

btn.addEventListener('click', () => {
  annyang.abort();
  recognition.start();
  content.textContent = "listening...";
})

function CV(){
  text.style.display="none";
  cv.style.display="flex";
  if (flagcv==0){
  startWebcam();
  flagcv+=1;
  }
}

function MB(){
  cv.style.display="none";
  text.style.display="flex";
}

function speakThis(message) {
  const speech = new SpeechSynthesisUtterance();
  var flag = true;
  speech.text = "I did not understand what you said please try again";
  if (message.includes('hey') || message.includes('hello')) {
    const finalText = "Hello Boss";
    speech.text = finalText;
  }

  else if (message.includes('how are you')) {
    const finalText = "I am fine boss tell me how can i help you";
    speech.text = finalText;
  }

  else if (message.includes('your name')) {
    const finalText = "My name is Beerbal.";
    speech.text = finalText;
  }

  else if (message.includes('my name')) {
    const finalText = "Your name is " + window.username + ", how can i forget my master's name.";
    speech.text = finalText;
  }

  else if ((message.includes('compose email') || message.includes('write email')) && (message.includes('mobile') || message.includes('smartphone'))) {
    // window.open(`https://mail.google.com/mail/u/0/#inbox?compose=new`, "_blank");
    window.open(`https://mail.google.com/mail/mu/mp/808/#co`, "_blank");
    const finalText = "Opening email";
    speech.text = finalText;
  }

  else if (message.includes('compose email') || message.includes('write email')) {
    // window.open(`https://mail.google.com/mail/u/0/#inbox?compose=new`, "_blank");
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&tf=1`, "_blank");
    const finalText = "Opening email";
    speech.text = finalText;
  }
    
  else if (message.includes('send')&&(message.includes('email') || message.includes('mail'))) {
    window.open("https://mail.google.com/mail/?view=cm&fs=1&to=" + window.receiver_email + "&su=SUBJECT&body=" + text.value, "_blank");
    const finalText = "Your mail is ready, just press send button";
    speech.text = finalText;
  }

    else if (message.includes('send') && ((message.includes('message') || message.includes('whatsapp message')))) {
    var wa_num=window.wph_number;
    wa_num=wa_num.replace(/\s+/g,'');
    window.open("https://wa.me/"+wa_num+"?text="+text.value,"_blank");
    const finalText = "Your whatsapp message is ready, just press send button";
    speech.text = finalText;
  }

  else if ((message.includes('event') || message.includes('task')) && message.includes('day after tomorrow')) {
    var objDate = new Date();
    objDate.setDate(objDate.getDate() + 2);
    var tomorrow = 'Ymd'.replace('Y', objDate.getFullYear()).replace('m', (objDate.getMonth() + 1).toString().padStart(2, 0)).replace('d', (objDate.getDate()).toString().padStart(2, 0));
    window.open("https://calendar.google.com/calendar/u/0/r/eventedit?&dates=" + tomorrow + "T060000/" + tomorrow + "T120000&details=Event+set+by+BIRBAL&text=NOTIFY+ME", "_blank");
    const finalText = "Opening Google calendar for setting event";
    speech.text = finalText;
  }

  else if ((message.includes('event') || message.includes('task')) && message.includes('tomorrow')) {
    var objDate = new Date();
    objDate.setDate(objDate.getDate() + 1);
    var tomorrow = 'Ymd'.replace('Y', objDate.getFullYear()).replace('m', (objDate.getMonth() + 1).toString().padStart(2, 0)).replace('d', (objDate.getDate()).toString().padStart(2, 0));
    window.open("https://calendar.google.com/calendar/u/0/r/eventedit?&dates=" + tomorrow + "T060000/" + tomorrow + "T120000&details=Event+set+by+BIRBAL&text=NOTIFY+ME", "_blank");
    const finalText = "Opening Google calendar for setting event";
    speech.text = finalText;
  }

  else if ((message.includes('type') || message.includes('write'))&&message.includes('message')) {
    // document.getElementById('text').focus();
    flag = false;
    annyang.abort();
    text.value="";
    content.textContent = "Typing now...";
    speech.text = "";
    mbrecognition.start();
  }

  else if ((message.includes('message') || message.includes('typing') || message.includes("writing")) && ((message.includes('continue') || message.includes('resume')))) {
    // text.textContent=text.textContent+" ";  
    flag = false;
    annyang.abort();
    content.textContent = "Continue typing...";
    speech.text = "";
    mbrecognition.start();
  }

  else if (message.includes('save')&&message.includes('message')) {
    speech.text = "Saving message";
    update(ref(db, '/users/' + userId), {
      message: text.value
    }).then(() => {
      alert("Message saved successfully!")
    }).catch(function(error) {
      // var error_code=error.code;
      var error_msg = error.message
      alert(error_msg)
    })
    content.textContent = " Message saved ";
    // text.textContent="";
  }

    else if (message.includes('save phone number')||message.includes('save whatsapp number')) {
    speech.text = "Saving phone number";
    update(ref(db, '/users/' + userId), {
      wph_number: text.value
    }).then(() => {
      alert("Phone number saved successfully!")
    }).catch(function(error) {
      // var error_code=error.code;
      var error_msg = error.message
      alert(error_msg)
    })
    content.textContent = " Phone number saved ";
    // text.textContent="";
  }

  else if ((message.includes('email') || message.includes('receiver email') || message.includes("receiver's email")) && message.includes('display')) {
    text.value = window.receiver_email;
    content.textContent = " Receiver's email displayed ";
    speech.text = window.receiver_email;
  }

  else if ((message.includes('phone number') || message.includes('whatsapp number'))&&message.includes('display')) {
    text.value = window.wph_number;
    content.textContent = " Message displayed ";
    speech.text = window.wph_number;
  }

  else if (message.includes('display message')) {
    text.value = window.msg;
    content.textContent = " Message displayed ";
    speech.text = window.msg;
  }

  else if ((message.includes('message') || message.includes('message box') || message.includes('current message'))&&message.includes('read')) {
    content.textContent = " Reading current text present in message box ";
    speech.text = text.value;
  }

  else if ((message.includes('detect') || message.includes('recognise') || message.includes('open'))&&message.includes('face')) {
    CV();
    content.textContent = " Opening camera ";
    speech.text = "detecting faces";
  }

    else if (message.includes('message mode')) {
    MB();
    content.textContent = " message mode ";
    speech.text = "message mode";
  }
    
  else if ((message.includes('text') || message.includes('selected text') || message.includes('this text'))&&message.includes('read')) {
    var selectedText = "";
    if (window.getSelection) {
      selectedText = window.getSelection();
    }
    // document.getSelection
    else if (document.getSelection) {
      selectedText = document.getSelection();
    }
    // document.selection
    else if (document.selection) {
      selectedText =
        document.selection.createRange().text;
    }
    else {
      selectedText = "no text selected"
    }
    speech.text = selectedText

  }

  else if ((message.includes('remove') || message.includes('delete') || message.includes('clear'))&&message.includes('message')) {
    speech.text = "Message deleted";
    content.textContent = " Click here to speak ";
    text.value = "";
  }

  else if ((message.includes('email') || message.includes('receiver email') || message.includes("receiver's email")) && message.includes('save')) {
    speech.text = "Saving receiver's email ID";
    update(ref(db, '/users/' + userId), {
      receiver_email: text.value
    }).then(() => {
      alert("Receiver's Email saved successfully!")
    }).catch(function(error) {
      // var error_code=error.code;
      var error_msg = error.message
      alert(error_msg)
    })
    content.textContent = " Receiver's email saved ";
    // text.textContent="";
  }

  else if (message.includes('open google')) {
    window.open("https://google.com", "_blank");
    const finalText = "Opening Google";
    speech.text = finalText;
  }

  else if (message.includes('open instagram')) {
    window.open("https://instagram.com", "_blank");
    const finalText = "Opening instagram";
    speech.text = finalText;
  }

  else if (message.includes('my mix') || message.includes('my playlist')) {
    window.open(`https://www.youtube.com/watch?v=Mvvsa5HAJiI&list=RDMM&start_radio=1`, "_blank");
    const finalText = "Playing your my mix youtube playlist";
    speech.text = finalText;
  }

  else if (message.includes('my song') || message.includes('favourite song')) {
    window.open(`https://www.youtube.com/search?q=` + window.favourite_song + "&start_radio=1", "_blank");
    const finalText = "This is your favourite song " + window.favourite_song;
    speech.text = finalText;
  }

  else if (message.includes('my secret')) {
    const finalText = "Secret message is " + window.tell_me;
    speech.text = finalText;
  }

  else if (message.includes('youtube')) {
    message = message.replace("youtube", "")
    window.open(`https://www.youtube.com/search?q=${message.replace(" ", "+")}`, "_blank");
    const finalText = "This is what i found on youtube regarding " + message;
    speech.text = finalText;
    // window.dispatchEvent(new KeyboardEvent('keydown', {'keycode': 13}));
  }

  else if (message.includes('wikipedia')) {
    message = message.replace("wikipedia", "")
    window.open(`https://en.wikipedia.org/wiki/${message.replace("wikipedia", "")}`, "_blank");
    const finalText = "This is what i found on wikipedia regarding " + message;
    speech.text = finalText;
  }

  else if (message.includes('time')) {
    const time = new Date().toLocaleString(undefined, { hour: "numeric", minute: "numeric" })
    const finalText = time;
    speech.text = finalText;
  }

  else if (message.includes('date')) {
    const date = new Date().toLocaleString(undefined, { month: "short", day: "numeric" })
    const finalText = date;
    speech.text = finalText;
  }

  else if (message.includes('calculator')) {
    window.open('Calculator:///')
    const finalText = "Opening Calculator";
    speech.text = finalText;
  }

  else if (message.includes('what is') || message.includes('who is') || message.includes('what are')) {
    window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
    const finalText = "This is what i found on internet regarding " + message;
    speech.text = finalText;
  }

  else if (message.includes('close birbal') || message.includes('shut down') || message.includes('shutdown') || message.includes('log out') || message.includes('sign out') || message.includes('logout') || message.includes('signout')) {
    auth.signOut();
    speech.text = "Shutting down BIRBAL"
    window.open("index.html","_self");
  }

  else {
    window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
    const finalText = "I found some information for " + message + " on google";
    speech.text = finalText;
  }

  speech.volume = 1;
  speech.pitch = 1;
  speech.rate = 1;
  speech.voice = voices[0];
  window.speechSynthesis.speak(speech);

  if (flag) {
    recognition.abort();
    annyang.start();
  }
}