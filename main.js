import * as drawing from "./modules/drawing.js";
import * as mandelbrot from "./modules/mandelbrot.js";

const MIN_X = -2.15
const MAX_X = 1
const MIN_Y = -1.1
const MAX_Y = 1.1

const canvas = document.getElementById('canvas');
const scaledPoints = drawing.scalePixelListToAxes([canvas.width, canvas.height], [MIN_X, MAX_X, MIN_Y, MAX_Y]);
let maxIterations = 2000;
let escapeRadius = 100;
const escapeTimes = mandelbrot.EscapeTime(maxIterations, escapeRadius).calculate(scaledPoints);
const pointColours = drawing.ColourMapper('histogram').apply(escapeTimes, maxIterations);
drawing.drawPoints(pointColours, canvas);