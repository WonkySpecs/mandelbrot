export { scalePixelListToAxes, drawPoints, ColourMapper };

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

var ColourMapper = function(algorithmName) {
	var basic = function(escapeTimes, maxIterations) {
		let colours = [];
		escapeTimes.forEach(function(timesRow) {
			let colourRow = [];
			timesRow.forEach(function([escapeTime, _]) {
				let colour = escapeTime / maxIterations * 255;
				colourRow.push([colour, colour, colour]);
			});
			colours.push(colourRow);
		});
		return colours;
	}

	var histogram = function(escapeTimes, maxIterations) {
		let histogram = [];
		histogram.length = maxIterations;
		histogram.fill(0);
		escapeTimes.forEach(function(timesRow) {
			timesRow.forEach(function([escapeTime, _]) {
				histogram[escapeTime - 1] += 1;
			});
		});
		const total = histogram.reduce((x, y) => x + y, 0);
		let coloursMap = [];
		let tempCount = 0;
		histogram.forEach(function(count) {
			coloursMap.push(255 * (tempCount + count) / total);
			tempCount += count;
		});

		let colours = [];
		escapeTimes.forEach(function(timesRow) {
			let colourRow = [];
			timesRow.forEach(function([escapeTime, _]) {
				let colour = coloursMap[escapeTime - 1];
				colourRow.push([colour, colour, colour]);
			});
			colours.push(colourRow);
		});
		return colours;
	}

	var smooth = function(escapeTimes, maxIterations) {
		let colours = [];
		let maxMu = 0;
		escapeTimes.forEach(function(timesRow) {
			let colourRow = [];
			timesRow.forEach(function([escapeTime, finalZ]) {
				let colour = 0;
				if(escapeTime == maxIterations) {
					colourRow.push([0, 0, 0]);
				} else {
					let logMod = Math.log(finalZ[0] ** 2 + finalZ[1] ** 2) / 2;
					let mu = Math.log(logMod / Math.log(2)) / Math.log(2);
					let scaledEscapeTime = escapeTime + 1 - mu;
					colour = scaledEscapeTime / maxIterations * 255;
					colourRow.push([255 - colour, 255 - colour, 255 - colour]);
				}
			});
			colours.push(colourRow);
		});
		return colours;
	}

	function selectAlgorithm(algorithmName) {
		switch(algorithmName) {
			case 'basic':
				return basic;
			case 'histogram':
				return histogram
			case 'smooth':
				return smooth;
			default:
				throw "'" + algorithmName + "' is not a valid algorithm for colour mapper";
		}
	}

	const algorithm = selectAlgorithm(algorithmName);
	return {
		apply: algorithm,
	};
}