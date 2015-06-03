var endOfDay = function(game){
    this.day;
    this.haul;
    this.catchHistory;
    this.totalCatch;
};
endOfDay.prototype = { preload: preload, create: create};

function preload (){
     game.load.image('endOfDay', 'assets/pics/endOfDay.png');
     game.load.image('startButton', 'assets/pics/startButton.png');
     this.day = gameData.get("day");
     this.catchHistory = playerData.get("catchHistory");
     this.haul = this.catchHistory[this.day-1];
     this.totalCatch = playerData.get("totalCatch");
}

function create(){
    var background = game.add.sprite(0, 0, 'endOfDay');
    var dayText = game.add.text(450, 20, "End of Day " + this.day);
    
    dayText.anchor.setTo(0.5,0.5);
    dayText.fontSize = 18;
    dayText.wordWrap = true;
    dayText.wordWrapWidth = 600;
    dayText.align = 'center';
    dayText.fill = 'white';

    var popMessage = "You caught " + this.haul + " fish today. So far, you've caught " + this.totalCatch + " fish. \n After tallying your individual catches, you and the other fishermen have come to the consensus that tomorrow, the population of fish will be " + serverOps.getPopulation() + ". After a good night's rest, you wake to find that the other fishermen have already started fishing!";
    var popText = game.add.text(50, 100, popMessage);
    popText.fontSize = 18;
    popText.wordWrap = true;
    popText.wordWrapWidth = 400;
    popText.fill = 'white';
    
    var helpText = game.add.text(450, 470, "Click the button below to start fishing.");
    helpText.anchor.setTo(0.5,0.5);
    helpText.fontSize = 18;
    helpText.wordWrap = true;
    helpText.wordWrapWidth = 600;
    helpText.align = 'center';
    helpText.fill = 'white';
    
    var startButton = game.add.button(450, 540, 'startButton', startRound);
    startButton.anchor.setTo(0.5,0.5)
    startButton.onInputOver.add(function(){
        startButton.alpha = 0.6;
        game.canvas.style.cursor = "pointer";
    }, this);
    startButton.onInputOut.add(function(){
        startButton.alpha = 1;
        game.canvas.style.cursor = "default";
    }, this);
    
}

function startRound(){
    serverOps.startNewDay();
    game.state.start('round');
}