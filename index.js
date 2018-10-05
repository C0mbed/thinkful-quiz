function renderStart() {
    // render the start page
    console.log('`Start page` ran');
    generateStart();
  }

function generateStart() {
    let viewStart = '<div class="js-start_box row justify-content-center">';
    viewStart += '<h2>Lets take a quiz!</h2>';
    viewStart += '<p>You will be asked 10 multiple choice questions, you can view previous questions, but you cannot change the answer once it is submitted.</p>';
    viewStart += '<p>The topic is Capital Cities!  How well do you know Capital Cities around the world?';
    viewStart += '<div class="col-md-4 center-block">';
    viewStart += '<button type="button" class="start_quiz btn btn btn-outline-secondary">Start Quiz</button>';
    viewStart += '</div>';
    viewStart += '</div>';

    const startView = document.getElementById('view');
    startView.innerHTML += viewStart;
}

//handles the loading of the quiz on `click event` once the user has selected begin
function handleQuizStartClick() {
    $( ".start_quiz" ).click(function() {
        $('.js-start_box').addClass('hidden');
        renderView();
      });
}

function generateQuiz(questions, currentQuestionNumber) {
    generateQuestionNumber(currentQuestionNumber + 1);
    // render the quiz
    $('#view').empty();
    console.log('`quiz` ran');
    //console.log(questions);
    let count = 0;
    if (currentQuestionNumber > count) {
        count = currentQuestionNumber;
    };

    let currentQuestion = questions[count];
    let viewQuiz = '<div class="answer_box row justify-content-center">';
    viewQuiz += '<h2>'+currentQuestion.question_text+'</h2>';
    viewQuiz += '<button type="button" class="answer_button btn btn-primary btn-lg btn-block col-sm-9">'+currentQuestion.answer+'</button>';
    viewQuiz += '<button type="button" class="answer_button btn btn-primary btn-lg btn-block col-sm-9">'+currentQuestion.decoy_1+'</button>';
    viewQuiz += '<button type="button" class="answer_button btn btn-primary btn-lg btn-block col-sm-9">'+currentQuestion.decoy_2+'</button>';
    viewQuiz += '<button type="button" class="answer_button btn btn-primary btn-lg btn-block col-sm-9">'+currentQuestion.decoy_3+'</button>';
    viewQuiz += '</div>';
    viewQuiz += '<div class="controls row justify-content-center">';
    viewQuiz += '<button type="button" class="control_button btn btn btn-outline-secondary col-sm-3">Previous</button>';
    viewQuiz += '<button disabled="true" type="button" id="next_button" class="control_button btn btn btn-outline-secondary col-sm-3">Next</button>';
    viewQuiz += '</div>';
    viewQuiz += '<div class="answer_text row justify-content-center">';
    viewQuiz += '<p class="result"></p>';
    viewQuiz += '</div>';

    const viewContainer = document.getElementById('view');
    viewContainer.innerHTML += viewQuiz;
    //console.log("Current question in quiz is " + currentQuestion.answer);
    handleAnswerSelection(currentQuestion, currentQuestionNumber);
}

//renders the summary
function renderView() {
    const questionArray = generateQuestions();
    console.log('`Generating` quiz');
    generateQuiz(questionArray, 0);
}

function handleAnswerSelection(currentQuestion, currentQuestionNumber) {
    //handle what happens when someone clicks an answer during the quiz.
    $('.answer_button').click(function(event) {
        event.stopPropagation();
        const targetText = event.target;
        const userSelectedAnswer = targetText.innerHTML;
        //console.log("The answer selected is " + userSelectedAnswer);
        validateAnswer(userSelectedAnswer, currentQuestion);
        enableNextButton(userSelectedAnswer, currentQuestionNumber);
    });
}

//this function checks to see whether the answer chosen by the user is correct/incorrect and updates the view accordingly.
function validateAnswer(userSelectedAnswer, currentQuestion) {
    const correctAnswer = currentQuestion.answer;
    //console.log("The user selected answer is " + userSelectedAnswer);
    //console.log("The correct answer is " + correctAnswer);
    if (userSelectedAnswer == correctAnswer) {
        handleCorrectAnswer(userSelectedAnswer);
        //Since the correct answer was selected we increment the users score
        incrementUserScore();
    } else {
        handleIncorrectAnswer(userSelectedAnswer, correctAnswer, score);
    }
}

function enableNextButton(userSelectedAnswer, currentQuestionNumber) {
    //console.log('enable next button triggered')
    if (userSelectedAnswer) {
        $('#next_button').removeAttr("disabled");
        handleNextQuestion(currentQuestionNumber);
    }
}

