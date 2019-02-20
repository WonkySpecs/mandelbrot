export { scalePixelListToAxes, drawPoints, ColourMapperBuilder };

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

function drawPoints(point_colours, canvas) {
	const ctx = canvas.getContext('2d');
	var imageData = ctx.createImageData(canvas.width, canvas.height);
	let arr_i = 0

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
}

var ColourMapper = function(algorithm) {
	return {
		apply: algorithm,
	};
}

var ColourMappingAlgorithm = function(algorithmName, colours) {
	var basic = function([escapeTime, _], maxIterations) {
		return noEscape(escapeTime, maxIterations) || interpolateColour(escapeTime, maxIterations);
	}

	var smooth = function([escapeTime, finalZ], maxIterations) {
		return noEscape(escapeTime, maxIterations) || function() {
			let logMod = Math.log(finalZ[0] ** 2 + finalZ[1] ** 2) / 2;
			let mu = Math.log(logMod / Math.log(2)) / Math.log(2);
			let scaledEscapeTime = escapeTime + 1 - mu;
			return interpolateColour(scaledEscapeTime, maxIterations);
		}();
	}

	function noEscape(escapeTime, maxIterations) {
		if(escapeTime >= maxIterations) {
			return noEscapeColour;
		}
		return false;
	}

	function interpolateColour(value, maxValue) {
		return earliestEscapeColour.map(function(item, index) {
			let fractionalColour = value / maxValue * colourDiffs[index];
			return item + fractionalColour
		});
	}

	const [noEscapeColour, latestEscapeColour, earliestEscapeColour] = colours;
	const colourDiffs = earliestEscapeColour.map(function(item, index) {
		return latestEscapeColour[index] - item;
	});

	var algorithm = function(escapeTimes, maxIterations) {
		let colours = [];
		escapeTimes.forEach(function(timesRow) {
			let colourRow = [];
			timesRow.forEach(function(escapeInfo) {
				colourRow.push(calculatePixelColour(escapeInfo, maxIterations));
			});
			colours.push(colourRow);
		});
		return colours;
	}

	function selectAlgorithm(algorithmName) {
		switch(algorithmName) {
			case 'basic':
				return basic;
			case 'smooth':
				return smooth;
			default:
				throw "'" + algorithmName + "' is not a valid algorithm for colour mapper";
		}
	}

	const calculatePixelColour = selectAlgorithm(algorithmName);
	return algorithm;
}

var ColourMapperBuilder = function() {
	let algName = "smooth";
	let cols = [[0, 0, 0], [0, 0, 0], [255, 255, 255]];
	return {
		algorithmName: function(an) {
			algName = an;
			return this;
		},
		colours: function(c) {
			cols = c;
			return this;
		},
		build: function() {
			return ColourMapper(ColourMappingAlgorithm(algName, cols));
		}
	}
}