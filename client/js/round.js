var round = function(game){};
round.prototype = { preload: preload, create: create, update: update};

//Global Objects
var player; //Sprite
var net; //Sprite
var fishies; //Array of Sprites
var playersText; //Text
var popText; //Text
var caughtText; //Text
var caughtIcon; //Sprite
var idleText; //Text
var toolTips = [];
var showHelp;
var boatHelpText;

//Display Variables
var numPlayers = 4; //Display Constant
var roundPop; //Display Variable
var caught = 0; //Display Variable
var idleStart; //Internal Variable (seconds)
var idleTime = 0; //Display Variable

//Game Tuning Variables
var fishScale = 10; //Ratio of Population/Fish Sprites
var maxFishShown = 20; //Max Fish Sprites

var catchFraction = numPlayers; //Ratio of Population/Yield

var checkpoint = 1; //Position of boat
var startPos; //Starting position of boat
var boatOffsetX = 230; //Offset from net position
var speed = 500; //Speed of Boat
var fishing = false; //State of boat
var looped = false; //Whether Boat has wrapped around screen

var inactive; //State of player
var idleShow = 5; //Time after which Idle Message Shows
var idleLimit = 15; //Idle duration at which round will end

function preload () {

    // game.load.image('logo', 'assets/pics/phaser.png'); // tester
    var path = 'assets/pics/';
    game.load.image('sky', path + 'background.png');
    game.load.image('clouds', path + 'clouds.png');
    game.load.image('water', path + 'Water.png');
    game.load.image('player', path + 'LargeBoatSeparated.png');
    game.load.image('waveLine', path + 'BlueLine.png');
    game.load.spritesheet('net', path + 'netSheet.png', 250, 113);
    game.load.image('fish1', path + 'DarkerSmallFish.png');
    game.load.image('fish2', path + 'MediumFish.png');
    game.load.image('fish3', path + 'SmallFish.png');
    game.load.image('playersIcon', path + 'NEWNEWGroupBlue.png');
    game.load.image('popIcon', path + 'NewFish.png');
    game.load.image('caughtIcon', path + 'NewHook.png');

}

//##############################################################
//----------------------------CREATE----------------------------
//##############################################################

