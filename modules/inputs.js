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
let colourInputs = [document.getElementById("noEscapeColour"),
					document.getElementById("latestEscapeColour"),
					document.getElementById("earliestEscapeColour")];

let bindEvents = function(main) {
	redrawBtn.onclick = function() {
		[axesLeft, axesRight, axesTop, axesBottom] = calcSizesFromInputs();
		main.rerender([axesLeft, axesRight, axesTop, axesBottom], calculateColours());
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

	const colourInputElements = document.querySelectorAll('input[type="color"]');
	colourInputElements.forEach(function(element) {
		element.onchange = function(event) {
			main.colourAndDraw(calculateColours());
		}
	});

	addColourBtn.onclick = function(e) {
		if(colourInputs.length < 10) {
			let newControl = buildColourInput(colourInputs.length, main.colourAndDraw);
			const controlDiv = document.getElementById("colourControls");
			controlDiv.insertBefore(newControl, addColourBtn);
			renameColourInputs();
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

function buildColourInput(inputNumber, callback) {
	let label = document.createElement("label");
	label.innerHTML = "Colour " + inputNumber + ":";

	let input = document.createElement("input");
	input.type = "color";
	input.onchange = function(e) {
		callback(calculateColours());
	}

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
	for(let i = 3; i < colourInputs.length; i++) {
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
	for(let i = 3; i < colourInputs.length; i++) {
		let control = colourInputs[i];
		control.id = "colourInput" + i;
		let label = control.getElementsByTagName("label")[0];
		label.innerHTML = "Colour " + i + ":";
	}
}

function calculateColours() {
	return colourInputs.map(function(control) {
		let input = control.getElementsByTagName("input")[0];
		return hexStringToRgb(input.value);
	});
}