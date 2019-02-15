export { EscapeTimeCalculator };

var EscapeTimeCalculator = function(maxIterations, escapeRadius) {
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

	function calcEscapeTimes(points) {
		let times = [];
		points.forEach(function(pointRow) {
			let timesRow = [];
			pointRow.forEach(function(point) {
				timesRow.push(escapeTime(point));
			});
			times.push(timesRow);
		});
		return times;
	}
	return {
		applyTo: calcEscapeTimes
	}
}