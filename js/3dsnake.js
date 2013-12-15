// 3dsnake.js


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
	spacebar: 32
};

KEYS = [37,38,39,40,32];

APPLE = {
	x: 0,
	y: 0,
	z: 150
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

var inGame = true;
var endGame = false;
var pauseGame = false;

/* Initialize game and start it */
var game = new Game();

function init() {
	if(game.init())
		game.start();
}

/* Holds all images for the game so images are only ever created once. Aka singleton. */
var imageRepo = new function() {
	// Define images
	this.apple = new Image();

	this.dot = new Image();

	this.apple.onLoad = function() {
		imageLoaded();
	}
	this.dot.onLoad = function () {
		imageLoaded();
	}

	this.apple.src = "imgs/apple.png";
	this.dot.src = "imgs/dot.png";
}

function Drawable() {	
	this.init = function() {};
	this.draw = function() {};
}

function FSnake() {

	this.draw = function() {

		this.context.clearRect(APPLE.x, APPLE.y, DOT_SIZE, DOT_SIZE);
		this.context.drawImage(imageRepo.apple, APPLE.x, APPLE.y);

		this.context.clearRect(SNAKE.x[SNAKE.length - 1], SNAKE.y[SNAKE.length - 1], DOT_SIZE, DOT_SIZE);
		this.context.drawImage(imageRepo.dot, SNAKE.x[0], SNAKE.y[0]);
	};
};

function TSnake() {

	this.draw = function() {

		this.context.clearRect(APPLE.x, APPLE.z, DOT_SIZE, DOT_SIZE);
		this.context.drawImage(imageRepo.apple, APPLE.x, APPLE.z);

		this.context.clearRect(SNAKE.x[SNAKE.length - 1], SNAKE.z[SNAKE.length - 1], DOT_SIZE, DOT_SIZE);
		this.context.drawImage(imageRepo.dot, SNAKE.x[0], SNAKE.z[0]);
	};
};

function SSnake() {

	this.draw = function() {

		this.context.clearRect(APPLE.z, APPLE.y, DOT_SIZE, DOT_SIZE);
		this.context.drawImage(imageRepo.apple, APPLE.z, APPLE.y);

		this.context.clearRect(SNAKE.z[SNAKE.length - 1], SNAKE.y[SNAKE.length - 1], DOT_SIZE, DOT_SIZE);
		this.context.drawImage(imageRepo.dot, SNAKE.z[0], SNAKE.y[0]);
	};
};

FSnake.prototype = new Drawable();
TSnake.prototype = new Drawable();
SSnake.prototype = new Drawable();


function updateSnake() {

	for (var i = SNAKE.length; i > 0; i--) {
		SNAKE.x[i] = SNAKE.x[i - 1];
		SNAKE.y[i] = SNAKE.y[i - 1];
		SNAKE.z[i] = SNAKE.z[i - 1];
	}

	if (left) {
		SNAKE.x[0] -= DOT_SIZE;
	}
	if (right) {
		SNAKE.x[0] += DOT_SIZE;
	}
	if (up) {
		SNAKE.y[0] -= DOT_SIZE;
	}
	if (down) {
		SNAKE.y[0] += DOT_SIZE;
	}

	//TODO: add z-dimension logic
};

function updateApple() {
	APPLE.x = Math.floor(Math.random() * WIDTH / DOT_SIZE) * DOT_SIZE;
	APPLE.y = Math.floor(Math.random() * HEIGHT / DOT_SIZE) * DOT_SIZE;
	// APPLE.z = Math.floor(Math.random() * DEPTH / DOT_SIZE) * DOT_SIZE;
};

function checkApple() {
	if ((SNAKE.x[0] === APPLE.x) && (SNAKE.y[0] === APPLE.y) && (SNAKE.z[0] === APPLE.z)) {
		updateApple();
		SNAKE.length++;
	}
};

function detectCollision() {
	if (SNAKE.x[0] < 0 || SNAKE.x[0] > WIDTH - 10
	 || SNAKE.y[0] < 0 || SNAKE.y[0] > HEIGHT - 10
	 || SNAKE.z[0] < 0 || SNAKE.z[0] > DEPTH - 10)
		inGame = false;
}

function gamePaused() {
	// TODO
}

/**
 * Creates Game object which will hold all objects and data
 */
function Game() {

	this.init = function() {

		// Initialize apple
		updateApple();

		// Set first three dots
		for (var i = 0; i < SNAKE.length; i++) {
			SNAKE.x[i] = 130 - i * 10;
			SNAKE.y[i] = 150;
			SNAKE.z[i] = 150;
		}

		// Get canvas elements
		this.FSCanvas = document.getElementById('front-snake');
		this.TSCanvas = document.getElementById('top-snake');
		this.SSCanvas = document.getElementById('side-snake');
		
		// Test to see if canvas is supported
		if (this.FSCanvas.getContext) {
			this.FSContext = this.FSCanvas.getContext('2d');
			this.TSContext = this.TSCanvas.getContext('2d');
			this.SSContext = this.SSCanvas.getContext('2d');

			FSnake.prototype.context = this.FSContext;
			TSnake.prototype.context = this.TSContext;
			SSnake.prototype.context = this.SSContext;
			
			// Initialize objects
			this.Fsnake = new FSnake();
			this.Tsnake = new TSnake();
			this.Ssnake = new SSnake();

			// this.Fsnake.init();
			// this.Tsnake.init();
			// this.Ssnake.init();

			return true;
		} else {
			return false;
		}
	};
	
	// Start animation loop
	this.start = function() {
			animate();
	};
}

/* Animation Loop */
function animate() {

	detectCollision();
	// reduce animation speed
	setTimeout(function() {
		if (inGame) {
			requestAnimFrame(animate);
			checkApple();
			updateSnake();

			game.Fsnake.draw();
			game.Tsnake.draw();
			game.Ssnake.draw();
		} else {
			console.log("DONE");
		}

		if (pauseGame) {
			gamePaused();
			console.log("Game Paused");
		}
	}, SPEED);
}

document.onkeydown = function(e) {
	var key = e.keyCode;
	if (KEYS.indexOf(key) > -1)
		e.preventDefault();

	if ((key === KEY_CODES.left) && (!right)) {
		left = true;
		up = false;
		down = false;
	}

	if ((key === KEY_CODES.right) && (!left)) {
		right = true;
		up = false;
		down = false;
	}

	if ((key === KEY_CODES.up) && (!down)) {
		up = true;
		left = false;
		right = false;
	}

	if ((key === KEY_CODES.down) && (!up)) {
		down = true;
		left = false;
		right = false;
	}

	if (key === KEY_CODES.spacebar) {
		if (!pauseGame)
			pauseGame = true;
		else
			pauseGame = false;
	}
};

/* requestAnim shim layer */
window.requestAnimFrame = (function() {
	return  window.requestAnimationFrame   || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame    || 
			window.oRequestAnimationFrame      || 
			window.msRequestAnimationFrame     || 
			function(/* function */ callback, /* DOMElement */ element){
				window.setTimeout(callback, 1000 / 60);
			};
})();