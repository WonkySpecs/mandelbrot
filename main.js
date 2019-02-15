import * as drawing from "./modules/drawing.js";
import * as mandelbrot from "./modules/mandelbrot.js";
import * as inputs from "./modules/inputs.js";

const maxIterations = 64

var Main = function() {
	//We keep escape times in state to allow recolouring without having to recalculate them
	let escapeTimes = [];
	let calculateEscapeTimes = function(minX, maxX, minY, maxY) {
		const canvas = document.getElementById('canvas');
		const scaledPoints = drawing.scalePixelListToAxes([canvas.width, canvas.height], [minX, maxX, minY, maxY]);
		let escapeRadius = 100;
		let escapeTimeCalculator = mandelbrot.EscapeTimeCalculatorBuilder()
											 .maxIterations(maxIterations)
											 .escapeRadius(escapeRadius)
											 .build();
		return escapeTimeCalculator.applyTo(scaledPoints);
	}

	return {
		colourAndDraw: function(colours) {
			const canvas = document.getElementById('canvas');
			
			let colourMapper = drawing.ColourMapperBuilder()
									  .algorithmName('smooth')
									  .colours(colours)
									  .build();
			const pointColours = colourMapper.apply(escapeTimes, maxIterations);
			drawing.drawPoints(pointColours, canvas);
		},

		rerender: function([minX, maxX, minY, maxY], colours) {
			escapeTimes = calculateEscapeTimes(minX, maxX, minY, maxY);
			this.colourAndDraw(colours);
		}
	};
}();

inputs.initialize(Main);
redrawBtn.click();