import * as drawing from "./modules/drawing.js";
import * as mandelbrot from "./modules/mandelbrot.js";
import * as inputs from "./modules/inputs.js";

var Main = function() {
	//We keep escape times in state to allow recolouring without having to recalculate them
	let escapeTimes = [];
	let calculateEscapeTimes = function(inputValues) {
		const canvas = document.getElementById('canvas');
		const scaledPoints = drawing.scalePixelListToAxes([canvas.width, canvas.height], inputValues.axesBounds);
		let escapeTimeCalculator = mandelbrot.EscapeTimeCalculatorBuilder()
											 .maxIterations(inputValues.maxIterations)
											 .escapeRadius(inputValues.escapeRadius)
											 .build();
		return escapeTimeCalculator.applyTo(scaledPoints);
	}

	return {
		colourAndDraw: function(colours, maxIterations) {
			const canvas = document.getElementById('canvas');
			
			let colourMapper = drawing.ColourMapperBuilder()
									  .algorithmName('smooth')
									  .colours(colours)
									  .build();
			const pointColours = colourMapper.apply(escapeTimes, maxIterations);
			drawing.drawPoints(pointColours, canvas);
		},

		rerender: function(inputValues) {
			escapeTimes = calculateEscapeTimes(inputValues);
			this.colourAndDraw(inputValues.colours, inputValues.maxIterations);
		}
	};
}();

inputs.initialize(Main);
redrawBtn.click();