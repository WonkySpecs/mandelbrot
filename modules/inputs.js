export { initialize };

import { hexStringToRgb } from "./utils.js"

let ColourInputHandler = function() {
	const MAX_COLOURS = 10
	const MIN_COLOURS = 3;
	let colourInputControls = [document.getElementById("noEscapeColour"),
							   document.getElementById("latestEscapeColour"),
							   document.getElementById("earliestEscapeColour")];
	return {
		newColourEvent: function(callback) {
			if(colourInputControls.length < MAX_COLOURS) {
				let newControl = buildColourInput(colourInputControls.length, callback);
				const controlDiv = document.getElementById("colourControlInputs");
				controlDiv.insertBefore(newControl, earliestEscapeColour);
				renameColourInputs();
				colourInputControls.push(newControl);
			}
		},
		calculateColours: calculateColours
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
		parent.id = "colour" + inputNumber;
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
		for(let i = MIN_COLOURS; i < colourInputControls.length; i++) {
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
		for(let i = MIN_COLOURS; i < colourInputControls.length; i++) {
			let control = colourInputControls[i];
			control.id = "colour" + i;
			let label = control.getElementsByTagName("label")[0];
			label.innerHTML = "Colour " + i + ":";
		}
	}

	function calculateColours() {
		return colourInputControls.map(function(control) {
			let input = control.getElementsByTagName("input")[0];
			return hexStringToRgb(input.value);
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
			main.colourAndDraw(ColourInputHandler.calculateColours());
		}
	});

	addColourBtn.onclick = (() => ColourInputHandler.newColourEvent(main.colourAndDraw));
}

function initialize(main) {
	centerXInput.value = -0.5;
	centerYInput.value = 0;
	zoomInput.value = 1;
	bindEvents(main);
}