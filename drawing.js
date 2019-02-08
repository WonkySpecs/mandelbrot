export { scalePixelListToAxes, drawPoints, ColourMapper };

function scalePixelListToAxes(canvas_size, axes_size) {
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

function drawPoints(point_colours, canvas) {
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
}

var ColourMapper = (function() {
	return {
		apply: function(iterations, max_iterations) {
			let colour = iterations / max_iterations * 255;
			return [colour, colour, colour];
		}
	};
})();