if (!localStorage.getItem('validAppCode')) {
    localStorage.setItem('validAppCode', generateAppCode());
}
if (!localStorage.getItem('validCheckinCode')) {
    localStorage.setItem('validCheckinCode', generateCheckinCode());
}

const availableSeats = generateAvailableSeats();
const validAppCode = localStorage.getItem('validAppCode');
const validCheckinCode = localStorage.getItem('validCheckinCode');
let selectedSeatsArray = [];

function generateAvailableSeats() {
    return Math.floor(Math.random() * (50 - 1 + 1)) + 1;
}

function generateAppCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateCheckinCode() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let randomLetters = letters.charAt(Math.floor(Math.random() * letters.length)) + 
                        letters.charAt(Math.floor(Math.random() * letters.length));
    let randomNumbers = Math.floor(1000 + Math.random() * 9000).toString();
    return randomLetters + randomNumbers;
}


function submitBooking() {
    const nameRegex = /^[A-Z]{1,25}$/;
    const passportRegex = /^[A-Z]{1,2}[0-9]{7,8}$/;
    const flightNumberRegex = /^[A-Z]{2}[0-9]{6,7}$/;

    
    const today = new Date();

    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const passport = document.getElementById('passport').value.trim();
    const flightNumber = document.getElementById('flightNumber').value.trim();

    const birthDateValue = document.getElementById('birthDate').value;
    const birthDate = new Date(birthDateValue);
    let age = today.getFullYear() - birthDate.getFullYear();

    const requestedSeats = parseInt(document.getElementById('seatsCount').value);

    if (!birthDateValue || isNaN(requestedSeats)) {
        alert("ΣΥΜΠΛΗΡΩΣΤΕ ΟΛΑ ΤΑ ΠΑΙΔΙΑ.");
        return;
    }

    if (!nameRegex.test(lastName) || !nameRegex.test(firstName)) {
        alert("ERROR: ΕΙΣΑΓΕΤΑΙ ΜΟΝΟ ΚΕΦΑΛΕΟΥΣ ΛΑΤΙΝΙΚΟΥΣ ΧΑΡΑΚΤΗΡΕΣ (έως 25 χαρακτήρες)");
        return;
    }

    if (!passportRegex.test(passport)) {
        alert("ERROR: ΜΗ ΕΓΚΥΡΟΣ ΑΡΙΘΜΟΣ ΔΙΑΒΑΤΗΡΙΟΥ (π.χ. C12345678 ή K1234567).");
        return;
    }

    if (!flightNumberRegex.test(flightNumber)) {
        alert("ΜΗ ΕΓΚΥΡΟΣ ΑΡΙΘΜΟΣ ΠΤΗΣΗΣ (π.χ. AA1234567).");
        return;
    }
    
    if (age < 18) {
        alert("ΑΠΟΤΥΧΙΑ ΚΡΑΤΗΣΗΣ: Ο ΥΠΟΨΗΦΙΟΣ ΠΕΛΑΤΗΣ ΕΙΝΑΙ ΚΑΤΩ ΤΩΝ 18.");
        return;
    }

    if (requestedSeats > availableSeats) {
        alert("Μη διαθέσιμος αριθμός θέσεων από KRATISEIS.");
        return;
    }

    const pricePerSeat = Math.floor(Math.random() * (400 - 70 + 1)) + 70;
    localStorage.setItem('totalRequestedSeats', requestedSeats);
    localStorage.setItem('calculatedTotalCost', pricePerSeat * requestedSeats);
    

    alert("Θετικό Μήνυμα Ελέγχου Θέσεων! Παρακαλώ εισάγετε τον Ειδικό Κωδικό visa.");
    document.getElementById('visaSection').style.display = 'block';
}

function finalVisaCheck() {
    const visa = document.getElementById('visaCode').value;
    if (visa.length === 9 && !isNaN(visa)) {
        alert("Θετικό Μήνυμα Ελέγχου Ασφαλείας από NSA! Κωδικός Αίτησης: " + validAppCode);
        window.location.href = "payment.html";
        
        return;
    } else {
        alert("Αρνητικό Μήνυμα Ελέγχου Ασφαλείας από NSA. Τερματισμός.");
        window.location.replace("../index.html");

        return;
    }
}

function checkApplicationCode() {
    const totalCost = localStorage.getItem('calculatedTotalCost');
    if(document.getElementById('appCode').value === validAppCode){
        document.getElementById('paymentSection').style.display = 'block';
        document.getElementById('displayCost').innerText = totalCost + '€';

        return;
    }else{
        alert("Λανθασμένος Κωδικός Αίτησης.");
        window.location.replace("../index.html");
    }
}

function executePayment() {
    const cardInput = document.getElementById('cardNumber').value.trim();
    const cardRegex = /^[0-9]{16}$/;
    if (!cardRegex.test(cardInput)) {
        alert("Σφάλμα: Ο αριθμός της πιστωτικής κάρτας πρέπει να αποτελείται από ακριβώς 16 ψηφία.");
        return;
    }else{
    alert("Μήνυμα Επιβεβαίωσης Ελέγχου Πιστωτικής Κάρτας (eCARDS).\nΜήνυμα Επιβεβαίωσης Πληρωμής.\nΟ κωδικός Check-in σας είναι: " + validCheckinCode);
    window.location.href = "checkin.html";
    }
}

function checkCheckinCode() {
    if(document.getElementById('checkinCode').value === validCheckinCode){
        alert("Επιτυχής Επιβεβαίωση Κωδικού Check-in.");
        document.getElementById('seatSection').style.display = 'block';
        createAirplaneMap();
    }else{
        alert("Μήνυμα Αποτυχημένης Επιβεβαίωσης Κωδικού Check-in.");
        window.location.replace("../index.html");
    }
}

function finalizeCheckin() {
    const required = parseInt(localStorage.getItem('totalRequestedSeats')) || 1;
    if (selectedSeatsArray.length !== required) {
        alert("Σφάλμα: Πρέπει να επιλέξετε ακριβώς " + required + " θέσεις.");
        return;
    }
    alert("Το ηλεκτρονικό εισιτήριο εκδόθηκε. Η κράτηση είναι ΕΠΙΒΕΒΑΙΩΜΕΝΗ.");
    localStorage.clear();
    window.location.replace("../index.html");
}


function createAirplaneMap() {
    const map = document.getElementById('airplaneMap');
    const required = parseInt(localStorage.getItem('totalRequestedSeats')) || 1;
    document.getElementById('seatInfo').innerText = "Επιλέξτε ακριβώς " + required + " θέσεις.";
    map.innerHTML = "";
    selectedSeatsArray = [];

    for (let i = 1; i <= 10; i++) {
        ['A', 'B', 'C', 'D'].forEach(l => {
            const btn = document.createElement('button');
            btn.className = "seat";
            btn.innerText = i + l;
            if (Math.random() < 0.2) { btn.disabled = true; btn.innerText = "X"; }
            else { btn.onclick = () => toggleSeat(btn, i + l); }
            map.appendChild(btn);
        });
    }
}

function toggleSeat(btn, seatId) {
    const required = parseInt(localStorage.getItem('totalRequestedSeats')) || 1;
    if (btn.classList.contains('selected')) {
        btn.classList.remove('selected');
        selectedSeatsArray = selectedSeatsArray.filter(s => s !== seatId);
    } else if (selectedSeatsArray.length < required) {
        btn.classList.add('selected');
        selectedSeatsArray.push(seatId);
    }
}