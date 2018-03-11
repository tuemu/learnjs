describe('LearnJS', function(){
    it('can show a problem view', function(){
        learnjs.showView('#problem-1');
        expects($('.view container .problem-view').length).toEqual(1);
    });
});

/**
 *
 describe('LearnJS', function() {
it('can show a problem view', function() {
learnjs.showView('#problem-1');
expect($('.view-container .problem-view').length).toEqual(1); });
});

 */