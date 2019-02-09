import * as drawing from "./modules/drawing.js";
import * as mandelbrot from "./modules/mandelbrot.js";

centerXInput.value = -0.5;
centerYInput.value = 0;
zoomInput.value = 1;
const originalWidth = 3;
const originalHeight = 2;

redrawBtn.onclick = function() {
	redraw(calcSizesFromInputs());
};

function calcSizesFromInputs() {
	let cx = parseFloat(centerXInput.value);
	let cy = parseFloat(centerYInput.value);
	let width = originalWidth / parseFloat(zoomInput.value);
	let height = originalHeight / parseFloat(zoomInput.value);
	return [cx - width / 2, cx + width / 2, cy - height / 2, cy + height / 2];
}

function redraw([minX, maxX, minY, maxY]) {
	const canvas = document.getElementById('canvas');
	const scaledPoints = drawing.scalePixelListToAxes([canvas.width, canvas.height], [minX, maxX, minY, maxY]);
	let maxIterations = 50;
	let escapeRadius = 40;
	const escapeTimes = mandelbrot.EscapeTime(maxIterations, escapeRadius).calculate(scaledPoints);
	const pointColours = drawing.ColourMapper('smooth').apply(escapeTimes, maxIterations);
	drawing.drawPoints(pointColours, canvas);
}