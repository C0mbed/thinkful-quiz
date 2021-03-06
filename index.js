//global variable to represent the users score.  It begins at zero and is incremented by `incrementUserScore()`.
let score = 0;

// render the start page
function renderStart() {
    generateStart();
  }

function injectStructure() {
    const viewStructure = `
        <section class="view_container">
            <div class="content_container">
                 <!--questions and answer choices injected here-->
             </div>
            <div class="next_btn_container">
                 <!--next button injected here-->
            </div>
             <div class="results_container">
                 <!--results injected here-->
            </div>
            <div class="summary_container">
                 <!--summary injected here-->
             </div>
        </section>
    `
    $('.container').append(viewStructure);
}

//handles the creation of a button that can be used anywhere.  Reusable. 
function createButton(text, className, idName, enabled) {
    //let button = <button disabled="true" type="button" id="next_button" class="next_button">Next</button>'
    const newButton = $('<button></button>')
    newButton.attr('class', className);
    newButton.attr('id', idName);
    newButton.html(text);
    if (enabled == false) {
        newButton.attr('disabled', true)
    } else {
        newButton.attr('disabled', false);
    }

    return newButton;
}

//render the HTML in the start/landing view
function generateStart() {
    startParagraphText();

    const nextButton = createButton('Lets Go!', 'start_quiz', 'start_quiz', true);
    $('.next_btn_container').append(nextButton);
}

//this creates the HTML that will be injected into the view.
function startParagraphText() {
    let viewStart = `
        <section>
            <div>
                <h2>Lets take a quiz!</h2>
            </div>
            <div>
                <p>You will be asked 10 multiple choice questions, you can view previous questions, but you cannot change the answer once it is submitted.  The topic is Capital Cities!  How well do you know Capital Cities around the world?</p>
            </div>
        </section>
    `
    $('.content_container').append(viewStart);
}

//handles the loading of the quiz on `click event` once the user has selected begin
function handleQuizStartClick() {
    $( ".start_quiz" ).click(function() {
        $('.js-start_box').addClass('hidden');
        renderView();
        $('.nav_item').removeClass('hidden');
      });
}

//clears the next button after answer selection to make way for the disabled button
function clearPreviousResult() {
    $('.next_btn_container').empty();
}

//clears entire view container without clearing the structure. 
function clearViewContainer() {
    $('.content_container').empty();
    $('.next_btn_container').empty();
    $('.results_container').empty();
    $('.summary_container').empty();
}

//handles the creation of the questions, and then calls for the creation of the HTML and questions in the view.
function renderView() {
    const questionArray = generateQuestions();
    generateQuiz(questionArray, 0);
}

//randomly sorts an array
function sortAnswers(a,b) {
    const potentialOpts = [-1, 0, 1];
    const randomOptsIndex = Math.round(Math.random()*potentialOpts.length);
    return potentialOpts[randomOptsIndex];
}

//This function creates the quiz and randomly chooses the questions to display to the user.
function generateQuiz(questions, currentQuestionNumber) {
    clearViewContainer();
    generateQuestionNumber(currentQuestionNumber + 1);
    // render the quiz

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
    const newQuestion = createQuestionContent(currentQuestion, 'answer_box', answerButtonText);
    $('.content_container').append(newQuestion);

    //create new button under each question
    const nextButton = createButton('Next', 'next_button', 'next_button', false);
    $('.next_btn_container').append(nextButton);

    handleAnswerClick(currentQuestion, currentQuestionNumber);
    handleAnswerKeypress(currentQuestion, currentQuestionNumber);
}

function createQuestionContent(currentQuestion, className, answerButtonText) {
    let viewQuiz = $('<form></form>')
    let quizContent = $('<fieldset></fieldset>')
    const targetClass = "." + className;
    quizContent.attr('class', className);

    const question = generateQuestionText(currentQuestion);
    viewQuiz.html(question);

    const answerChoices = generateAnswerChoices(answerButtonText, targetClass);
    quizContent.append(answerChoices);

    viewQuiz.append(quizContent);

    return viewQuiz
}

function generateQuestionText(currentQuestion) {
    const question = $('<legend></legend>');
    const questionText = currentQuestion.question_text;
    question.html(questionText);

    return question;
}

