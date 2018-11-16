// render the start page
function renderStart() {
    generateStart();
  }

  //render the HTML in the start/landing view
function generateStart() {
    let viewStart = `
        <div class="start_quiz_view_div">
            <h2>Lets take a quiz!</h2>
        </div>
        <div>
            <p>You will be asked 10 multiple choice questions, you can view previous questions, but you cannot change the answer once it is submitted. The topic is Capital Cities!  How well do you know Capital Cities around the world?</p>
        </div>
        <div class="start_quiz_div">
            <button type="button" class="start_quiz">Start Quiz</button>
        </div>
    `
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

//handles the creation of the questions, and then calls for the creation of the HTML and questions in the view. 
function renderView() {
    const questionArray = generateQuestions();
    generateQuiz(questionArray, 0);
}

//global variable to represent the users score.  It begins at zero and is incremented by `incrementUserScore()`.
let score = 0;

//randomly sorts an array
function sortAnswers(a,b) {
    const potentialOpts = [-1, 0, 1];
    const randomOptsIndex = Math.round(Math.random()*potentialOpts.length);
    return potentialOpts[randomOptsIndex];
}

//This function creates the quiz and randomly chooses the questions to display to the user.
function generateQuiz(questions, currentQuestionNumber) {
    generateQuestionNumber(currentQuestionNumber + 1);
    // render the quiz
    $('#view').empty();

    let count = 0;
    if (currentQuestionNumber > count) {
        count = currentQuestionNumber;
    };

    let currentQuestion = questions[count];
    //This creates the array for each question that will be sorted.
    let answerButtonText = [
        currentQuestion.answer,
        currentQuestion.decoy_1,
        currentQuestion.decoy_2,
        currentQuestion.decoy_3
    ];
    const newQuestion = createQuestionText(currentQuestion, 'answer_box', answerButtonText);
    $('.container').append(newQuestion);

    //create new button under each question
    const nextButton = createButton('Next', 'next_button', 'next_button');
    $('.container').append(nextButton);

    handleAnswerSelection(currentQuestion, currentQuestionNumber);
}

function createQuestionText(currentQuestion, className, answerButtonText) {
    let viewQuiz = $('<fieldset></fieldset>')
    const targetClass = "." + className;
    viewQuiz.attr('class', className);

    const question = generateQuestionText(currentQuestion);
    viewQuiz.html(question);

    const answerChoices = generateAnswerChoices(answerButtonText, targetClass);
    viewQuiz.append(answerChoices);

    return viewQuiz
}

function generateQuestionText(currentQuestion) {
    const question = $('<legend></legend>');
    const questionText = currentQuestion.question_text;
    question.html(questionText);

    return question;
}

function generateAnswerChoices(answerButtonText) {
    const answerSelections = $('<div></div>')
    answerSelections.attr('class', 'answer_selections');

    let possibleAnswers = answerButtonText.sort(sortAnswers);
    for (let i = 0; i < possibleAnswers.length; i++) {
        const inputDiv = $('<div class="answer_div"></div>');
        const newInput = $('<input/>');
        newInput.attr('type', 'radio');
        newInput.attr('class', 'answer_input');
        newInput.attr('name', 'answer_input');
        newInput.attr('id', possibleAnswers[i]);

        const newLabel = $('<label></label>');
        newLabel.attr('for', possibleAnswers[i]);
        newLabel.html(possibleAnswers[i]);
        inputDiv.append(newLabel);
        inputDiv.append(newInput);

        answerSelections.append(inputDiv);
    }
    return answerSelections;
}

function createButton(text, className, idName, enabled) {
    //let button = <button disabled="true" type="button" id="next_button" class="next_button">Next</button>'
    const buttonDiv = $('<div></div')
    const divClass = className + "1";
    buttonDiv.attr('class', divClass);
    const newButton = $('<button></button>')
    newButton.attr('class', className);
    newButton.attr('id', idName);
    newButton.html(text);
    if (!enabled) {
        newButton.attr('disabled', true)
    } else {
        newButton.attr('disabled', false);
    }
    $(buttonDiv).append(newButton);

    return buttonDiv;
}

//handle what happens when someone clicks an answer during the quiz.
function handleAnswerSelection(currentQuestion, currentQuestionNumber) {
    $('.answer_input').click(function(event) {
        event.stopPropagation();

        const targetText = $(event.target).siblings('label');
        const userSelectedAnswer = targetText.html();

        validateAnswer(userSelectedAnswer, currentQuestion);
        enableNextButton(userSelectedAnswer, currentQuestionNumber);
    });
}

//this disables the questions after the user has selected an answer.
function disableAnswers(userSelectedAnswer) {
    if (userSelectedAnswer) {
      $('.answer_input').attr('disabled', true);
    }
}

//this function checks to see whether the answer chosen by the user is correct/incorrect and updates the view accordingly.
function validateAnswer(userSelectedAnswer, currentQuestion) {
    const correctAnswer = currentQuestion.answer;
    resultText();
    if (userSelectedAnswer == correctAnswer) {
        handleCorrectAnswer(userSelectedAnswer);
        //Since the correct answer was selected we increment the users score
        incrementUserScore();
    } else {
        handleIncorrectAnswer(userSelectedAnswer, correctAnswer, score);
    }
}

//creates a Div to contain the results text
function resultText() {
    const resultDiv = $('<div></div>')
    resultDiv.attr('class', 'result_text');

    $('.container').append(resultDiv);
}

//handles a correct answer by the user.
function handleCorrectAnswer(userSelectedAnswer) {
    $(event.target).closest("div").addClass("correct");
    event.stopPropagation();

    let answerText = "Awesome, " + userSelectedAnswer + " is correct!";
    $('.result_text').append(answerText);

    disableAnswers(userSelectedAnswer);
}

//handles an incorrect answer by the user.
function handleIncorrectAnswer(userSelectedAnswer, correctAnswer) {
    $(event.target).closest("div").addClass("incorrect");
    event.stopPropagation();

    let answerText = "Sorry, "  + userSelectedAnswer + " is NOT correct.  The answer is " + correctAnswer;
    $('.result_text').append(answerText);

    disableAnswers(userSelectedAnswer);
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
        const questionArray = generateQuestions();
        let count = currentQuestionNumber;
          if (count < 9 ) {
            count += 1;
            generateQuiz(questionArray, count);
            let questionNumber = count + 1;
            generateQuestionNumber(questionNumber);
          } else {
              renderResult(score);
          }
    })
}

