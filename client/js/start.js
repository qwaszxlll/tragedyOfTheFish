var start = function(game){};
start.prototype = { preload: preload, create: create};

function preload (){
     game.load.image('startScreen', 'assets/pics/blueBackground.png');
     game.load.image('startButton', 'assets/pics/startButton.png');
}

function create(){
    var background = game.add.sprite(0, 0, 'startScreen');
    background.height = height;
    background.width = width;
    var helpText = game.add.text(width/2, 4*height/5, "The other fishermen have already started fishing! Click the button below to start fishing.");
    helpText.anchor.setTo(0.5, 1);
    helpText.fontSize = 18;
    helpText.wordWrap = true;
    helpText.wordWrapWidth = 2*width/3;
    helpText.align = 'center';
    helpText.fill = 'white';
    var startButton = game.add.button(width/2, 4*height/5, 'startButton', startGame);
    startButton.anchor.setTo(0.5,0)
    startButton.onInputOver.add(function(){
        startButton.alpha = 0.6;
        game.canvas.style.cursor = "pointer";
    }, this);
    startButton.onInputOut.add(function(){
        startButton.alpha = 1;
        game.canvas.style.cursor = "default";
    }, this);
    
}

function startGame(){
    serverOps.startNewDay();
    game.state.start('round');
}