const socket = io.connect("http://localhost:3000");

socket.on('joystick', function(joystick) {
    // console.log(`Value of joystick: ${ joystick.x }, ${ joystick.y }`)
    draw(joystick); 
});

// generative art
let angle = 0;
let topHalfCircle;
let joyStickX = 0, joyStickY = 0, scaleFactor = 1, newHeight = 0;
const RADIUS = 500, MARGIN = 10;
let dayMode = true;
let circleOutlineHistory = [];
let angleHistory = [];
const MAX_RERENDER_COUNT = 2;
const MIN_JOYSTICK = -100, MAX_JOYSTICK = 100;
let rerenderCount = 0;
let joystickVals = {}, prevJoystickVals = { x: 0, y: 0 };
let currentYVal = MARGIN * 15, currStrokeWt = 5; 

setup = _ => {
	createCanvas(windowWidth, windowHeight);
	frameRate(60); 
	noLoop();
}
  
draw = (joystick) => {
	// update circle's y value based on joystick Y input 
	joystickVals = joystick;

	// update Y val of spirograph given joystick Y values
	if (joystick.y < prevJoystickVals.y && currentYVal > MARGIN * 15) {
			currentYVal -= 3;
	} else if (joystick.y > prevJoystickVals.y && currentYVal < getCenterY()) {
			currentYVal += 3;
	}
	
	// update stroke weight based on joystick X input 
	currStrokeWt = map(joystick.x, MIN_JOYSTICK, MAX_JOYSTICK, 1, 10);
	
	clear();
	noFill();

	push();
		translate(getCenterX(), getCenterY());
		rotate(angle);

		// repeat loop at most MAX_RERENDER_COUNT times
		rerenderPrevious();
		if(rerenderCount++ < MAX_RERENDER_COUNT) rendnerBaseArcs(angle); 
		angle += 1;

	pop();
}

getCenterX = _ => { return windowWidth / 2; }
getCenterY = _ => { return windowHeight / 2; }

// responsive
windowResized = _ => { resizeCanvas(windowWidth, windowHeight); }

// save frame as screenshot
keyPressed = _ => {
	if (key == 's') {
		save('animation.png');
	}	
  }

rendnerBaseArcs = (angle) => {
	push();
		rotate(angle);
		strokeWeight(5);

		// add new rotations per render
		angleHistory.push(angle);
		for(let j = 0; j < 25; j++){
			circleOutlineHistory.push(new CircleOutline('#8cadf5', '#4d59ba', MARGIN * 23, currentYVal, RADIUS + MARGIN * 2, PI, PI + 0.25, dayMode)); //0.25
		
			circleOutlineHistory.push(new CircleOutline('#46d0ef', '#5f6ac1', MARGIN * 23, currentYVal, RADIUS + MARGIN * 2, PI + 0.35, PI + 0.4, dayMode)); //+.1 -> 0.05
			circleOutlineHistory.push(new CircleOutline('#8ce2f5', '#727bc8', MARGIN * 23, currentYVal, RADIUS + MARGIN * 2, RADIUS + MARGIN * 2, PI + 0.5, PI + 1, dayMode)); //+.1 -> 0.5
	
			circleOutlineHistory.push(new CircleOutline('#f5d48c', '#e4bbbf', MARGIN * 23, currentYVal, RADIUS + MARGIN * 2, PI + 1.15, PI + 1.2, dayMode));
			circleOutlineHistory.push(new CircleOutline('#ffffff', '#e4bbbf', MARGIN * 23, currentYVal, RADIUS + MARGIN * 2, PI + 1.3, PI + 1.8, dayMode));
			circleOutlineHistory.push(new CircleOutline('#ffffff', '#e4bbbf', MARGIN * 23, currentYVal, RADIUS + MARGIN * 2, PI + 1.9, PI + 2.15, dayMode));
	
			circleOutlineHistory.push(new CircleOutline('#a3e8f7', '#bbbfe4', MARGIN * 23, currentYVal, RADIUS + MARGIN * 2, PI + 2.25, PI + 2.3, dayMode));
			circleOutlineHistory.push(new CircleOutline('#f5ee8c', '#e0e1f2', MARGIN * 23, currentYVal, RADIUS + MARGIN * 2, PI + 2.4, PI + 2.9, dayMode));
			circleOutlineHistory.push(new CircleOutline('#f5d48c', '#e4bbbf', MARGIN * 23, currentYVal, RADIUS + MARGIN * 2, PI + 3, PI + 3.15, dayMode));
		}
	pop();
}

// render previous screens
rerenderPrevious = _ => {
	circleOutlineHistory.forEach(circleOutline => {
		angleHistory.forEach(angle => {
			rotate(angle);
		});
		
		circleOutline.setStrokeWt(currStrokeWt);
		circleOutline.setY(currentYVal);
		circleOutline.setColorMode((joystickVals.x >= 5) ? true : false);
		
		// circle(getCenterX() / 2, currentYVal, 5);
		
		circleOutline.render();
	});
}

class CircleOutline {
	// instatiates arc object  
	constructor(dayColor, nightColor, x, y, radius, startAngle, endAngle, dayMode) { 
		this.color = dayMode ? dayColor : nightColor;
		this.dayColor = dayColor;
		this.nightColor = nightColor;
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.startAngle = startAngle;
		this.endAngle = endAngle;

		// default weight
		this.strokeWeight = 5; 

		this.render();
	}

	// renders arc
	render() {
		strokeWeight(this.strokeWt);
		stroke(this.color);
		// stroke(random(1, 10) <= 3 ? this.dayColor : this.nightColor);
		arc(this.x, this.y, this.radius, this.radius, this.startAngle, this.endAngle);
	}

	setY(y) {
		this.y = y;
	}

	setStrokeWt(wt) {
		this.strokeWt = wt;
	}
	
	setColorMode(nightMode) {
		if(nightMode) {
			this.color = this.nightColor; 
		} else {
			this.color = this.dayColor;
		}
	}
}