//This determines the current question number and increments the counter in the nav bar.
function generateQuestionNumber(questionNumber) {
    let questionNumberText = "Q" + questionNumber + "/10";
    $('#question_count').text(questionNumberText);
}

//handles the `correct` counter in the nav bar.
function incrementCorrectAnswers(currentScore) {
    let correctAttemptText = currentScore + " Correct";
        $('#correct_attempt').text(correctAttemptText);
}

//updates the global score variable with the current score
function incrementUserScore() {
    score++;
    incrementCorrectAnswers(score);
}

function renderResult(result) {
    $('#view').empty();
    let viewResult = `
        <div class="js-result_box">
            <div>
                <p class ="summary_header">Nice Job, you finished the Quiz!</p>
                <br>
            </div>
            <div>
                <h2>${result}/10</h2>
            </div>
            <div class="result_button_box">
            </div>
        </div>
    `
    const resultView= document.getElementById('view');
    resultView.innerHTML += viewResult;

    const restartButton = createButton('Restart', 'restart', '', true);
    $('.js-result_box').append(restartButton);
}

//This function is used by both the `start again` button and the start again button after the quiz is complete.
function tryQuizAgain() {
    //console.log('user selected restart quiz');
    $(document).on("click", ".restart", function() {
        //console.log('restart quiz clicked');
        result = window.confirm("Are you sure you want to start again?");
        if (result == true) {
            $('.container').empty();
            score = 0;
            reload();
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

function reload() {
    generateQuestions()
    renderStart()
    handleQuizStartClick();
    handleAnswerSelection(score);
    tryQuizAgain();
    handleNextQuestion();
    incrementCorrectAnswers(score);
}

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
