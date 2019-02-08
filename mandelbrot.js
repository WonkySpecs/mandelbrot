const CANVAS_WIDTH = 1000
const CANVAS_HEIGHT = 640

const MIN_X = -2.15
const MAX_X = 1
const MIN_Y = -1.1
const MAX_Y = 1.1

var ColourMapper = (function() {
	return {
		apply: function(iterations, max_iterations) {
			let colour = iterations / max_iterations * 255;
			return [colour, colour, colour];
		}
	};
})();

var Mandelbrot = (function() {
	var iterationsToEscape = function(point, max_iterations) {
		let counter = 0;
		let r = point[0];
		let i = point[1];
		let z = [r, i];
		while(counter < max_iterations) {
			z = apply_f(z, point);
			if(z[0] ** 2 + z[1] ** 2 > 4) {
				return counter;
			}
			counter += 1;
		}
		return max_iterations;
	}

	var apply_f = function(z, c) {
		return complex_add(complex_square(z), c);
	}

	var complex_square = function(c) {
		let a = c[0];
		let b = c[1];
		return [a ** 2 - b ** 2, 2 * a * b];
	}

	var complex_add = function(c1, c2) {
		return [c1[0] + c2[0], c1[1] + c2[1]];
	}

	return { 
		calcPointColours: function(points, colourMapper) {
			colours = [];
			max_iterations = 100;
			points.forEach(function(point_row) {
				colour_row = [];
				point_row.forEach(function(point) {
					let it = iterationsToEscape(point, max_iterations);
					let colour = colourMapper.apply(it, max_iterations);
					colour_row.push(colour);
				});
				colours.push(colour_row);
			});
			return colours;
		}};
})();

var Drawing = (function() {
	return {
		drawPoints: function(point_colours, canvas) {
			const ctx = canvas.getContext('2d');
			var imageData = ctx.createImageData(CANVAS_WIDTH, CANVAS_HEIGHT);
			arr_i = 0

			point_colours.forEach(function(colour_row) {
				colour_row.forEach(function(colour) {
					imageData.data[arr_i] = colour[0];		//r
					imageData.data[arr_i + 1] = colour[1];	//g
					imageData.data[arr_i + 2] = colour[2];	//b
					imageData.data[arr_i + 3] = 255			//alpha
					arr_i += 4
				});
			});

			ctx.putImageData(imageData, 0, 0);
		},
		scalePixelListToAxes: function(canvas_size, axes_size) {
			var [max_pixel_x, max_pixel_y] = canvas_size;
			var [min_axes_x, max_axes_x, min_axes_y, max_axes_y] = axes_size;
			var axes_width = max_axes_x - min_axes_x;
			var axes_height = max_axes_y - min_axes_y;
			scaledPixels = [];
			for (var y = 0; y < max_pixel_y; y++) {
				row = [];
				for (var x = 0; x < max_pixel_x; x++) {
					row.push([(x / max_pixel_x) * axes_width + min_axes_x, (y / max_pixel_y) * axes_height + min_axes_y]);
				}
				scaledPixels.push(row)
			}
			return scaledPixels;
		}
	};
})();

const scaledPoints = Drawing.scalePixelListToAxes([CANVAS_WIDTH, CANVAS_HEIGHT], [MIN_X, MAX_X, MIN_Y, MAX_Y]);
const pointColours = Mandelbrot.calcPointColours(scaledPoints, ColourMapper)
const canvas = document.getElementById('canvas');
Drawing.drawPoints(pointColours, canvas);