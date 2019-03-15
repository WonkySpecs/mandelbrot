importScripts('test.js');

onmessage = function(e) {
	[[cw, ch], inputValues] = e.data;
	const scaledPoints = scalePixelListToAxes([cw, ch], inputValues.axesBounds);
	let escapeTimeCalculator = EscapeTimeCalculatorBuilder()
								 .maxIterations(inputValues.maxIterations)
								 .escapeRadius(inputValues.escapeRadius)
								 .build();
	let pointGenerator = escapeTimeCalculator.applyTo(scaledPoints);
	let nextPointGen = pointGenerator.next();
	while(!nextPointGen.done) {
		postMessage(["progress", nextPointGen.value]);
		nextPointGen = pointGenerator.next();
	}
	console.log("Done calculating, sending message");
	postMessage(["done", nextPointGen.value, inputValues]);
}