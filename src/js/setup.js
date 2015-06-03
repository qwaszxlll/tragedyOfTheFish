//Initialize Game
var height = 600 //$(window).height();
var width = 900 //$(window).width();

var game = new Phaser.Game(width, height, Phaser.CANVAS, 'game');
new Phaser.Time(game);
var playerID = server.createNewPlayer();
