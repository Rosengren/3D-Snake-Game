/* CONSTANTS */
var WIDTH = 300;
var HEIGHT = 300;
var DEPTH = 300;
var DOT_SIZE = 10;
var SNAKE_LENGTH = 4;
var SPEED = 50;

KEY_CODES = {
	left: 37,
	up: 38,
	right: 39,
	down: 40,
	front: 68,
	back:65,
	spacebar: 32
};

KEYS = [32,37,38,39,40,65,68];

APPLE = {
	x: 0,
	y: 0,
	z: 0
};

SNAKE = {
	x: new Array(),
	y: new Array(),
	z: new Array(),
	length: SNAKE_LENGTH
};

var up = false;
var down = false;
var left = false;
var right = true;
var front = false;
var back = false;
var POV = 0;

var inGame = true;
var endGame = false;
var pauseGame = false;
