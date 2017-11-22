var inc = 0.01;
var scl = 2;
var cols, rows;

var zoff = 0;

var fr;

var particles = [];

var flowField;


function setup() {
	fr = createP('')
	createCanvas(700, 700);
	background(255);
	cols = floor(width / scl);
	rows = floor(height / scl);
	stroke(0, 50);
	flowField = new Array(cols * rows);

	for (var i = 0; i < 200; i++) {
		particles[i] = new Particle();
	}
}

function Particle() {
	this.pos = createVector(random(width), random(height));
	this.vel = createVector(0, 0);
	this.acc = createVector(0, 0);
	this.maxspeed = 5;
	// var c = color(255, 204, 0);
	stroke(0, 10);
	strokeWeight(12);
	// fill(c);

	this.prevPos = this.pos.copy();

	this.follow = function(vectors) {
		var x = floor(this.pos.x / scl);
		var y = floor(this.pos.y / scl);
		var index = x + y * cols;
		var force = vectors[index];
		this.applyForce(force);
	}

	this.update = function() {
		this.vel.add(this.acc);
		this.vel.limit(this.maxspeed);
		this.pos.add(this.vel);
		this.acc.mult(0);
	}

	this.applyForce = function(force) {
		this.acc.add(force);
	}

	this.show = function() {
		point(this.pos.x, this.pos.y);
		// line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
		this.updatePrev();
	}

	this.updatePrev = function() {
		this.prevPos.x = this.pos.x;
		this.prevPos.y = this.pos.y;
	}

	this.edges = function() {
		if (this.pos.x > width - 1) {
			this.pos.x = 0;
			this.updatePrev();
		}
		if (this.pos.x < 0) {
			this.pos.x = width - 1;
			this.updatePrev();
		}
		if (this.pos.y > height - 1) {
			this.pos.y = 0;
			this.updatePrev();
		}
		if (this.pos.y < 0) {
			this.pos.y = height - 1;
			this.updatePrev();
		}
	}
}

function draw() {
	var yoff = 0;
	for (var y = 0; y < rows; y++) {
		var xoff = 0;
		for (var x = 0; x < cols; x++) {
			var index = (x + y * cols);
			var angle = noise(xoff, yoff, zoff) * TWO_PI * 3;
			var v = p5.Vector.fromAngle(angle);
			v.setMag(1);
			flowField[index] = v;
			xoff += inc;
			// push();
			// translate(x * scl, y * scl);
			// rotate(v.heading());
			// strokeWeight(1);
			// line(0, 0, scl, 0);
			// pop();
		}
		yoff += inc;
		zoff += 0.0001;
	}


	for (var i = 0; i < particles.length; i++) {
		particles[i].follow(flowField);
		particles[i].update();
		particles[i].edges();
		particles[i].show();
	}
	fr.html(floor(frameRate()));
}