function create () {
    
    inactive = true;
    idleStart = game.time.time/1000;
    roundPop = serverOps.getPopulation(gameData); 
    caught = 0;
    idleTime = 0;
    startPos = 0.5*width;
    
    //BACKGROUND
    var horizon = height*0.5;
    var background = game.add.sprite(0, 0, 'sky');
    background.height = height;
    background.width = width;
    
    var clouds = game.add.sprite(0, horizon, 'clouds');
    var cloudScale = 280/900;
    clouds.anchor.setTo(0, 0.9);
    clouds.width = width;
    clouds.height = cloudScale*width; 
    
    var water = game.add.sprite(0,0,'water');
    water.y = horizon;
    water.width = width;
    water.height = width/3;

    //VARS
    
    var playerOffsetY = -210;
    var netOffsetY = -95;
    var anchor1 = Math.min(0.4*width, 0.5*width-160);
    var anchor2 = 0.5*width;
    var anchor3 = Math.max(0.6*width, 0.5*width+140);
    
    
    //BOAT + WAVES
    var playerScale = 219/177;
    var boatScaleFactor = 0.35;
    
    player = game.add.sprite(width/2, horizon, 'player'); //219x177
    player.anchor.setTo(0.5,0.9); 
    player.height = boatScaleFactor*height;
    player.width = playerScale*player.height;
    player.moveDown();
    player.inputEnabled = true;
    player.events.onInputDown.add(goFishing, this);
    game.physics.arcade.enable(player);
    
    var netDimensions = 250/113;
    
    boatOffsetX = player.width/2;
    net = game.add.sprite(width/2-boatOffsetX, horizon, 'net', 1);
    net.anchor.setTo(0.918, 0.4);
    net.height *= player.height/177;
    net.width = netDimensions * net.height;
    net.animations.add('goFishing', [1,0], 10);
    net.animations.add('stopFishing', [0,1], 10);
    game.physics.arcade.enable(net);
    
    var waveDimensions = 21/904
    var waveLine = game.add.sprite(0, horizon, 'waveLine');
    waveLine.anchor.setTo(0, 0.1);
    waveLine.width = width;
    waveLine.height = waveDimensions * width;
    
    //FISH
    fishies = game.add.group();
    createFishies(horizon);
    
    //TOP ICONS
    var playersIcon = game.add.sprite(anchor1, 10, 'playersIcon');
    playersIcon.anchor.setTo(1,0);
    playersText = game.add.text(anchor1, 10, ': ' + numPlayers);
    playersText.fill = "#00467A";
    var popIcon = game.add.sprite(anchor2, 10, 'popIcon');
    popIcon.anchor.setTo(1,0);
    popText = game.add.text(anchor2, 10, ': ' + roundPop);
    popText.fill = "#00467A";
    caughtIcon = game.add.sprite(anchor3, 10, 'caughtIcon');
    caughtIcon.anchor.setTo(1,0);
    caughtText = game.add.text(anchor3, 10, ': ' + caught);
    caughtText.fill = "#00467A";
    
    if (isMobile){
        var showHelpButton = game.add.text(width-10, 10, "Show Help Text");
        showHelpButton.anchor.setTo(1, 0);
        showHelpButton.fontSize = 20;
        showHelpButton.fontWeight = 'Bold';
        showHelpButton.fill = 'white';
        showHelp = true;
        showHelpButton.inputEnabled = true;
        showHelpButton.events.onInputDown.add(function(){
            for (var i = 0; i < toolTips.length; i++){
                if (showHelp){
                    toolTips[i].alpha = 1;
                    showHelpButton.text = "Hide Help Text";
                } else{
                    toolTips[i].alpha = 0;
                    showHelpButton.text = "Show Help Text";
                }
            }
            showHelp = !showHelp;
        }, this);
    }
    
    //TOOLTIPS
    addToolTip("Number of Players", playersIcon, false);
    addToolTip("Fish Population After Last Round", popIcon, false);
    addToolTip("Fish Caught This Round", caughtIcon, false);
    addToolTip("Click on Boat to Go Fishing", player, true);
    
    //COUNTDOWN TIMER
    idleText = game.add.text(0.5*width, 0.7*height, getIdleMessage());
    idleText.anchor.setTo(0.5,0);
    idleText.fontSize = 20;
    idleText.wordWrap = true;
    idleText.wordWrapWidth = 600;
    idleText.align = 'center';
    idleText.fill = 'white';
    idleText.alpha = 0;

}
//##############################################################
//----------------------------UPDATE----------------------------
//##############################################################
function update () {
    
    //BOAT MOVEMENT
    if (fishing){
        movePlayer();
    } else{
        player.body.velocity.x = 0;
        net.body.velocity.x = 0;
    }
    
    //BOAT HELP TEXT
    if (boatHelpText.alpha == 1 || (!showHelp && isMobile)){
        boatHelpText.alpha = 1;
        boatHelpText.x = getTextX(player, player.width/2);
        boatHelpText.y = getTextY(player, player.height/5);
    }
    
    //FISH MOVEMENT
    for (var i = 0; i<fishies.length; i++) {
        var fish = fishies.getAt(i);
        if (fish.body.onWall()){
            fish.scale.x *= -1;
        }
    }
    
    //TEXT UPDATES
    playersText.text =': ' + numPlayers;
    popText.text = ': ' + roundPop;
    caughtText.text = ': ' + caught;
    
    //UPDATE INACTIVITY
    if (inactive){
        idleTime = game.time.time/1000-idleStart;
        if (idleTime > idleShow){
            idleText.text = getIdleMessage();
            idleText.alpha = 1;
        }
        if (idleTime >= idleLimit && !DEBUG){
            inactive=false;
            serverOps.addFinished(caught);
            console.log(caught);
            game.state.start('waiting');
            //END ROUND NOW
        }
    } else{
        idleText.alpha = 0;
    }
}
//###############################################################
//----------------------------HELPERS----------------------------
//###############################################################

//DISPLAY HELPERS

function createFishies(horizon){
    var max = Math.min(Math.round(serverOps.getPopulation()/fishScale), maxFishShown);
    var tankTop = horizon + 70;
    var tankDepth = height/2-100;
    
    for (var i = 0; i<max; i++){
        var posX = Math.random()*width;
        var posY = tankTop + Math.random()*tankDepth;
        var orientation = Math.round(Math.random())*2 - 1; //+1 or -1
        var kind = Math.round(Math.random()*2 + 1); // 1, 2, or 3
        fishies.create(posX, posY, 'fish'+kind);
        
        var currFish = fishies.getAt(i);
        game.physics.arcade.enable(currFish);
        currFish.anchor.setTo(0.5,0.5);
        currFish.scale.x = orientation;
        currFish.body.collideWorldBounds = true;
        currFish.body.bounce.set(1);
        currFish.body.velocity.x = orientation * (Math.random()*10 + 5) * 10;
        
    }
}

