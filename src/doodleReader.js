function getEdgeCoordinates(){
	var image = new Image();
	image.crossOrigin = "anonymous";
	image.onload = function () {
		var canvas=document.getElementById("canvas");
		canvas.style.display = "none";
		var ctx=canvas.getContext("2d");
		var cw=canvas.width;
		var ch=canvas.height;

		ctx.drawImage(image, canvas.width / 2 - image.width / 2, canvas.height / 2 - image.height / 2);

		var imageData = ctx.getImageData(0, 0, cw, ch);
		var data = imageData.data;

		for (var x = 0; x < cw; x++){
		  for(var y = 0; y < ch; y++){

		  	var pIndex = (x + y * cw) * 4;	// 4 indexes for each pixel RGBA
		  	if (x == 300){
		  		console.log('R: ' + data[pIndex] + ' G: ' + data[pIndex + 1] + ' B: ' + data[pIndex + 2] + " A:" + data[pIndex + 3]);
			}		  
		  }
		}
	}
	image.src = "edgeImage.png"
}

async function findEdges(){
	const { Image } = require('image-js');
	try{
		let image = await Image.load('test_doodle.jpg');
		let grey = image.grey();
		//let edge = canny(grey);
		//grey.save('superhappyfun.png');
	}
	catch(error){
		console.error(error);
	}
}

module.exports.getEdgeCoordinates = getEdgeCoordinates;
module.exports.findEdges = findEdges;

// True black 255, 255, 255 ,255