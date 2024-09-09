// DOM Elements
const registrationForm = document.getElementById('registrationForm');
const schoolNameInput = document.getElementById('schoolName');
const studentNameInput = document.getElementById('studentName');
const deadlineMessage = document.getElementById('deadlineMessage');
const fineMessage = document.getElementById('fineMessage');
const quizSection = document.getElementById('quizSection');
const questionContainer = document.getElementById('questionContainer');
const answerOptions = document.getElementById('answerOptions');
const submitAnswerBtn = document.getElementById('submitAnswerBtn');
const timerDisplay = document.getElementById('timer');
const winnerModal = document.getElementById('winnerModal');
const winnerMessage = document.getElementById('winnerMessage');
const closeModalBtn = document.getElementById('closeModalBtn');
const winnersList = document.getElementById('winnersList');
const registrationSection = document.getElementById('registrationSection');
const loginSection = document.getElementById('loginSection');
const loginForm = document.getElementById('loginForm');
const loginSchoolName = document.getElementById('loginSchoolName');
const loginStudentName = document.getElementById('loginStudentName');
const quizNavbar = document.getElementById('quizNavbar');
const schoolDisplay = document.getElementById('schoolDisplay');
const studentDisplay = document.getElementById('studentDisplay');
const elapsedTimeDisplay = document.getElementById('elapsedTimeDisplay');
const mainHeading = document.getElementById('mainHeading'); // Main heading reference

// Constants
const registrationDeadline = new Date("2024-09-30");
const fineAmount = 5000;
const totalQuestions = 10;
let questionIndex = 0;
let score = 0;
let timeLeft = 120; // 2 minutes for the quiz
let quizTimer;
let currentSchool = '';
let currentStudent = '';
let results = [];

// Example questions and answers
const questions = [
    { question: "What is 2 + 2?", answer: "4", options: ["3", "4", "5", "6"] },
    { question: "How many permanent teeth does a dog have?", answer: "42", options: ["42", "30", "32", "28"] },
    { question: "What is 5 x 5?", answer: "25", options: ["20", "25", "30", "35"] },
    { question: "What is the largest ocean?", answer: "Pacific", options: ["Atlantic", "Indian", "Pacific", "Arctic"] },
    { question: "What is the square root of 16?", answer: "4", options: ["2", "4", "8", "16"] },
    { question: "Whats longer, a nautical mile or a mile?", answer: "Nautical mile", options: ["Kilometer", "Peaceful mile", "Nautical mile", "mile"] },
    { question: "What is the smallest planet in our solar system?", answer: "Mercury", options: ["Venus", "Mercury", "Jupiter", "Saturn"] },
    { question: "What is the northernmost country in Africa?", answer: "Tunisia", options: ["Nigeria", "South Africa", "Egypt", "Tunisia"] },
    { question: "What is the common name for the larva of a housefly?", answer: "Maggot", options: ["Maggot", "Larvae", "Pupa", "Adult"] },
    { question: "How many brains does an Octopus have?", answer: "9", options: ["2", "4", "8", "9"] },
];

// Check registration deadline and handle fine
function checkRegistrationDeadline() {
    const today = new Date();
    if (today > registrationDeadline) {
        deadlineMessage.textContent = "The registration deadline has passed!";
        fineMessage.textContent = `You need to pay a fine of N${fineAmount} to register.`;
    } else {
        deadlineMessage.textContent = `Registration closes on ${registrationDeadline.toDateString()}.`;
        fineMessage.textContent = '';
    }
}

// Shuffle questions for each quiz session
function shuffleQuestions() {
    questions.sort(() => Math.random() - 0.5);
}

// Start the quiz
function startQuiz() {
    quizSection.classList.remove('hidden');
    quizNavbar.classList.remove('hidden'); // Show the quiz navbar
    mainHeading.classList.add('hidden');   // Hide the main heading
    shuffleQuestions();
    displayQuestion();
    startTimer();
}

