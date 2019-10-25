function getEdgeCoordinates(doodleImage){
	var image = new Image();
	image.crossOrigin = "anonymous";
	image.onload = function () {
		var canvas=document.getElementById("canvas");
		canvas.style.display = "none";
		canvas.width = image.width;
		canvas.height = image.height;

		var ctx=canvas.getContext("2d");
		var cw=canvas.width;
		var ch=canvas.height;

		ctx.drawImage(image, canvas.width / 2 - image.width / 2, canvas.height / 2 - image.height / 2);

		var imageData = ctx.getImageData(0, 0, cw, ch);
		var data = imageData.data;
		for (var x = 0; x < cw; x++){
		  for(var y = 0; y < ch; y++){

		  	var pIndex = (x + y * cw) * 4;	// 4 indexes for each pixel RGBA
		  	console.log('R: ' + data[pIndex] + ' G: ' + data[pIndex + 1] + ' B: ' + data[pIndex + 2] + " A:" + data[pIndex + 3]);	
		  }
		}
		console.log('all done');
		//canvas.remove();
	}
	image.src = doodleImage.src;
}

async function prepImage(){
	const { Image } = require('image-js');
	let image = await Image.load('test_doodle.jpg');
	let grey = image.grey();
	return grey;
}

function uploadImage(){
	// Beginning of image upload
	var inputElement = document.getElementById("pic");

	inputElement.onchange = function(event) {

	   var image = inputElement.files[0];
	   var img = new Image();
	   var reader = new FileReader();
	   reader.onload = function(e){
	    img.src = e.target.result;
	    uploadedImage = e.target.result;
	    inputElement.style.display = "none";
	    getEdgeCoordinates(img);
	   }
	   reader.readAsDataURL(image);
	}
}

module.exports.getEdgeCoordinates = getEdgeCoordinates;
module.exports.prepImage = prepImage;
module.exports.uploadImage = uploadImage;

// True black 255, 255, 255 ,255