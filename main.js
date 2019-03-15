import * as drawing from "./modules/drawing.js";
import * as mandelbrot from "./modules/mandelbrot.js";
import * as inputs from "./modules/inputs.js";

var Main = function() {
	//We keep escape times in state to allow recolouring without having to recalculate them
	let worker = new Worker('modules/mandelbrotWorker.js');
	let escapeTimes = [];
	worker.onmessage = function(e) {
		let [msgType, result, thingThatImGettingRidOf] = e.data
		switch(msgType) {
			case 'done':
				console.log("Received done message");
				escapeTimes = result;
				console.log(thingThatImGettingRidOf);
				colourAndDraw(thingThatImGettingRidOf.colours, thingThatImGettingRidOf.maxIterations);
				break;
			case 'progress':
				//console.log("Progress: " + result);
				break;
			default:
				throw Error("Invalid message type " + msgType + " recieved from mandelbrotWorker");
		}
	}

	function colourAndDraw(colours, maxIterations) {
		const canvas = document.getElementById('canvas');
		let colourMapper = drawing.ColourMapperBuilder()
								  .algorithmName('smooth')
								  .colours(colours)
								  .build();
		const pointColours = colourMapper.apply(escapeTimes, maxIterations);
		drawing.drawPoints(pointColours, canvas);
	}

	return {
		colourAndDraw: colourAndDraw,
		rerender: function(inputValues) {
			const canvas = document.getElementById('canvas');
			console.log(inputValues);
			worker.postMessage([[canvas.width, canvas.height], inputValues]);
		}
	};
}();

inputs.initialize(Main);
redrawBtn.click();