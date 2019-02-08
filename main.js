import * as drawing from "./drawing.js";
import * as mandelbrot from "./mandelbrot.js";

const CANVAS_WIDTH = 1000
const CANVAS_HEIGHT = 640

const MIN_X = -2.15
const MAX_X = 1
const MIN_Y = -1.1
const MAX_Y = 1.1

const scaledPoints = drawing.scalePixelListToAxes([CANVAS_WIDTH, CANVAS_HEIGHT], [MIN_X, MAX_X, MIN_Y, MAX_Y]);
const pointColours = mandelbrot.calcPointColours()
const canvas = document.getElementById('canvas');
drawing.drawPoints(pointColours, canvas);