// Display the current question and answer options
function displayQuestion() {
    if (questionIndex < totalQuestions) {
        const currentQuestion = questions[questionIndex];
        questionContainer.textContent = currentQuestion.question;

        // Clear previous options
        answerOptions.innerHTML = '';

        // Populate radio buttons
        currentQuestion.options.forEach(option => {
            const label = document.createElement('label');
            label.classList.add('block', 'mb-2');

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'answer';
            radio.value = option;
            radio.classList.add('mr-2');

            const text = document.createTextNode(option);

            label.appendChild(radio);
            label.appendChild(text);
            answerOptions.appendChild(label);
        });
    } else {
        endQuiz();
    }
}

// Submit the answer and proceed to the next question
function submitAnswer() {
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    if (selectedOption) {
        const selectedAnswer = selectedOption.value;
        const correctAnswer = questions[questionIndex].answer;

        if (selectedAnswer === correctAnswer) {
            score++;
        }

        questionIndex++;
        displayQuestion();
    } else {
        alert('Please select an answer!');
    }
}

// Start the quiz timer
function startTimer() {
    timerDisplay.textContent = `Time left: ${timeLeft} seconds`;
    quizTimer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time left: ${timeLeft} seconds`;
        elapsedTimeDisplay.textContent = `Elapsed time: ${120 - timeLeft} seconds`; // Update elapsed time in the navbar
        if (timeLeft <= 0) {
            clearInterval(quizTimer);
            endQuiz();
        }
    }, 1000);
}

// End the quiz and show the result
function endQuiz() {
    clearInterval(quizTimer);

    // Calculate percentage score
    const percentage = Math.round((score / totalQuestions) * 100);
    results.push({ school: currentSchool, student: currentStudent, score: percentage });

    displayResults();
    displayWinner();
}

// Display each student's result
function displayResults() {
    winnersList.innerHTML = '';
    results.forEach(result => {
        const li = document.createElement('li');
        li.textContent = `${result.school}, ${result.student}, ${result.score}%`;
        winnersList.appendChild(li);
    });
}

// Display winner modal
function displayWinner() {
    const highestScore = Math.max(...results.map(result => result.score));
    const winners = results.filter(result => result.score === highestScore);

    if (winners.length > 0) {
        winnerMessage.innerHTML = winners.map(winner => `Congratulations ${winner.student} from ${winner.school} for scoring ${winner.score}%!`).join('<br>');
    }

    winnerModal.classList.remove('hidden');
}

// Close the winner modal, reset the page, and clear login input fields
function closeModal() {
    winnerModal.classList.add('hidden');

    // Clear input fields
    schoolNameInput.value = '';
    studentNameInput.value = '';
    loginSchoolName.value = ''; // Clear login school name input
    loginStudentName.value = ''; // Clear login student name input

    // Reset quiz variables
    questionIndex = 0;
    score = 0;
    timeLeft = 120; // Reset the timer

    // Hide the navbar and quiz section
    quizNavbar.classList.add('hidden');
    quizSection.classList.add('hidden');
    loginSection.classList.add('hidden');
    mainHeading.classList.remove('hidden'); // Show the main heading again

    // Show the registration section
    registrationSection.classList.remove('hidden');
}

// Handle registration form submission
registrationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    checkRegistrationDeadline();
    registrationSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
});

// Handle login form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    currentSchool = loginSchoolName.value;
    currentStudent = loginStudentName.value;

    // Display school and student in navbar
    schoolDisplay.textContent = currentSchool;
    studentDisplay.textContent = currentStudent;

    loginSection.classList.add('hidden');
    startQuiz();
});

// Handle answer submission
submitAnswerBtn.addEventListener('click', submitAnswer);

// Handle close modal button
closeModalBtn.addEventListener('click', closeModal);

// Initialize
checkRegistrationDeadline();