function handleNextQuestion(currentQuestionNumber) {
    //handles what happens when the user has clicked the enabled next button.
    $('#next_button').click(function() {
        console.log('next button clicked');
        const questionArray = generateQuestions();
        let count = currentQuestionNumber;
        count += 1;
        //console.log('The current count is ' + count);
        generateQuiz(questionArray, count);
        //This increments the current question and passes the value to `generateQuestionNumber()`
        let questionNumber = count + 1;
        generateQuestionNumber(questionNumber);
    })
}

//this disables the questions after the user has selected an answer. 
function disableAnswers(userSelectedAnswer) {
    if (userSelectedAnswer) {
      $('.answer_button').attr('disabled', true);
    }
}

//This determines the current question number and increments the counter in the nav bar.
function generateQuestionNumber(questionNumber) {
    //console.log("Question number is " + questionNumber);
    let questionNumberText = "Q" + questionNumber + "/10";
    $('#question_count').text(questionNumberText);
}

function incrementCorrectAnswers(currentScore) {
    let correctAttemptText = currentScore + " Correct";
        $('#correct_attempt').text(correctAttemptText);
}

let score = 0;

function handleCorrectAnswer(userSelectedAnswer) {
    $(event.target).addClass("correct");
    console.log("handle answer ran");
    event.stopPropagation();
    let answerText = "Awesome, " + userSelectedAnswer + " is correct!";
    $('.result').text(answerText);
    disableAnswers(userSelectedAnswer);
}

function incrementUserScore() {
    score++;
    console.log("incrementing score");
    incrementCorrectAnswers(score);
}

function handleIncorrectAnswer(userSelectedAnswer, correctAnswer) {
    $(event.target).addClass("incorrect");
    console.log("handleIncorrectAnswer ran");
    event.stopPropagation();
    let answerText = "Sorry, "  + userSelectedAnswer + " is NOT correct.  The answer is " + correctAnswer;
    $('.result').text(answerText);
    disableAnswers(userSelectedAnswer);
}


function startQuizAgain() {
    $(document).on("click", "#start_again", function() {
        result = window.confirm("Are you sure you want to start again?");
        if (result == true) {
            location.reload(true);
        }
    });
}

function generateQuestions() {
    let questions = [
        {
            question_id: 1,
            question_text: "What is the Capital of the United States?",
            answer: "Washington, DC",
            decoy_1: "Philadelphia",
            decoy_2: "Chicago",
            decoy_3: "Miami"

        },
        {
            question_id: 2,
            question_text: "What is the Capital of Canada?",
            answer: "Ottawa",
            decoy_1: "Toronto",
            decoy_2: "Kingston",
            decoy_3: "Edmonton"
        },
        {
            question_id: 3,
            question_text: "What is the Capital of Mexico?",
            answer: "Mexico City",
            decoy_1: "Cancun",
            decoy_2: "Cabo San Lucas",
            decoy_3: "Tijuana"
        },
        {
            question_id: 4,
            question_text: "What is the Capital of the United Kingdom?",
            answer: "London",
            decoy_1: "Manchester",
            decoy_2: "Nottingham",
            decoy_3: "Edinborough"
        },
        {
            question_id: 5,
            question_text: "What is the Capital of Australia?",
            answer: "Canberra",
            decoy_1: "Sydney",
            decoy_2: "Brisbane",
            decoy_3: "Byron Bay"
        },
        {
            question_id: 6,
            question_text: "What is the Capital of China?",
            answer: "Beijing",
            decoy_1: "Shanghai",
            decoy_2: "Shenzen",
            decoy_3: "Tianjin"

        },
        {
            question_id: 7,
            question_text: "What is the Capital of India?",
            answer: "New Delhi",
            decoy_1: "Bengaluru",
            decoy_2: "Kolkata",
            decoy_3: "Mumbai"
        },
        {
            question_id: 8,
            question_text: "What is the Capital of Germany?",
            answer: "Berlin",
            decoy_1: "Munich",
            decoy_2: "Frankfurt",
            decoy_3: "Hamburg"
        },
        {
            question_id: 9,
            question_text: "What is the Capital of New Zealand?",
            answer: "Wellington",
            decoy_1: "Aukland",
            decoy_2: "Christchurch",
            decoy_3: "Dunedin"
        },
        {
            question_id: 10,
            question_text: "What is the Capital of France?",
            answer: "Paris",
            decoy_1: "Marsaille",
            decoy_2: "Lyon",
            decoy_3: "Toulouse"
        }
    ]
    return questions
};

$(document).ready(function(){
    generateQuestions()
    renderStart()
    handleQuizStartClick();
    handleAnswerSelection(score);
    startQuizAgain();
    handleNextQuestion();
    incrementCorrectAnswers(score);
    console.log("user score is " + score);
    //renderView();
});
