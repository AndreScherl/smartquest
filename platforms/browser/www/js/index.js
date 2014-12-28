// constants. maybe managed by app settings later...
var dataroot = "res/sample/";
var csvpath = dataroot+"sample.csv";
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
                $("#questionnavigation .previous").on("touchend", function(){
                    if(!$(this).hasClass("disabled")) {
                        app.gm.showquestionpage(parseInt($(this).attr("data-page")));
                        //console.log("previous question");
                    }
                });
                $("#questionnavigation .next").on("touchend", function(){
                    if(!$(this).hasClass("disabled")) {
                        app.gm.showquestionpage(parseInt($(this).attr("data-page")));
                        //console.log("next question");
                    }
                });
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
    this.currentquestion = number;
    // score
    app.gr.score();
    // question
    app.gr.question(this.questions[number]);
    // answers
    var answers = [];
    answers = answers.concat(this.answers);
    var rightanswer = this.questions[number].answer;
    // remove right answer from all answers array
    var index = answers.indexOf(rightanswer);
    if(index > -1) {
        answers.splice(index, 1);
    }
    answers.shuffle(); // shuffle the answers array
    answers = answers.slice(0, numberofanswers-1); // global limit of answers count per question
    answers.push(rightanswer); // add right answer
    answers.shuffle(); // shuffle array again
    app.gr.answers(answers);
    // question navigation
    app.gr.questionnavigation(number);
};
/*
 * evaluate answer
 * @param qnumber position of question in array
 * @param uanswer user answer
 * @return bool right/wrong
 */
Gamemanager.prototype.evaluateanswer = function(qnumber, uanswer) {
    var result = false;
    if(this.questions[qnumber].answer == uanswer.replace(dataroot+"img/", "img/")) {
        result = true;
        this.storerightquestion(this.questions[qnumber].id);
    } else {
        this.deletewrongquestion(this.questions[qnumber].id);
    }
    app.gr.score();
    return result;
};
/*
 * store right answered question
 * @param id - question id
 */
Gamemanager.prototype.storerightquestion = function(id) {
    var rightquestions = [];
    if(localStorage.getItem("rightquestions")) {
        rightquestions = JSON.parse(localStorage.getItem("rightquestions"));
    }
    var index = rightquestions.indexOf(id)
    if(index == -1) {
        rightquestions.push(id);
    }
    localStorage.setItem("rightquestions", JSON.stringify(rightquestions));
};
/*
 * delete wromg answered question
 * @param id - question id
 */
Gamemanager.prototype.deletewrongquestion = function(id) {
    var rightquestions = [];
    if(localStorage.getItem("rightquestions")) {
        rightquestions = JSON.parse(localStorage.getItem("rightquestions"));
    }
    var index = rightquestions.indexOf(id)
    if(index >= 0) {
        rightquestions.splice(index, 1);
    }
    localStorage.setItem("rightquestions", JSON.stringify(rightquestions));
};
/*
 * calculate game score
 * @return score
 */
Gamemanager.prototype.calculatescore = function() {
    var score = 0;
    if(localStorage.getItem("rightquestions")) {
        score = JSON.parse(localStorage.getItem("rightquestions")).length;
    }
    return score;
};

/*
 *
 * Renderer Class
 *
 */
function Gamerenderer() {}
/*
 * render question
 * @param object question
 * @param array answers - array of answers
 */
Gamerenderer.prototype.question = function(question) {
    $("#question").html(question.question.replace("img/", dataroot+"img/"));
};
/*
 * render answer
 *
 * @param array answers - array of answers
 */
Gamerenderer.prototype.answers = function(answers) {
    var htmlstring = "";
    answers.forEach(function(answer){
        htmlstring += "<a href=\"#\">"+ answer.replace("img/", dataroot+"img/") +"</a>";
    });
    $("#answers").html(htmlstring);
    $("#answers a").addClass("list-group-item");
    // bind touch event to answers
    $("#answers a").on("touchend", function(){
        $(this).addClass("active");
    });
    $("#answers a").on("touchend", function(){ //! Touch event reminder: touchstart, touchend, touchcancel, touchmove
        $(this).removeClass("active");
        var success = app.gm.evaluateanswer(app.gm.currentquestion, $(this).html());
        if (success) {
            app.gr.colorizeanswer($(this), "green");
        } else {
            app.gr.colorizeanswer($(this), "red");
        }
    });
};
/*
 * colorize answer (red=wrong, green=right)
 *
 * @param answers - array of answers
 * @param color - color name string
 */
Gamerenderer.prototype.colorizeanswer = function(answer, color) {
    if (color == "red") {
        answer.addClass("list-group-item-danger");
    }
    if (color == "green") {
        answer.addClass("list-group-item-success");
    }
};
/*
 * render question navigation
 *
 * @param number - number of current question
 */
Gamerenderer.prototype.questionnavigation = function(number) {
    if(number < 1) {
        $("#questionnavigation .previous").addClass("disabled");
    } else {
        $("#questionnavigation .previous").removeClass("disabled");
    }
    if (number == app.gm.questions.length-1) {
        $("#questionnavigation .next").addClass("disabled");   
    } else {
        $("#questionnavigation .next").removeClass("disabled"); 
    }
    $("#questionnavigation .previous").attr("data-page", number-1);
    $("#questionnavigation .next").attr("data-page", number+1);
};
/*
 * update score
 */
Gamerenderer.prototype.score = function() {
    var score = app.gm.calculatescore();
    if (score == 1) {
        $("#score").text(score+" Punkt");
    } else {
        $("#score").text(score+" Punkte");
    }
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