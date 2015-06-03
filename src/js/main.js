//Initialize Game
var height = 600 //$(window).height();
var width = 900 //$(window).width();

var game = new Phaser.Game(width, height, Phaser.CANVAS, 'game');
new Phaser.Time(game);
var playerID = server.createNewPlayer();


game.state.add('start', start);
game.state.add('round', round);
game.state.add('waiting', waiting);
game.state.add('endOfDay', endOfDay);

if (playerID > 0){
    game.state.start('start');
}