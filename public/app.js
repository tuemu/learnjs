'use strict';
var learnjs = {};

//source[learnjs/3100/prblic/app.js]{
learnjs.problems = [
    {
        description: "What is truth?",
        code: "function problem() {return __;}"
    },
    {
        description: "Simple Math",
        code: "function problem() {return 42 === 6 *  __;}"
    }
]
//}

// learnjs.problemView2 = function(problemNumber) {
//     var title = 'Problem #' + problemNumber + ' Coming soon!';
//     var view = $('.templates .problem-view').clone();
//     view.find('.title').text(title);
//     return view;
// }
/**
learnjs.problemView = function(data) {
var problemNumber = parseInt(data, 10);
var view = $('.templates .problem-view').clone(); view.find('.title').text('Problem #' + problemNumber); 
learnjs.applyObject(learnjs.problems[problemNumber 1], view); return view;
}
*/
learnjs.problemView = function (data) {
    var problemNumber = parseInt(data, 10);
    var view = $('.templates .problem-view').clone();
    var problemData = learnjs.problems[problemNumber-1];
    var resultFlash = view.find('.result');

    function checkAnswer() {
        console.log('checkAnswer');
        var answer = view.find('.answer').val();
        var test = problemData.code.replace('__', answer) + '; problem();';
        console.log('test: '+ test);
        return eval(test);
    }

    function checkAnswerClick() {
        if (checkAnswer()) {
            resultFlash.text('Correct');
        } else {
            resultFlash.text('Incorrect');
        }
        return false;
    }

    view.find('.check-btn').click(checkAnswerClick);
    view.find('.title').text('Problem #' + problemNumber);
    learnjs.applyObject(problemData, view);
    return view;
}

learnjs.showView = function(hash) {
    var routes = {
        '#problem': learnjs.problemView
    };
    var hashParts = hash.split('-');
    //console.log('hashParts[0]: ' + hashParts[0]);
    var viewFn = routes[hashParts[0]];
    //console.log(viewFn);
    if(viewFn) {
        $('.view-container').empty().append(viewFn(hashParts[1]));
    }
}

learnjs.appOnReady = function() {
    window.onhashchange = function() {
        learnjs.showView(window.location.hash);
    };
    learnjs.showView(window.location.hash);
}

learnjs.applyObject = function(obj, elem) {
    for (var key in obj) {
        elem.find('[data-name="' + key + '"]').text(obj[key]);
    }
}

/**
learnjs.problemView = function(data) {
var problemNumber = parseInt(data, 10);
var view = $('.templates .problem-view').clone(); view.find('.title').text('Problem #' + problemNumber); learnjs.applyObject(learnjs.problems[problemNumber 1], view); return view;
}


learnjs.appOnReady = function() { window.onhashchange = function() {
learnjs.showView(window.location.hash); };
learnjs.showView(window.location.hash); }



learnjs.problemView = function(problemNumber) {
var title = 'Problem #' + problemNumber + ' Coming soon!'; return $('<div class="problem-view">').text(title);
}


 */