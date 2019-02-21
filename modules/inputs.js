export { initialize };

import { hexStringToRgb } from "./utils.js"

let ColourInputHandler = function() {
	const MAX_COLOURS = 10
	const NUM_FIXED_COLOUR_INPUTS = 3;
	let colourInputControls = [document.getElementById("noEscapeColour"),
							   document.getElementById("latestEscapeColour"),
							   document.getElementById("earliestEscapeColour")];
	return {
		newColourEvent: function(callback) {
			if(colourInputControls.length < MAX_COLOURS) {
				let newControl = buildColourInput(colourInputControls.length - NUM_FIXED_COLOUR_INPUTS, callback);
				const controlDiv = document.getElementById("colourControlInputs");
				controlDiv.insertBefore(newControl, earliestEscapeColour);
				renameColourInputs();
				colourInputControls.push(newControl);
			}
		},
		calculateColours: calculateColours
	}

	function buildColourInput(inputIdNumber, callback) {
		let label = document.createElement("label");
		label.innerHTML = "Colour " + (inputIdNumber + 1) + ":";

		let input = document.createElement("input");
		input.type = "color";
		input.onchange = function(e) {
			callback(calculateColours());
		}

		let deleteBtn = document.createElement("button");
		deleteBtn.innerHTML = "-";

		const parent = document.createElement("span")
		parent.id = "colour" + inputIdNumber;
		parent.appendChild(label);
		parent.appendChild(input);
		parent.appendChild(deleteBtn);

		deleteBtn.onclick = function() {
			removeColourInput(parent);
			renameColourInputs();
			callback(calculateColours());
			parent.remove();
		};
		return parent;
	}

	function removeColourInput(toRemove) {
		let toRemoveIndex;
		for(let i = NUM_FIXED_COLOUR_INPUTS; i < colourInputControls.length; i++) {
			if(colourInputControls[i].id === toRemove.id) {
				toRemoveIndex = i;
				break;
			}
		}
		if(toRemoveIndex != -1) {
			colourInputControls.splice(toRemoveIndex, 1);
		} else {
			throw "Could not find colour input " + toRemove;
		}
	}

	function renameColourInputs() {
		for(let i = NUM_FIXED_COLOUR_INPUTS; i < colourInputControls.length; i++) {
			let control = colourInputControls[i];
			control.id = "colour" + (i - NUM_FIXED_COLOUR_INPUTS);
			let label = control.getElementsByTagName("label")[0];
			label.innerHTML = "Colour " + (i - NUM_FIXED_COLOUR_INPUTS + 1) + ":";
		}
	}

	function calculateColours() {
		return colourInputControls.map(function(control) {
			let input = control.getElementsByTagName("input")[0];
			const label = control.id;
			return {label: control.id, value: hexStringToRgb(input.value)};
		});
	}
}();


let Sizes = function() {
	const originalWidth = 3;
	const originalHeight = 2;
	let lastCalculatedAxesBounds;
	let canvasRect = document.getElementById('canvas').getBoundingClientRect();

	let calculateAxesBounds = function() {
		let cx = parseFloat(centerXInput.value);
		let cy = parseFloat(centerYInput.value);
		let width = originalWidth / parseFloat(zoomInput.value);
		let height = originalHeight / parseFloat(zoomInput.value);
		lastCalculatedAxesBounds = [cx - width / 2, cx + width / 2, cy - height / 2, cy + height / 2]
		return lastCalculatedAxesBounds;
	}

	return {
		calculateAxesBounds: calculateAxesBounds,
		getCachedAxesBounds: () => lastCalculatedAxesBounds,
		getCanvasRect: () => canvasRect
	};
}();


let bindEvents = function(main) {
	redrawBtn.onclick = function() {
		main.rerender({ axesBounds: Sizes.calculateAxesBounds(),
						maxIterations: maxIterationsInput.value,
						escapeRadius: escapeRadiusInput.value,
						colours: ColourInputHandler.calculateColours()});
	};

	canvas.onmousemove = function(e) {
		let canvasRect = Sizes.getCanvasRect();
		let mouseX = e.clientX - canvasRect.left;
		let mouseY = e.clientY - canvasRect.top;
		let [axesLeft, axesRight, axesTop, axesBottom] = Sizes.getCachedAxesBounds();
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
			main.colourAndDraw(ColourInputHandler.calculateColours(), maxIterationsInput.value);
		}
	});

	addColourBtn.onclick = (() => ColourInputHandler.newColourEvent((colours) => main.colourAndDraw(colours, maxIterationsInput.value)));
}

function initialize(main) {
	centerXInput.value = -0.5;
	centerYInput.value = 0;
	zoomInput.value = 1;
	maxIterationsInput.value = 50;
	escapeRadiusInput.value = 100;
	bindEvents(main);
}