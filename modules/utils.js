export { hexStringToRgb }

function hexStringToRgb(hex) {
	var bigint = parseInt(hex.substring(1), 16);
	var r = (bigint >> 16) & 255;
	var g = (bigint >> 8) & 255;
	var b = bigint & 255;

	return [r, g, b];
}