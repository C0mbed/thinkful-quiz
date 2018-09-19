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

function generateQuiz(questions, current) {
    // render the quiz
    console.log('`quiz` ran');
    //console.log(questions);
    let count = 0;
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
    viewQuiz += '<button type="button" class="control_button btn btn btn-outline-secondary col-sm-3">Next</button>';
    viewQuiz += '</div>';

    const viewContainer = document.getElementById('view');
    viewContainer.innerHTML += viewQuiz;
    //console.log("Current question in quiz is " + currentQuestion.answer);
    handleAnswerSelection(currentQuestion);
}

function renderView() {
    // render the summary
    const questionArray = generateQuestions();
    console.log('`Generating` quiz');
    generateQuiz(questionArray);
  }

function handleAnswerSelection(currentQuestion) {
    //handle what happens when someone clicks an answer during the quiz.
    $('.answer_button').click(function(event) {
        event.stopPropagation();
        const targetText = event.target;
        const userSelectedAnswer = targetText.innerHTML;
        console.log("The answer selected is " + userSelectedAnswer);
        validateAnswer(userSelectedAnswer, currentQuestion);
    });
}

function validateAnswer(userSelectedAnswer, currentQuestion) {
    const correctAnswer = currentQuestion.answer;
    console.log("The user selected answer is " + userSelectedAnswer);
    console.log("The correct answer is " + correctAnswer);
    if (userSelectedAnswer == correctAnswer) {
        handleCorrectAnswer();
    } else {
        handleIncorrectAnswer(userSelectedAnswer);
    }
}

function handleCorrectAnswer(currentQuestion) {
    $(event.target).addClass("correct");
    console.log("handle answer ran");
    event.stopPropagation();
    let current = 1;
}

function handleIncorrectAnswer(currentQuestion) {
    $(event.target).addClass("incorrect");
    console.log("handleIncorrectAnswer ran");
    event.stopPropagation();
    let current = 1;
}

function handleQuizStartClick() {
    $( ".start_quiz" ).click(function() {
        $('.js-start_box').addClass('hidden');
        renderView();
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
        }
    ]
    return questions
};


$(document).ready(function(){
    generateQuestions()
    renderStart()
    handleQuizStartClick();
    handleAnswerSelection();
    //renderView();
});
