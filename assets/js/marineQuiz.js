// Assign HTML element to global variables
var headerQuizIntroEl = document.querySelector("#headerQuizIntro");
var sectionQaEl = document.querySelector("#sectionQA");
var sectionResultsEl = document.querySelector("#sectionResults");
var sectionResultsHistoryEl = document.querySelector("#sectionResultsHistory");
var answerResultEl = document.querySelector("#answerResult");
var questionEl = document.querySelector("#question");
var a1Btn = document.querySelector("#a1");
var a2Btn = document.querySelector("#a2");
var a3Btn = document.querySelector("#a3");
var a4Btn = document.querySelector("#a4");
var startQuizBtn = document.querySelector("#startQuizBtn");
var timeCountEl = document.querySelector("#count");
var initialsEl = document.querySelector("#initials");
var finalScoreEl = document.querySelector("#finalScore");
var submitBtn = document.querySelector("#submit");
var goBackBtn = document.querySelector("#goBack");
var clearBtn = document.querySelector("#clear");
var viewHighScoresBtn = document.querySelector("#highScores");

// Initialize the Global Q&A array of question/answer objects
var selectedAnswer = "";
var indexQ = 0;
var currentQ = "";
var initialCount = 75;
var intervalId;
var finalScore;
var historyIndex = 1;
var currentState;
var counterState;

// Initialize the Q&A array of qA objects
qA = [
    {
        question: "What species is a manatee’s closest living relative?",
        a1: "Dog",
        a2: "Elephant",
        a3: "Walrus",
        a4: "Right Whale",
        correctA: "a2"
    },
    {
        question: "How many extant species of horseshoe crabs are there currently?",
        a1: "2",
        a2: "8",
        a3: "4",
        a4: "1",
        correctA: "a3"
    },
    {
        question: "What is the baseline salinity of the Atlantic Ocean?",
        a1: "35%",
        a2: "35ppt",
        a3: "80ppt",
        a4: "10%",
        correctA: "a2"
    },
    {
        question: "How many tentacles does an octopus have?",
        a1: "10",
        a2: "8",
        a3: "None",
        a4: "16",
        correctA: "a3"
    },
    {
        question: "What is a narwhal’s “tusk” made of?",
        a1: "horn",
        a2: "antler",
        a3: "tusk",
        a4: "tooth",
        correctA: "a4"
    }
]

renderquizIntro();

// display the quiz intro screen, initialize the global variables / wait for
//start quiz button click
function renderquizIntro() {
    currentState = "quizIntro";
    selectedAnswer = "";
    indexQ = 0;
    currentQ = "";
    initialCount = 75;
    headerQuizIntroEl.classList.remove("hidden");
    timeCountEl.textContent = initialCount;
}

// listen for start quiz click, hide the intro screen, display the Q&A screen and initialize qA1 elements
startQuizBtn.addEventListener("click", function (event) {
    event.preventDefault;
    startQuiz();
});

// listen for the view high scores button click
viewHighScoresBtn.addEventListener("click", function () {
    if (currentState === "quizQA") {
        alert("Viewing high scores is not permitted while taking the quiz, so wait until quiz is done.")
    } else {
        sectionResultsHistoryEl.classList.remove("hidden"); // Show the high scores history screen
        sectionResultsEl.classList.add("hidden"); // Hide the quiz results screen
        sectionQaEl.classList.add("hidden"); // Hide the quiz Q&A screen
        headerQuizIntroEl.classList.add("hidden"); // Hide the quiz intro screen
    }
})
// initiate the quiz
function startQuiz() {
    currentState = "quizQA";
    headerQuizIntroEl.classList.add("hidden");
    sectionQaEl.classList.remove("hidden");
    // start countdown timer at 75 seconds
    countdown(initialCount);
    getQuestions(indexQ);
    historyIndex = localStorage.getItem("historyIndex") || 1; // persist the historyIndex
}
// set the countdown timer
function countdown(count) {   // ********
    counterState = "running";
    var count = initialCount;
    intervalId = setInterval(function () {
        timeCountEl.textContent = (count);
        count--;
        if (count < 0) {
            clearInterval(intervalId); // Stop the interval when the countdown is completed
            counterState = "zero"
        }
    }, 1000); // 1000 milliseconds = 1 second
    timeCountEl.textContent = initialCount;
}

