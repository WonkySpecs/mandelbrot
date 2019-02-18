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
let colourInputs = [];

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

	addColourBtn.onclick = function(e) {
		if(colourInputs.length < 10) {
			let newControl = buildColourInput(colourInputs.length);
			const controlDiv = document.getElementById("colourControls");
			controlDiv.insertBefore(newControl, addColourBtn);
			colourInputs.push(newControl);
		}
	}
}

function initialize(main) {
	centerXInput.value = -0.5;
	centerYInput.value = 0;
	zoomInput.value = 1;
	bindEvents(main);
}

function buildColourInput(inputNumber) {
	let label = document.createElement("label");
	label.innerHTML = "Colour " + inputNumber + ":";
	let input = document.createElement("input");
	input.type = "color";
	let deleteBtn = document.createElement("button");
	deleteBtn.innerHTML = "-";
	const parent = document.createElement("span")
	parent.id = "colourInput" + inputNumber;
	parent.appendChild(label);
	parent.appendChild(input);
	parent.appendChild(deleteBtn);
	deleteBtn.onclick = function() {
		removeColourInput(parent);
		renameColourInputs()
		parent.remove();
	};
	return parent;
}

function removeColourInput(toRemove) {
	let toRemoveIndex;
	for(let i = 0; i < colourInputs.length; i++) {
		if(colourInputs[i].id === toRemove.id) {
			toRemoveIndex = i;
			break;
		}
	}
	if(toRemoveIndex != -1) {
		colourInputs.splice(toRemoveIndex, 1);
	} else {
		throw "Could not find colour input " + toRemove;
	}
}

function renameColourInputs() {
	for(let i = 0; i < colourInputs.length; i++) {
		let control = colourInputs[i];
		control.id = "colourInput" + i;
		let label = control.childNodes[0];
		label.innerHTML = "Colour " + i + ":";
	}
}