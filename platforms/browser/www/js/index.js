// constants. maybe managed by app settings later...
var csvpath = "res/sample.csv";
var numberofanswers = 3;

var app = {
    // global properties
    gm: {},

    // Application Constructor
    initialize: function() {
        this.bindEvents();
        this.gm = new Gamemanager();
        this.gr = new Gamerenderer();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        // load csv
        app.gm.loadCSV(csvpath, function(res){
            console.log(res);
            // extract the answers
            app.gm.storeAnswers(function(ans){
                console.log(ans);
                app.gm.showquestionpage(app.gm.currentquestion);
            });
        });       
    },
    // console log on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    }
};

app.initialize();


/*
 *
 * Game Manager Class
 *
 */
function Gamemanager() {
    this.questions = [];
    this.numberofanswers = numberofanswers;
    this.answers = [];
    this.currentquestion = 0;
}
// load game data (questions and answers) from csv file
Gamemanager.prototype.loadCSV = function(url, callback) {
    $.get(url, $.proxy(function(csvstring){
        //console.log(csvstring);
        var result = Papa.parse(csvstring, {
            header: true,
        });
        result.data.shuffle();
        this.questions = result.data;
        callback(result.data);
    }, this));
};
// store all answers once in an array
Gamemanager.prototype.storeAnswers = function(callback) {
    var answers = [];
    this.questions.forEach(function(question){
        if(answers.indexOf(question.answer) == -1) {
            answers.push(question.answer); 
        }
    });
    this.answers = answers;
    callback(answers);
};
/*
 * show question
 * @param number position of question in array
 */
Gamemanager.prototype.showquestionpage = function(number) {
    app.gr.question(this.questions[number]);
    var answers = [];
    var rightanswer = this.questions[number].answer;
    answers.push(rightanswer); // add right answer
    // remove right answer from all answers array
    var index = this.answers.indexOf(rightanswer);
    if(index > -1) {
        this.answers.splice(index, 1);
    }
    this.answers.shuffle(); // shuffle the answers array
    answers = answers.concat(this.answers.slice(0, numberofanswers-1)); // global limit of answers count per question
    answers.shuffle(); // shuffle array again
    app.gr.answers(answers);
};


/*
 *
 * Renderer Class
 *
 */
function Gamerenderer() {

}
/*
 * render question
 * @param object question
 * @param array answers - array of answers
 */
Gamerenderer.prototype.question = function(question) {
    $("#question").html(question.question);
};
/*
 * render answer
 *
 * @param array answers - array of answers
 */
Gamerenderer.prototype.answers = function(answers) {
    var htmlstring = "";
    answers.forEach(function(answer){
        htmlstring += "<button type=\"button\">"+ answer +"</button>";
    });
    $("#answers").html(htmlstring);
    $("#answers button").addClass("btn btn-default");
};



//! add shuffle method to Array class
function arrayShuffle(){
    var tmp, rand;
    for(var i =0; i < this.length; i++){
      rand = Math.floor(Math.random() * this.length);
      tmp = this[i]; 
      this[i] = this[rand]; 
      this[rand] =tmp;
    }
}
Array.prototype.shuffle = arrayShuffle;