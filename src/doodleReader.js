var jsfeat = require('jsfeat');
var cannyEdgeDetector = require('canny-edge-detector');
var Image = require('image-js');
var testImage = require('./assets/doodles/test_doodle.jpg');

export async function toGreyScale(){

	let image = await Image.load('./assets/doodles/test_doodle.jpg');
	let grey = image.grey().resize({width: 200}).rotate(30);
	return grey.save('newimage.png');
}

