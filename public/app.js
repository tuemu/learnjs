'use strict';
var learnjs = {
    poolId: 'us-east-1:054b7466-c4bc-4f01-9adf-05945ffbc692'
};

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


learnjs.identity = new $.Deferred();


learnjs.showView = function(hash) {
    console.log('** learnjs.showView is started.**');
    
    var routes = {
        '#problem': learnjs.problemView,
        '#profile': learnjs.profileView,
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
149146405005-3m54i9h95ovkb45tor7ojvgr3oaa8374.apps.googleusercontent.com
*/
learnjs.problemView = function (data) {
    console.log('** learnjs.problemView is started.**');
    var problemNumber = parseInt(data, 10);
    //var view = $('.templates .problem-view').clone();
    var view = learnjs.template('problem-view');
    var problemData = learnjs.problems[problemNumber-1];
    var resultFlash = view.find('.result');

    var answer = view.find('.answer');

    learnjs.fetchAnswer(problemNumber).then(function(data) {
        if (data.Item) {
            answer.val(data.Item.answer);
        }
    });


    function checkAnswer() {
        console.log('checkAnswer');
        var answer1 = view.find('.answer').val();
        var test = problemData.code.replace('__', answer1) + '; problem();';
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
            console.log('answer: '+ answer);
            //console.log('answer.val: '+ answer.val);
            learnjs.saveAnswer(problemNumber, answer.val());
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
    console.log('learnjs.appOnReady is stared.');
    window.onhashchange = function() {
        learnjs.showView(window.location.hash);
    };
    learnjs.showView(window.location.hash);
    learnjs.identity.done(learnjs.addProfileLink);
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

function googleSignIn(googleUser) {
    console.log('googleSignIn(googleUser) is started.');
    var id_token = googleUser.getAuthResponse().id_token;
    console.log('**id_token**:  ' + id_token);
    console.log('learnjs.poolId:  ' + learnjs.poolId);
    AWS.config.update({
        region: 'us-east-1',
        credentials: new AWS.CognitoIdentityCredentials({
            IdentityPoolId: learnjs.poolId,
            Logins: {
                'accounts.google.com': id_token
            }
        })
    })
    learnjs.awsRefresh().then(function(id) {
        learnjs.identity.resolve({
            id: id,
            email: googleUser.getBasicProfile().getEmail(),
            refresh: refresh
        });
    });
}

function refresh() {
    console.log('refresh() is started.');
    return gapi.auth2.getAuthInstance().signIn({
        prompt: 'login'
    }).then(function(userUpdate) {
        var creds = AWS.config.credentials;
        var newToken = userUpdate.getAuthResponse().id_token;
        creds.params.Logins['accounts.google.com'] = newToken;
        return learnjs.awsRefresh();
    }); 
}

learnjs.awsRefresh = function() {
    console.log('learnjs.awsRefresh !!!!!');
    var deferred = new $.Deferred();
    AWS.config.credentials.refresh(function(err) {
        if (err) {
            console.log('AWS.config.credentials.refresh is err  !!!!!');
            deferred.reject(err);
        } else {
            console.log('AWS.config.credentials.refresh is GREEEAT  !!!!!');
            deferred.resolve(AWS.config.credentials.identityId);
        }
    });
    return deferred.promise();
}



learnjs.profileView = function() {
    console.log('learnjs.profileView is started.')
    var view = learnjs.template('profile-view');
    learnjs.identity.done(function(identity){
        view.find('.email').text(identity.email);
    });
    return view;
}

learnjs.addProfileLink = function(profile) {
    console.log('learnjs.addProfileLink is started.')
    var link = learnjs.template('profile-link');
    console.log('profile.email: '+ profile.email)
    link.find('a').text(profile.email);
    $('.signin-bar').prepend(link);
}

learnjs.sendDbRequest = function(req, retry) {
    var promise = new $.Deferred();
    req.on('error', function(error){
        if(error.code === "CredentialsError") {
            learnjs.identity.then(function(identity) {
                return identity.refresh().then(function() {
                    return retry();
                }, function() {
                    promise.reject(resp);
                });
            });
        } else {
            promise.reject(error);
        }
    });
    req.on('success', function(resp) {
        promise.resolve(resp.data);
    });
    req.send();
    return promise;
}

learnjs.saveAnswer = function(problemId, answer) {
    return learnjs.identity.then(function(identity) {
        var db = new AWS.DynamoDB.DocumentClient();
        var item = {
            TableName: 'learnjs',
            Item: {
                userId: identity.id,
                problemId: problemId,
                answer: answer
            }
        };
        return learnjs.sendDbRequest(db.put(item), function() {
            return learnjs.saveAnswer(problemId, answer);
        })
    });
}

learnjs.fetchAnswer = function(problemId) {
    console.log('learnjs.fetchAnswer is started.')
    return learnjs.identity.then(function(identity) {
        var db = new AWS.DynamoDB.DocumentClient();
        var item = {
            TableName: 'learnjs',
            Key: {
                userId: identity.id,
                problemId: problemId
            }
        };
        return learnjs.sendDbRequest(db.get(item), function() {
            return learnjs.fetchAnswer(problemId);
        })
    });
}