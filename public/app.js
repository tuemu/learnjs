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
];

learnjs.showView = function(hash) {
    console.log('** learnjs.showView is started.**');
    
    var routes = {
        '#problem': learnjs.problemView,
        '#': learnjs.landingView,
        '': learnjs.landingView
    };
    var hashParts = hash.split('-');
    //console.log('hashParts[0]: ' + hashParts[0]);
    var viewFn = routes[hashParts[0]];
    //console.log(viewFn);
    if(viewFn) {
        learnjs.triggerEvent('removingView', []);
        $('.view-container').empty().append(viewFn(hashParts[1]));
    }
}

/*
*/
learnjs.problemView = function (data) {
    console.log('** learnjs.problemView is started.**');
    var problemNumber = parseInt(data, 10);
    //var view = $('.templates .problem-view').clone();
    var view = learnjs.template('problem-view');
    var problemData = learnjs.problems[problemNumber-1];
    var resultFlash = view.find('.result');

    function checkAnswer() {
        console.log('checkAnswer');
        var answer = view.find('.answer').val();
        var test = problemData.code.replace('__', answer) + '; problem();';
        //console.log('test: '+ test);
        return eval(test);
    }

    function checkAnswerClick() {
        if (checkAnswer()) {
            //resultFlash.text('Correct');
            //learnjs.flashElement(resultFlash, 'Correct!');
            //var correctFlash = learnjs.template('correct-flash');
            //correctFlash.find('a').attr('href', '#problem-' + (problemNumber + 1));
            var correctFlash = learnjs.buildCorrectFlash(problemNumber);
            learnjs.flashElement(resultFlash, correctFlash);
        } else {
            //resultFlash.text('Incorrect');
            learnjs.flashElement(resultFlash, 'Incorrect!');
        }
        return false;
    }

    if(problemNumber < learnjs.problems.length) {
        var buttonItem = learnjs.template('skip-btn');
        buttonItem.find('a').attr('href', '#problem-' + (problemNumber + 1));
        $('.nav-list').append(buttonItem);
        view.bind('removingView', function() {
            buttonItem.remove();
        })
    }

    view.find('.check-btn').click(checkAnswerClick);
    view.find('.title').text('Problem #' + problemNumber);
    learnjs.applyObject(problemData, view);
    return view;
}

learnjs.buildCorrectFlash = function (problemNum) {
    var correctFlash = learnjs.template('correct-flash'); 
    var link = correctFlash.find('a');
    if (problemNum < learnjs.problems.length) {
        link.attr('href', '#problem-' + (problemNum + 1)); 
    } else {
        link.attr('href', '');
        link.text("You're Finished!"); 
    }
    return correctFlash;
}
    
learnjs.template = function(name) {
    return $('.templates .' + name).clone(); 
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

learnjs.flashElement = function(elem, content) {
    elem.fadeOut('fast', function() {
        elem.html(content);
        elem.fadeIn();
    });
}

learnjs.landingView = function() {
    return learnjs.template('landing-view');
}

learnjs.triggerEvent = function(name, args) {
    $('.view-container>*').trigger(name, args);
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