function getIdleMessage(){
//Returns Idle Message
    var seconds = 'seconds';
    var timeElapsed = Math.round(idleTime);
    var timeLeft = Math.round(idleLimit-idleTime);

    if (timeLeft == 1){
        seconds = 'second';
    }
    return "You have been idle for too long. \n If you are  idle for " + timeLeft + " more " + seconds + ", \n you will return to port.";
}

function addToolTip(text, parent, moving){
    var x = getTextX(parent, 0);
    var y = Math.max(getTextY(parent, parent.height + 5), 60);
    var tooltip = game.add.text(x, y, text);
    tooltip.anchor.setTo(0.5, 0);
    toolTips.push(tooltip);
    
    //STYLE
    tooltip.fontSize = 18;
    tooltip.align = 'center';
    tooltip.wordWrap = true;
    tooltip.wordWrapWidth = 150;
    tooltip.fontWeight = 'Bold';
    tooltip.fill = '#00467A';
    tooltip.alpha = 0;
    
    //Make Tooltip Appear and Disappear on Hover
    parent.inputEnabled = true;
    if (!isMobile){
        parent.events.onInputOver.add(function(){
            tooltip.alpha = 1;
        }, this);
        parent.events.onInputOut.add(function(){
            tooltip.alpha = 0;
        }, this);
    }
    
    //Move Tooltip With Parent And Destroy On Click
    if (moving){
        tooltip.fill = 'white';
        boatHelpText = tooltip;
        parent.events.onInputOver.add(function(){
            tooltip.x = getTextX(parent, parent.width/2);
            tooltip.y = getTextY(parent, parent.height);
            game.canvas.style.cursor = "pointer";
        }, this);
        
        parent.events.onInputOut.add(function(){
            game.canvas.style.cursor = "default";
        }, this);
        
        parent.events.onInputDown.add(function(){
            tooltip.destroy();
            tooltip.alpha = 0; 
            game.canvas.style.cursor = "default";
        }, this);
    }
}

function getTextX(parent, offset){
// Get the X Position Of A Textbox
    return parent.x-parent.width/2 + offset;
}

function getTextY(parent, offsetY){
// Get the Y Position Of A Textbox
    return parent.y + offsetY;
}

function catchFish(){
// Handle Fish Catching Animations and Calculations
    var max = roundPop/fishScale;
    var haul = Math.round((max-max*Math.random()/2)/catchFraction);
    var caughtFish = game.add.sprite(net.x, net.y, 'fish1');
    caughtFish.x -= caughtFish.width/2;
    var textOffset = caughtFish.width;
    var catchText = game.add.text(caughtFish.x+textOffset, caughtFish.y, 'x'+haul);
    var duration = 1500;
    var delay = 200;

    caughtFish.alpha = 0;
    catchText.alpha = 0;
    
    //Animate Catching Text
    game.add.tween(catchText).to( { alpha: 1, x: caughtIcon.x+textOffset, y: caughtIcon.y}, duration, Phaser.Easing.Linear.None, true, delay, 0, false);
    
    //Animate Catching Icon
    game.add.tween(caughtFish).to( { alpha: 1, x: caughtIcon.x, y: caughtIcon.y}, duration, Phaser.Easing.Linear.None, true, delay, 0, false)
    .onComplete.add(function(){
        //Update Global Variables
        caught += haul;
        serverOps.addCatch(gameData, haul); //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!create server function to deal with negative values!!!!!!!!!!!!!!!
        caughtFish.destroy();
        catchText.destroy();
    })
}
//MOVEMENT HELPERS

function goFishing(){
//Starts Fishing Animations
    if (!fishing){
        net.animations.play('goFishing');
        catchFish();
        fishing = true;
        inactive = false;
        checkpoint = (checkpoint+2)%3;
        player.body.velocity.x = speed;
        net.body.velocity.x = speed;
    }
}

function movePlayer(){
    //Manages Boat Movement When Fishing
    var dest;
    if (checkpoint == 0){
        dest = width*0.1;
    } else if (checkpoint == 1){
        dest = width*0.48;
    } else if (checkpoint == 2){
        dest = width * 0.85;
    }
    if (checkpoint == 2){
        if (player.x >= dest){
            stopFishing();
        }
    } else{
        if (net.x >= width-50){
            var bodyWidth = player.width+boatOffsetX;
            net.x = -bodyWidth;
            player.x = -bodyWidth + boatOffsetX;
            looped = true;
        } else if (looped && player.x >= dest){
            stopFishing();
        }
    }
}

function stopFishing(){
    fishing = false;
    looped = false;
    inactive = true;
    idleStart = game.time.time/1000;
    net.animations.play('stopFishing');
    addToolTip("Click on Boat to Go Fishing", player, true);
}
