window.onload = function() {
    
    //Initialize Game
    var height = 600 //$(window).height();
    var width = 900 //$(window).width();
    
    var game = new Phaser.Game(width, height, Phaser.AUTO, '', { preload: preload, create: create, update: update });
    
    //Global Objects
    var player; //Sprite
    var net; //Sprite
    var fishies; //Array of Sprites
    var playersText; //Text
    var popText; //Text
    var caughtText; //Text
    var caughtIcon; //Sprite
    var idleText; //Text
    
    //Display Variables
    var numPlayers = 4; //Display Constant
    var population = 400; //Internal Variable
    var roundPop = population; //Display Variable
    var caught = 0; //Display Variable
    var idleStart; //Internal Variable (seconds)
    var idleTime = 0; //Display Variable
    
    //Game Tuning Variables
    var fishScale = 10; //Ratio of Population/Fish Sprites
    var maxFishShown = 20; //Max Fish Sprites
    
    var catchFraction = numPlayers; //Ratio of Population/Yield
    
    var checkpoint = 1; //Position of boat
    var startPos = 100; //Starting position of boat
    var boatOffsetX = 230; //Offset from net position
    var speed = 500; //Speed of Boat
    var fishing = false; //State of boat
    var looped = false; //Whether Boat has wrapped around screen
    
    var inactive = true; //State of player
    var idleShow = 5; //Time after which Idle Message Shows
    var idleLimit = 15; //Idle duration at which round will end

function preload () {

    // game.load.image('logo', 'assets/pics/phaser.png'); // tester
    var path = 'assets/pics/';
    game.load.image('sky', path + 'Background.png');
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
    
    new Phaser.Time(game);
    idleStart = game.time.time/1000;
    
    //BACKGROUND
    var background = game.add.sprite(0, 0, 'sky');
    var water = game.add.sprite(0,0,'water');
    
    //VARS
    var horizon = height - water.height;
    var waveOffset = -50;
    var playerOffsetY = -200;
    var netOffsetY = -85;
    var anchor1 = 220;
    var anchor2 = 400;
    var anchor3 = 600;
    
    
    //BOAT + WAVES
    water.y = horizon + waveOffset;
    player = game.add.sprite(startPos + boatOffsetX, horizon + playerOffsetY, 'player');
    player.moveDown();
    player.inputEnabled = true;
    player.events.onInputDown.add(goFishing, this);
    game.physics.arcade.enable(player);
    
    net = game.add.sprite(startPos, horizon + netOffsetY, 'net', 1);
    net.animations.add('goFishing', [1,0], 10);
    net.animations.add('stopFishing', [0,1], 10);
    game.physics.arcade.enable(net);
    
    var waveLine = game.add.sprite(0, horizon-50, 'waveLine');
    
    //FISH
    fishies = game.add.group();
    createFishies(height-horizon-100, horizon+20);
    
    //TOP ICONS
    var playersIcon = game.add.sprite(anchor1, 10, 'playersIcon');
    playersText = game.add.text(anchor1 + 50, 10, ': ' + numPlayers);
    var popIcon = game.add.sprite(anchor2, 10, 'popIcon');
    popText = game.add.text(anchor2 + 55, 10, ': ' + roundPop);
    caughtIcon = game.add.sprite(anchor3, 10, 'caughtIcon');
    caughtText = game.add.text(anchor3 + 30, 10, ': ' + caught);
    
    //TOOLTIPS
    addToolTip("Number of Players", playersIcon, false);
    addToolTip("Fish Population After Last Round", popIcon, false);
    addToolTip("Fish Caught This Round", caughtIcon, false);
    addToolTip("Click on Boat to Go Fishing", player, true);
    
    //COUNTDOWN TIMER
    idleText = game.add.text(450, 350, getIdleMessage());
    idleText.anchor.setTo(0.5,0.5);
    idleText.fontSize = 18;
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
    
    //FISH MOVEMENT
    for (var i = 0; i<fishies.length; i++) {
        var fish = fishies.getAt(i);
        if (fish.body.onWall()){
            fish.scale.x *= -1;
        };
    }
    
    //TEXT UPDATES
    playersText.text =': ' + numPlayers;
    popText.text = ': ' + roundPop;
    caughtText.text = ': ' + caught;
    
    //UPDATE INACTIVITY
    if (inactive){
        idleTime = game.time.time/1000-idleStart;
        if (idleTime > idleShow){
            idleText.alpha = 1;
        }
        if (idleTime >= idleLimit){
            inactive=false;
            //END ROUND NOW
        }
        idleText.text = getIdleMessage();
    } else{
        idleText.alpha = 0;
    }
}
//###############################################################
//----------------------------HELPERS----------------------------
//###############################################################

//DISPLAY HELPERS

function createFishies(upperLimit, startY){
    var max = Math.min(Math.round(population/fishScale), maxFishShown);
    
    for (var i = 0; i<max; i++){
        var posX = Math.random()*width;
        var posY = Math.random()*upperLimit+startY;
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
    var offset = -60;
    var x = getTextX(parent, offset);
    var y = getTextY(parent, parent.height + 5);
    var tooltip = game.add.text(x, y, text);
    
    //STYLE
    tooltip.fontSize = 15;
    tooltip.align = 'center';
    tooltip.wordWrap = true;
    tooltip.wordWrapWidth = 150;
    tooltip.fontWeight = 'Bold';
    tooltip.fill = 'white';
    tooltip.alpha = 0;
    
    //Make Tooltip Appear and Disappear on Hover
    parent.inputEnabled = true;
    parent.events.onInputOver.add(function(){
        tooltip.alpha = 1;
    }, this);
    parent.events.onInputOut.add(function(){
        tooltip.alpha = 0;
    }, this);
    
    //Move Tooltip With Parent And Destroy On Click
    if (moving){
        parent.events.onInputOver.add(function(){
            tooltip.x = getTextX(parent, offset);
            tooltip.y = getTextY(parent, parent.height + 5);
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

function getTextX(parent, offsetX){
// Get the X Position Of A Textbox
    return parent.x + parent.width/2 + offsetX;
}

function getTextY(parent, offsetY){
// Get the Y Position Of A Textbox
    return parent.y + offsetY;
}

function catchFish(){
// Handle Fish Catching Animations and Calculations
    var max = population/fishScale;
    var haul = Math.round((max-max*Math.random()/2)/catchFraction);
    var offsetX = 200;
    var offsetY = 100;
    var caughtFish = game.add.sprite(net.x+offsetX, net.y+offsetY, 'fish1');
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
        population -= haul;
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
    var interval = 320;
    var start = -250;
    var dest = checkpoint*interval-250;
    if (checkpoint == 2){
        if (net.x >= dest){
            stopFishing();
        }
    } else{
        if (net.x >= 850){
            net.x = -600;
            player.x = -600+boatOffsetX;
            looped = true;
        } else if (looped && net.x >= dest){
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

};