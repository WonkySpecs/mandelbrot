export { initialize };

import { hexStringToRgb } from "./utils.js"

const originalWidth = 3;
const originalHeight = 2;

let calcSizesFromInputs = function() {
	let cx = parseFloat(centerXInput.value);
	let cy = parseFloat(centerYInput.value);
	let width = originalWidth / parseFloat(zoomInput.value);
	let height = originalHeight / parseFloat(zoomInput.value);
	return [cx - width / 2, cx + width / 2, cy - height / 2, cy + height / 2];
}

let [axesLeft, axesRight, axesTop, axesBottom] = calcSizesFromInputs();
let noEscapeColour = [0, 0, 0];
let earliestEscapeColour = [48, 48, 48];
let latestEscapeColour = [255, 255, 255];

let bindEvents = function(main) {
	redrawBtn.onclick = function() {
		[axesLeft, axesRight, axesTop, axesBottom] = calcSizesFromInputs();
		main.rerender([axesLeft, axesRight, axesTop, axesBottom], [noEscapeColour, earliestEscapeColour, latestEscapeColour]);
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
		noEscapeColour = hexStringToRgb(noEscapeColourInput.value);
		main.colourAndDraw([noEscapeColour, earliestEscapeColour, latestEscapeColour]);
	}

	earliestEscapeColourInput.onchange = function(e) {
		earliestEscapeColour = hexStringToRgb(earliestEscapeColourInput.value);
		main.colourAndDraw([noEscapeColour, earliestEscapeColour, latestEscapeColour]);
	}

	latestEscapeColourInput.onchange = function(e) {
		latestEscapeColour = hexStringToRgb(latestEscapeColourInput.value);
		main.colourAndDraw([noEscapeColour, earliestEscapeColour, latestEscapeColour]);
	}
}

function initialize(main) {
	centerXInput.value = -0.5;
	centerYInput.value = 0;
	zoomInput.value = 1;
	bindEvents(main);
}