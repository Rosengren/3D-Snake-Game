// 3dsnake.js

var WIDTH = 300;
var HEIGHT = 300;
var DOT_SIZE = 10;
var RAND_POS = 9;
var APPLE = new Object;
var SNAKE = new Object;
var SPEED = 50;
var COLLISION = false;

var up = false;
var down = false;
var left = false;
var right = false;

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

	var numbImages = 3,
			numLoaded = 0;

	function imageLoaded() {
		numLoaded++;
		if (numLoaded === numbImages)
			window.init();
	}

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
	this.init = function() {
		this.width = 10;
		this.height = 10;
		this.depth = 10;
	}

	this.canvasWidth = 0;
	this.canvasHeight = 0;
	
	this.draw = function() {};
	this.move = function() {};
}

function FApple() {
	this.draw = function() {
		if (!APPLE.isVisible) {
			this.context.clearRect(0, 0, DOT_SIZE, DOT_SIZE);
			this.context.drawImage(imageRepo.apple, APPLE.x, APPLE.y);
			APPLE.isVisible = true;	// Change Later!
		}
	};
}

function TApple() {
	this.draw = function() {

		if (!APPLE.isVisible) {
			this.context.clearRect(0, 0, DOT_SIZE, DOT_SIZE);
			this.context.drawImage(imageRepo.apple, APPLE.x, APPLE.z);
			APPLE.isVisible = true;	// Change Later!
		}
	};
}

function SApple() {
	this.draw = function() {
		if (!APPLE.isVisible) {
			this.context.clearRect(0, 0, DOT_SIZE, DOT_SIZE);
			this.context.drawImage(imageRepo.apple, APPLE.z, APPLE.y);
			APPLE.isVisible = true;	// Change Later!
		}
	};
};

function FSnake() {
	this.draw = function() {
		this.context.clearRect(SNAKE.x[SNAKE.length - 1], SNAKE.y[SNAKE.length - 1], DOT_SIZE, DOT_SIZE);
		this.context.drawImage(imageRepo.dot, SNAKE.x[0], SNAKE.y[0]);
	};
};

function TSnake() {
	this.draw = function() {
		this.context.clearRect(SNAKE.x[SNAKE.length - 1], SNAKE.z[SNAKE.length - 1], DOT_SIZE, DOT_SIZE);
		this.context.drawImage(imageRepo.dot, SNAKE.x[0], SNAKE.z[0]);
	};
};

function SSnake() {
	this.draw = function() {
		this.context.clearRect(SNAKE.z[SNAKE.length - 1], SNAKE.y[SNAKE.length - 1], DOT_SIZE, DOT_SIZE);
		this.context.drawImage(imageRepo.dot, SNAKE.z[0], SNAKE.y[0]);
	};
};

FApple.prototype = new Drawable();
TApple.prototype = new Drawable();
SApple.prototype = new Drawable();

FSnake.prototype = new Drawable();
TSnake.prototype = new Drawable();
SSnake.prototype = new Drawable();


function updateSnake() {

	for (var i = SNAKE.length; i > 0; i--) {
		SNAKE.x[i] = SNAKE.x[i - 1];
		SNAKE.y[i] = SNAKE.y[i - 1];
		SNAKE.z[i] = SNAKE.z[i - 1];
	}

	if (KEY_STATUS.left) {
		SNAKE.x[0] -= DOT_SIZE;
	}
	if (KEY_STATUS.right) {
		SNAKE.x[0] += DOT_SIZE;
	}
	if (KEY_STATUS.up) {
		SNAKE.y[0] -= DOT_SIZE;
	}
	if (KEY_STATUS.down) {
		SNAKE.y[0] += DOT_SIZE;
	}

	//TODO: add z-dimension
};

function updateApple() {
	APPLE.x = Math.floor(Math.random() * RAND_POS * DOT_SIZE);
	APPLE.y = Math.floor(Math.random() * RAND_POS * DOT_SIZE);
	APPLE.z = Math.floor(Math.random() * RAND_POS * DOT_SIZE);
	APPLE.isVisible = false;
};

function checkApple() {
	if ((SNAKE.x[0] === APPLE.x) && (SNAKE.y[0] === APPLE.y) && (SNAKE.z[0] === APPLE.z)) {
		SNAKE.length++;
		updateApple();
	}
};

function detectCollision() {
	if (SNAKE.x[0] < 0 || SNAKE.x[0] > WIDTH || SNAKE.y[0] < 0 || SNAKE.y[0] > HEIGHT) {
		COLLISION = true;
		console.log("Hit the Walls, bud!");
	}
}


/**
 * Creates Game object which will hold all objects and data
 */
function Game() {

	this.init = function() {

		// initialize snake
		SNAKE.length = 4;
		SNAKE.x = new Array();
		SNAKE.y = new Array();
		SNAKE.z = new Array();


		// Display first three dots
		for (var i = 0; i < SNAKE.length; i++) {
			SNAKE.x[i] = 130 - i * 10;
			SNAKE.y[i] = 150;
			SNAKE.z[i] = 150;
		}

		// initialize apple
		APPLE.x = APPLE.y = APPLE.z = 150;
		APPLE.isVisible = false;

		// Get canvas elements
		this.FACanvas = document.getElementById('front-apple');
		this.TACanvas = document.getElementById('top-apple');
		this.SACanvas = document.getElementById('side-apple');

		this.FSCanvas = document.getElementById('front-snake');
		this.TSCanvas = document.getElementById('top-snake');
		this.SSCanvas = document.getElementById('side-snake');
		
		// Test to see if canvas is supported
		if (this.FACanvas.getContext) {
			this.FAContext = this.FACanvas.getContext('2d');
			this.TAContext = this.TACanvas.getContext('2d');
			this.SAContext = this.SACanvas.getContext('2d');

			this.FSContext = this.FSCanvas.getContext('2d');
			this.TSContext = this.TSCanvas.getContext('2d');
			this.SSContext = this.SSCanvas.getContext('2d');
		
			FApple.prototype.context = this.FAContext;
			TApple.prototype.context = this.TAContext;
			SApple.prototype.context = this.SAContext;

			FSnake.prototype.context = this.FSContext;
			TSnake.prototype.context = this.TSContext;
			SSnake.prototype.context = this.SSContext;
			
			// Initialize objects
			this.Fapple = new FApple();
			this.Tapple = new TApple();
			this.Sapple = new SApple();

			this.Fsnake = new FSnake();
			this.Tsnake = new TSnake();
			this.Ssnake = new SSnake();

			this.Fapple.init(); 
			this.Tapple.init();
			this.Sapple.init();

			this.Fsnake.init();
			this.Tsnake.init();
			this.Ssnake.init();

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
	// reduce animation speed
	setTimeout(function() {
		requestAnimFrame(animate);
		game.Fapple.draw();
		game.Tapple.draw();
		game.Sapple.draw();

		detectCollision();
		updateSnake();
		checkApple();

		game.Fsnake.draw();
		game.Tsnake.draw();
		game.Ssnake.draw();
	}, SPEED);
}

KEY_CODES = {
	37: 'left',
	38: 'up',
	39: 'right',
	40: 'down'
}

KEY_STATUS = {};
for (code in KEY_CODES) {
	KEY_STATUS[KEY_CODES[code]] = false;
}

document.onkeydown = function(e) {
	var keyCode = e.keyCode;
	if (KEY_CODES[keyCode]) {
		e.preventDefault();
		KEY_STATUS[KEY_CODES[keyCode]] = true;
		for (code in KEY_CODES) {
			if (code != keyCode)
				KEY_STATUS[KEY_CODES[code]] = false;
		}

	}
}

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