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

function generateQuiz() {
    // render the quiz
    console.log('`quiz` ran');
    let viewQuiz = '<div class="answer_box row justify-content-center">';
    viewQuiz += '<button type="button" class="btn btn-primary btn-lg btn-block col-sm-9">This is Answer 1</button>';
    viewQuiz += '<button type="button" class="btn btn-primary btn-lg btn-block col-sm-9">This is Answer 2</button>';
    viewQuiz += '<button type="button" class="btn btn-primary btn-lg btn-block col-sm-9">This is Answer 3</button>';
    viewQuiz += '<button type="button" class="btn btn-primary btn-lg btn-block col-sm-9">This is Answer 4</button>';
    viewQuiz += '</div>';
    viewQuiz += '<div class="controls row justify-content-center">';
    viewQuiz += '<button type="button" class="btn btn btn-outline-secondary col-sm-3">Previous</button>';
    viewQuiz += '<button type="button" class="btn btn btn-outline-secondary col-sm-3">Submit</button>';
    viewQuiz += '<button type="button" class="btn btn btn-outline-secondary col-sm-3">Next</button>';
    viewQuiz += '</div>';

    const viewContainer = document.getElementById('view');
    viewContainer.innerHTML += viewQuiz;
}

function renderView() {
    // render the summary
    console.log('`Generating` quiz');
    generateQuiz()
  }

function handleQuizStartClick() {
    $( ".start_quiz" ).click(function() {
        $('.js-start_box').addClass('hidden');
        renderView();
      });
}
$(document).ready(function(){
    renderStart()
    handleQuizStartClick();
    //renderView();
});
