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
    //console.log('`quiz` ran');
    //console.log(questions);
    let count = 0;
    if (currentQuestionNumber > count) {
        count = currentQuestionNumber;
    };

    let currentQuestion = questions[count];
    let answerButtonText = [
        currentQuestion.answer,
        currentQuestion.decoy_1,
        currentQuestion.decoy_2,
        currentQuestion.decoy_3
    ];
    //randomly sorts an array
    function sortAnswers(a,b) {
        const potentialOpts = [-1, 0, 1];
        const randomOptsIndex = Math.round(Math.random()*potentialOpts.length);
        return potentialOpts[randomOptsIndex];
    }
    //passes the `answerButtonText` into the sort answer function
    answerButtonText = answerButtonText.sort(sortAnswers);

    //The variable viewQuiz is where the html is housed for the questions within the view.
    let viewQuiz = '<div class="answer_box row justify-content-center">';
    viewQuiz += '<h2>'+currentQuestion.question_text+'</h2>';
    //the next loop generates the answer multiple choice buttons.
     for (let i = 0; i < answerButtonText.length; i++) {
       viewQuiz += '<button type="button" class="answer_button btn btn-primary btn-lg btn-block col-sm-9">'+answerButtonText[i]+'</button>'
     }
    viewQuiz += '</div>';
    viewQuiz += '<div class="controls row justify-content-center">';
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

 //handle what happens when someone clicks an answer during the quiz.
function handleAnswerSelection(currentQuestion, currentQuestionNumber) {
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
        handleNextQuestion(currentQuestionNumber, score);
    }
}
//handles what happens when the user has clicked the enabled next button.
function handleNextQuestion(currentQuestionNumber, score) {
    $('#next_button').click(function() {
        //console.log('next button clicked');
        const questionArray = generateQuestions();
        let count = currentQuestionNumber;
          if (count < 9 ) {
            console.log('current count is ' + count);
            count += 1;
            //console.log('The current count is ' + count);
            generateQuiz(questionArray, count);
             //This increments the current question and passes the value to `generateQuestionNumber()`
            let questionNumber = count + 1;
            generateQuestionNumber(questionNumber);
          } else {
              console.log('The final score is ' + score);
              tryQuizAgain();
              renderResult(score);
          }
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

//handles the `correct` counter in the nav bar.
function incrementCorrectAnswers(currentScore) {
    let correctAttemptText = currentScore + " Correct";
        $('#correct_attempt').text(correctAttemptText);
}

//global variable to represent the users score.  It begins at zero and is incremented by `incrementUserScore()`.
let score = 0;

//handles a correct answer by the user.
function handleCorrectAnswer(userSelectedAnswer) {
    $(event.target).addClass("correct");
    //console.log("handle answer ran");
    event.stopPropagation();
    let answerText = "Awesome, " + userSelectedAnswer + " is correct!";
    $('.result').text(answerText);
    disableAnswers(userSelectedAnswer);
}

//updates the global score variable with the current score
function incrementUserScore() {
    score++;
    //console.log("incrementing score");
    incrementCorrectAnswers(score);
}

//handles an incorrect answer by the user.
function handleIncorrectAnswer(userSelectedAnswer, correctAnswer) {
    $(event.target).addClass("incorrect");
  //console.log("handleIncorrectAnswer ran");
    event.stopPropagation();
    let answerText = "Sorry, "  + userSelectedAnswer + " is NOT correct.  The answer is " + correctAnswer;
    $('.result').text(answerText);
    disableAnswers(userSelectedAnswer);
}

function renderResult(result) {
    $('#view').empty();
    let viewResult = '<div class="js-result_box row justify-content-center">';
    viewResult += '<p>Nice Job, you finished the Quiz!</p><br>';
    viewResult += '<h2>You scored</h2><br>';
    viewResult += '<p>' + result + "/10" + '</p><br>';
    viewResult += '<button type="button" class="restart btn btn btn-outline-secondary">Start Quiz</button>';
    viewResult += '</div>';
    viewResult += '</div>';

    const resultView= document.getElementById('view');
    resultView.innerHTML += viewResult;
}

//This function is used by both the `start again` button and the start again button after the quiz is complete.
//function startQuizAgain() {
//    $(document).on("click", "#start_again", function() {
//        result = window.confirm("Are you sure you want to start again?");
//        if (result == true) {
//            location.reload(true);
//        }
//    });
//}

function tryQuizAgain() {
    $(document).on("click", "#start_again", function() {
        result = window.confirm("Are you sure you want to start again?");
            if (result == true) {
                location.reload(true);
            }
        });
}

//generates the questions array.
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

//runs the following functions once the document is fully loaded and ready.  This sets up the view and click handlers.
$(document).ready(function(){
    generateQuestions()
    renderStart()
    handleQuizStartClick();
    handleAnswerSelection(score);
    tryQuizAgain();
    handleNextQuestion();
    incrementCorrectAnswers(score);
});