function generateAnswerChoices(answerButtonText) {
    clearPreviousResult();
    const answerSelections = $('<div></div>')
    answerSelections.attr('class', 'answer_selections');

    let possibleAnswers = answerButtonText.sort(sortAnswers);
    for (let i = 0; i < possibleAnswers.length; i++) {
        const inputDiv = $('<div></div>');
        inputDiv.attr('class', 'answer_div');
        const newInput = $('<input/>');
        newInput.attr('type', 'radio');
        newInput.attr('class', 'answer_input');
        newInput.attr('name', 'answer_input');
        newInput.attr('id', possibleAnswers[i]);

        const newLabel = $('<label></label>');
        newLabel.attr('for', possibleAnswers[i]);
        newLabel.attr('class', 'answer_label');
        newLabel.attr('tabindex', 1);
        newLabel.html(possibleAnswers[i]);
        inputDiv.append(newLabel);
        inputDiv.append(newInput);

        answerSelections.append(inputDiv);
    }
    return answerSelections;
}

//handle what happens when someone clicks an answer during the quiz.
function handleAnswerClick(currentQuestion, currentQuestionNumber) {
    $('.answer_input').click(function(event) {
        event.stopPropagation();

        const targetText = $(event.target).siblings('label');
        const userSelectedAnswer = targetText.html();

        validateAnswer(userSelectedAnswer, currentQuestion);
        enableNextButton(userSelectedAnswer, currentQuestionNumber);
    });
}

function handleAnswerKeypress(currentQuestion, currentQuestionNumber) {
  $('.answer_label').on({
      keypress: function(event) {
        event.preventDefault();

        if(event.which == 13) {
          const targetText = $(event.target);
          console.log(targetText);
          const userSelectedAnswer = targetText.html();

          validateAnswer(userSelectedAnswer, currentQuestion);
          enableNextButton(userSelectedAnswer, currentQuestionNumber);
        };    
    }
  });
}

function handleKeyPress() {
    $('.answer_label').off();
}

//this disables the questions after the user has selected an answer.
function disableAnswers(userSelectedAnswer) {
    if (userSelectedAnswer) {
      $('.answer_input').attr('disabled', true);
      $('.answer_div').addClass('no_hover');
      handleKeyPress();

      console.log('choices disabled');
    }
}

//this function checks to see whether the answer chosen by the user is correct/incorrect and updates the view accordingly.
function validateAnswer(userSelectedAnswer, currentQuestion) {
    const correctAnswer = currentQuestion.answer;
    if (userSelectedAnswer == correctAnswer) {
        handleCorrectAnswer(userSelectedAnswer);
        //Since the correct answer was selected we increment the users score
        incrementUserScore();
    } else {
        handleIncorrectAnswer(userSelectedAnswer, correctAnswer, score);
    }
}

//handles a correct answer by the user.
function handleCorrectAnswer(userSelectedAnswer) {
    $(event.target).closest("div").addClass("correct");
    event.stopPropagation();

    let answerText = "Awesome, " + userSelectedAnswer + " is correct!";
    $('.results_container').append(answerText);

    disableAnswers(userSelectedAnswer);
}

//handles an incorrect answer by the user.
function handleIncorrectAnswer(userSelectedAnswer, correctAnswer) {
    $(event.target).closest("div").addClass("incorrect");
    event.stopPropagation();

    let answerText = "Sorry, "  + userSelectedAnswer + " is NOT correct.  The answer is " + correctAnswer;
    $('.results_container').append(answerText);

    disableAnswers(userSelectedAnswer);
}

function enableNextButton(userSelectedAnswer, currentQuestionNumber) {
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
    clearViewContainer()
    resultHTMLView(result);

    const restartButton = createButton('Restart', 'restart', '', true);
    $('.next_btn_container').append(restartButton);
}

function resultHTMLView(result) {
    let viewResult = `
        <section class="js-result_box">
            <div>
                <p class ="summary_header">Nice Job, you finished the Quiz!</p>
                <br>
            </div>
            <div>
                <h2>You scored: ${result}/10</h2>
            </div>
        </section>
    `
    $('.content_container').append(viewResult);
}

//This function is used by both the `start again` button and the start again button after the quiz is complete.
function tryQuizAgain() {
    $(document).on("click", ".restart", function() {
        result = window.confirm("Are you sure you want to start again?");
        if (result == true) {
            clearViewContainer()
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

//can be called to reload event listeners in the event they drop off. 
function reload() {
  $('.nav_item').addClass('hidden');
    generateQuestions()
    renderStart()
    handleQuizStartClick();
    handleAnswerClick();
    handleAnswerKeypress();
    tryQuizAgain();
    handleNextQuestion();
    incrementCorrectAnswers(score);
}

//runs the following functions once the document is fully loaded and ready.  This sets up the view and click handlers.
$(document).ready(function(){
    injectStructure();
    generateQuestions()
    renderStart()
    handleQuizStartClick();
    handleAnswerClick();
    handleAnswerKeypress();
    tryQuizAgain();
    handleNextQuestion();
    incrementCorrectAnswers(score);
});
