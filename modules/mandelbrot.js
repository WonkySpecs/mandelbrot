export { calcEscapeTimes }

var escapeTime = function(point, maxIterations) {
	let counter = 0;
	let r = point[0];
	let i = point[1];
	let z = [r, i];
	while(counter < maxIterations && !(z[0] ** 2 + z[1] ** 2 > 4)) {
		z = f(z, point);
		counter += 1;
	}
	return [counter, z];
}

var iterationsToEscape = function(point, maxIterations) {
	return escapeTime(point, maxIterations)[0];
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

function calcEscapeTimes(points, maxIterations) {
	let times = [];
	points.forEach(function(pointRow) {
		let timesRow = [];
		pointRow.forEach(function(point) {
			timesRow.push(escapeTime(point, maxIterations));
		});
		times.push(timesRow);
	});
	return times;
}