function getQuestions(indexQ) {
    answerResultEl.textContent = "";
    var currentQ = qA[indexQ];
    questionEl.textContent = currentQ.question;
    a1Btn.textContent = `1. ${currentQ.a1}`;
    a2Btn.textContent = `2. ${currentQ.a2}`;
    a3Btn.textContent = `3. ${currentQ.a3}`;
    a4Btn.textContent = `4. ${currentQ.a4}`;
}

// listen for a click on the selected answer button call checkAnswer function 
// passing selectedAnswer string
a1Btn.addEventListener("click", function (event) {
    event.preventDefault;
    selectedAnswer = "a1";
    checkAnswer(selectedAnswer, qA[indexQ]);
});

a2Btn.addEventListener("click", function (event) {
    event.preventDefault;
    selectedAnswer = "a2";
    checkAnswer(selectedAnswer, qA[indexQ]);
});

a3Btn.addEventListener("click", function (event) {
    event.preventDefault;
    selectedAnswer = "a3";
    checkAnswer(selectedAnswer, qA[indexQ]);
});

a4Btn.addEventListener("click", function (event) {
    event.preventDefault;
    selectedAnswer = "a4";
    checkAnswer(selectedAnswer, qA[indexQ]);
});

// check the current answer against the correct answer and increment indexQ
// if last question - progress to results screen
function checkAnswer(selectedAnswer, currentQ) {
    if (selectedAnswer === currentQ.correctA) {
        answerResultEl.textContent = "Correct!";
    } else {
        answerResultEl.textContent = "Wrong!";
        // 10 seconds penalty due to wrong answer
        initialCount = parseInt(timeCountEl.textContent) - 10;
        clearInterval(intervalId); // clear the current interval *********
        countdown();; // call countdown to update with 10 sec penalty
    }

    indexQ++;

    // Check if we reached the end of questions
    if (indexQ < qA.length && parseInt(timeCountEl.textContent) > 0) {
        // .5sec delay then get next question
        setTimeout(function () {
            getQuestions(indexQ);
        }, 500);
    } else {
        // .5 sec delay then display Results screen
        setTimeout(function () {
            currentState = "quizResult";
            sectionQaEl.classList.add("hidden");
            sectionResultsEl.classList.remove("hidden");
            // freeze the countdown timer and log the count down time count to the score
            initialsEl.value = "";
            //clearInterval(intervalId);
            counterState = "frozen";
            finalScore = finalScoreEl.textContent = (timeCountEl.textContent);
        }, 500);
    }
}

submitBtn.addEventListener("click", function (event) {
    event.defaultPrevented;
    var inputValue = initialsEl.value.trim();
    if (inputValue === "") { //verify user entered intials
        alert("Please enter your initials before clicking submit")
    }
    else {
        getResultsHistory(inputValue);
    }
});

function getResultsHistory(initials) {
    currentState = "quizHistory";
    sectionResultsEl.classList.add("hidden");
    sectionResultsHistoryEl.classList.remove("hidden");
    var resultsHistoryList = document.getElementById("results-history-ul");
    var newListItem = document.createElement("li");
    newListItem.textContent = `${historyIndex}.  ${initials} - ${finalScore}`;
    resultsHistoryList.appendChild(newListItem);
    historyIndex++;
    localStorage.setItem("historyIndex", historyIndex); // Save the updated historyIndex in localStorage
    // Save the quiz results history in local storage
    var quizResults = JSON.parse(localStorage.getItem("quizResults")) || [];
    quizResults.push({ initials: initials, score: finalScore });
    localStorage.setItem("quizResults", JSON.stringify(quizResults));
}
// retrieve the quiz results history when the page loads:
function displayResultsHistory() {
    var resultsHistoryList = document.getElementById("results-history-ul");
    resultsHistoryList.innerHTML = ""; // Clear the existing list

    var quizResults = JSON.parse(localStorage.getItem("quizResults")) || [];
    quizResults.forEach(function (result, index) {
        var newListItem = document.createElement("li");
        newListItem.textContent = `${index + 1}.  ${result.initials} - ${result.score}`;
        resultsHistoryList.appendChild(newListItem);
    });
}
// Call the function to display quiz results history when the page loads
displayResultsHistory();

goBackBtn.addEventListener("click", function (event) {
    event.preventDefault;
    sectionResultsHistoryEl.classList.add("hidden");
    renderquizIntro();
})

clearBtn.addEventListener("click", function (event) {
    event.preventDefault;
    sectionResultsHistoryEl.classList.remove("hidden");
    localStorage.clear();
    historyIndex = 1;
    var ulElement = document.querySelector("#results-history-ul");
    while (ulElement.firstChild) {
        ulElement.removeChild(ulElement.firstChild);
    }
})
