var EscapeTimeCalculator = function (maxIterations, escapeRadius) {
	var escapeTime = function(point) {
		let counter = 0;
		let r = point[0];
		let i = point[1];
		let z = [r, i];
		while(counter < maxIterations && !(z[0] ** 2 + z[1] ** 2 > escapeRadius)) {
			z = f(z, point);
			counter += 1;
		}
		return [counter, z];
	}

	var f = function(z, c) {
		return complexAdd(complexSquare(z), c);
	}

	var complexSquare = function(c) {
		let a = c[0];
		let b = c[1];
		return [a ** 2 - b ** 2, 2 * a * b];
	}

	var complexAdd = function(c1, c2) {
		return [c1[0] + c2[0], c1[1] + c2[1]];
	}

	function* calcEscapeTimes(points) {
		let times = [];
		let counter = 0;
		for(let i = 0; i < points.length; i++) {
			let timesRow = [];
			for(let j = 0; j < points[i].length; j++) {
				timesRow.push(escapeTime(points[i][j]));
			}
			times.push(timesRow);
			counter++;
			yield counter;
		}
		return times;
	}
	return {
		applyTo: calcEscapeTimes
	}
}

var EscapeTimeCalculatorBuilder = function() {
	var maxIter = 50;
	var escapeR = 50;
	var fPower = 2;		//Unused until I figure out how to implement complex exponentiation properly
	return {
		maxIterations: function(mi) {
			maxIter = mi;
			return this;
		},
		escapeRadius: function(er) {
			escapeR = er;
			return this;
		},
		build: function() {
			return EscapeTimeCalculator(maxIter, escapeR);
		}
	};
};

function scalePixelListToAxes(canvas_size, axes_size) {
	var [max_pixel_x, max_pixel_y] = canvas_size;
	var [min_axes_x, max_axes_x, min_axes_y, max_axes_y] = axes_size;
	var axes_width = max_axes_x - min_axes_x;
	var axes_height = max_axes_y - min_axes_y;
	let scaledPixels = [];
	for (var y = 0; y < max_pixel_y; y++) {
		let row = [];
		for (var x = 0; x < max_pixel_x; x++) {
			row.push([(x / max_pixel_x) * axes_width + min_axes_x, max_axes_y - (y / max_pixel_y) * axes_height]);
		}
		scaledPixels.push(row)
	}
	return scaledPixels;
}