export { calcPointColours }

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

function calcPointColours(points, colourMapping) {
	let colours = [];
	let max_iterations = 100;
	points.forEach(function(point_row) {
		let colour_row = [];
		point_row.forEach(function(point) {
			let it = iterationsToEscape(point, max_iterations);
			let colour = colourMapping.apply(it, max_iterations);
			colour_row.push(colour);
		});
		colours.push(colour_row);
	});
	return colours;
}