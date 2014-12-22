var app = {
    // global properties
    gm: {},

    // Application Constructor
    initialize: function() {
        this.bindEvents();
        this.gm = new Gamemanager();
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
        app.gm.loadCSV("res/sample.csv", function(res){
            console.log(res);
        });        
    },
    // console log on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    }
};

app.initialize();


/*
 * Game Manager Class
 */
function Gamemanager() {
    this.questions = {};
}
// load game data (questions and answers) from csv file
Gamemanager.prototype.loadCSV = function(url, callback) {
    $.get(url, $.proxy(function(csvstring){
        //console.log(csvstring);
        var data = Papa.parse(csvstring, {
            header: true,
        });
        this.questions = data;
        callback(data);
    }, this));
}