// 3dsnake.js

var WIDTH = 300;
var HEIGHT = 300;
var DOT_SIZE = 10;
var RAND_POS = 29;
var APPLE = new Object();
var SNAKE = new Object();

/* Initialize game and start it */
var game = new Game();
var FappleExists = false;
var TappleExists = false;
var SappleExists = false;

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
	this.init = function(x, y, z, w, h, d) {
		// Defualt variables
		this.x = x;
		this.y = y;
		this.z = z;
		this.width = w;
		this.height = h;
		this.depth = d;
	}

	this.speed = 0;
	this.canvasWidth = 0;
	this.canvasHeight = 0;
	
	this.draw = function() {};
	this.move = function() {};
}

function FApple() {
	this.draw = function() {
		if (!FappleExists) {
			this.context.drawImage(imageRepo.apple, this.x, this.y);
			FappleExists = true;	// Change Later!
		}
	};
}

function TApple() {
	this.draw = function() {

		if (!TappleExists) {
			this.context.drawImage(imageRepo.apple, this.x, this.z);
			TappleExists = true;	// Change Later!
		}
	};
}

function SApple() {
	this.draw = function() {
		if (!SappleExists) {
			this.context.drawImage(imageRepo.apple, this.z, this.y);
			SappleExists = true;	// Change Later!
		}
	};
}

function FSnake() {
	this.draw = function() {

		this.context.clearRect(SNAKE.x, SNAKE.y, WIDTH, HEIGHT);
		SNAKE.y -= this.speed;
		if (this.y <= 0 - this.height)
			return true;
		else
			this.context.drawImage(imageRepo.dot, this.x, this.y);
	};
}

function TSnake() {
	this.draw = function() {
		this.context.clearRect(SNAKE.x, SNAKE.z, WIDTH, HEIGHT);
		SNAKE.y -= this.speed;
		if (this.y <= 0 - this.height)
			return true;
		else
			this.context.drawImage(imageRepo.dot, this.x, this.z);
	};
}

function SSnake() {
	this.draw = function() {
		this.context.clearRect(SNAKE.z, SNAKE.y, WIDTH, HEIGHT);
		SNAKE.y -= this.speed;
		if (this.y <= 0 - this.height)
			return true;
		else
			this.context.drawImage(imageRepo.dot, this.z, this.y);
	};
}

FApple.prototype = new Drawable();
TApple.prototype = new Drawable();
SApple.prototype = new Drawable();

FSnake.prototype = new Drawable();
TSnake.prototype = new Drawable();
SSnake.prototype = new Drawable();


function updateSnake(x,y,z) {
	for (var i = 1; i < length; i++) {
		SNAKE[i].x = SNAKE[i-1].x;
		SNAKE[i].y = SNAKE[i-1].y;
		SNAKE[i].z = SNAKE[i-1].z;
	}
};

function updateApple() {
	APPLE.x = Math.Random() * RAND_POS * DOT_SIZE;
	APPLE.y = Math.Random() * RAND_POS * DOT_SIZE;
	APPLE.z = Math.Random() * RAND_POS * DOT_SIZE;
};

function checkApple() {
	if ((SNAKE.x[0] === APPLE.x) && (SNAKE.y[0] === APPLE.y) && (SNAKE.z[0] === APPLE.z)) {
		SNAKE.length++;
		updateApple();
	}
};

/**
 * Creates Game object which will hold all objects and data
 */
function Game() {

	this.init = function() {

		// initialize snake
		SNAKE.length = 3;
		for (var i = 0; i < length; i++) {
			SNAKE.x[i] = x - i * 10;
			SNAKE.y[i] = y;
			SNAKE.z[i] = z;
		}

		// initialize apple
		APPLE.x = APPLE.y = APPLE.z = WIDTH / 2;

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

			this.Fapple.init(100,30,50, 10,10,10); 
			this.Tapple.init(100,30,50, 10,10,10);
			this.Sapple.init(100,30,50, 10,10,10);

			this.Fsnake.init(100,200,90, 10,10,10);
			this.Tsnake.init(100,200,90, 10,10,10);
			this.Ssnake.init(100,200,90, 10,10,10);

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
	requestAnimFrame(animate);
	game.Fapple.draw();
	game.Tapple.draw();
	game.Sapple.draw();

	game.Fsnake.draw();
	game.Tsnake.draw();
	game.Ssnake.draw();
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