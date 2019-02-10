import * as drawing from "./modules/drawing.js";
import * as mandelbrot from "./modules/mandelbrot.js";

const originalWidth = 3;
const originalHeight = 2;
const maxIterations = 64

var Main = function() {
	let escapeTimes = [];
	let calculatePoints = function(minX, maxX, minY, maxY) {
		const canvas = document.getElementById('canvas');
		const scaledPoints = drawing.scalePixelListToAxes([canvas.width, canvas.height], [minX, maxX, minY, maxY]);
		let escapeRadius = 100;
		return mandelbrot.EscapeTime(maxIterations, escapeRadius).calculate(scaledPoints);
	}

	return {
		colourAndDraw: function(noEscapeColour, c1, c2) {
			const canvas = document.getElementById('canvas');
			const pointColours = drawing.ColourMapper('smooth', noEscapeColour).apply(escapeTimes, maxIterations);
			drawing.drawPoints(pointColours, canvas);
		},

		rerenderAll: function([minX, maxX, minY, maxY], [noEscapeColour, c1, c2]) {
			escapeTimes = calculatePoints(minX, maxX, minY, maxY);
			this.colourAndDraw(noEscapeColour, c1, c2);
		}
	};
}();

var Inputs = function() {
	let calcSizesFromInputs = function() {
		let cx = parseFloat(centerXInput.value);
		let cy = parseFloat(centerYInput.value);
		let width = originalWidth / parseFloat(zoomInput.value);
		let height = originalHeight / parseFloat(zoomInput.value);
		return [cx - width / 2, cx + width / 2, cy - height / 2, cy + height / 2];
	}

	let [axesLeft, axesRight, axesTop, axesBottom] = calcSizesFromInputs();
	let noEscapeColour = [140, 0, 200];

	let bindEvents = function() {
		redrawBtn.onclick = function() {
			[axesLeft, axesRight, axesTop, axesBottom] = calcSizesFromInputs();
			Main.rerenderAll([axesLeft, axesRight, axesTop, axesBottom], [noEscapeColour, 123, 321]);
		};

		canvas.onmousemove = function(e) {
			let canvas = document.getElementById('canvas');
			let canvasRect = canvas.getBoundingClientRect();
			let mouseX = e.clientX - canvasRect.left;
			let mouseY = e.clientY - canvasRect.top;
			canvasMouseX.value = axesLeft + mouseX / canvas.width * (axesRight - axesLeft);
			canvasMouseY.value = axesBottom + mouseY / canvas.height * (axesTop - axesBottom);
		}

		canvas.onclick = function(e) {
			centerXInput.value = canvasMouseX.value;
			centerYInput.value = canvasMouseY.value;
		}

		noEscapeColourInput.onchange = function(e) {
			noEscapeColour = hexToRgb(noEscapeColourInput.value);
			Main.colourAndDraw(noEscapeColour, 123, 321);
		}
	}
	return {
		initialize: function() {
			centerXInput.value = -0.5;
			centerYInput.value = 0;
			zoomInput.value = 1;
			bindEvents();
		}
	}
}();

Inputs.initialize();
redrawBtn.click();

function hexToRgb(hex) {
	var bigint = parseInt(hex.substring(1), 16);
	var r = (bigint >> 16) & 255;
	var g = (bigint >> 8) & 255;
	var b = bigint & 255;

	return [r, g, b];
}