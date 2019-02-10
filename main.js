import * as drawing from "./modules/drawing.js";
import * as mandelbrot from "./modules/mandelbrot.js";
import * as inputs from "./modules/inputs.js";

const maxIterations = 64

var Main = function() {
	let escapeTimes = [];
	let calculatePoints = function(minX, maxX, minY, maxY) {
		const canvas = document.getElementById('canvas');
		const scaledPoints = drawing.scalePixelListToAxes([canvas.width, canvas.height], [minX, maxX, minY, maxY]);
		let escapeRadius = 100;
		return mandelbrot.EscapeTime(maxIterations, escapeRadius).calculate(scaledPoints);
	}

	return {
		colourAndDraw: function(noEscapeColour, c1, c2) {
			const canvas = document.getElementById('canvas');
			const pointColours = drawing.ColourMapper('smooth', noEscapeColour).apply(escapeTimes, maxIterations);
			drawing.drawPoints(pointColours, canvas);
		},

		rerenderAll: function([minX, maxX, minY, maxY], [noEscapeColour, c1, c2]) {
			escapeTimes = calculatePoints(minX, maxX, minY, maxY);
			this.colourAndDraw(noEscapeColour, c1, c2);
		}
	};
}();

inputs.initialize(Main);
redrawBtn.click();