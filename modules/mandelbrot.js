export { calcPointColours }

var escapeTime = function(point, maxIterations) {
	let counter = 0;
	let r = point[0];
	let i = point[1];
	let z = [r, i];
	while(counter < maxIterations && !(z[0] ** 2 + z[1] ** 2 > 4)) {
		z = apply_f(z, point);
		counter += 1;
	}
	return [counter, z];
}

var iterationsToEscape = function(point, maxIterations) {
	return escapeTime(point, maxIterations)[0];
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

function calcPointColours(points, colourMapping) {
	let colours = [];
	let maxIterations = 100;
	points.forEach(function(point_row) {
		let colour_row = [];
		point_row.forEach(function(point) {
			if(colourMapping.apply.length == 2) {
				let it = iterationsToEscape(point, maxIterations);
				let colour = colourMapping.apply(it, maxIterations);
				colour_row.push(colour);
			} else {
				let [it, z_it] = escapeTime(point, maxIterations);
				let colour = colourMapping.apply(it, maxIterations, z_it);
				colour_row.push(colour);
			}
		});
		colours.push(colour_row);
	});
	return colours;
}