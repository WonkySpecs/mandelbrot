import * as drawing from "./modules/drawing.js";
import * as mandelbrot from "./modules/mandelbrot.js";

const originalWidth = 3;
const originalHeight = 2;

function redraw(minX, maxX, minY, maxY) {
	const canvas = document.getElementById('canvas');
	const scaledPoints = drawing.scalePixelListToAxes([canvas.width, canvas.height], [minX, maxX, minY, maxY]);
	let maxIterations = 50;
	let escapeRadius = 40;
	const escapeTimes = mandelbrot.EscapeTime(maxIterations, escapeRadius).calculate(scaledPoints);
	const pointColours = drawing.ColourMapper('smooth').apply(escapeTimes, maxIterations);
	drawing.drawPoints(pointColours, canvas);
}

var Inputs = function() {
	let calcSizesFromInputs = function() {
		let cx = parseFloat(centerXInput.value);
		let cy = parseFloat(centerYInput.value);
		let width = originalWidth / parseFloat(zoomInput.value);
		let height = originalHeight / parseFloat(zoomInput.value);
		return [cx - width / 2, cx + width / 2, cy - height / 2, cy + height / 2];
	}

	let [axesLeft, axesRight, axesTop, axesBottom] = calcSizesFromInputs();

	let bindEvents = function() {
		redrawBtn.onclick = function() {
			[axesLeft, axesRight, axesTop, axesBottom] = calcSizesFromInputs();
			redraw(axesLeft, axesRight, axesTop, axesBottom);
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