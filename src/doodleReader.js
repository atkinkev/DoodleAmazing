
function readImage(){
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

	  }
	}
	console.log('All done');
	// canvas related variables
	}
	image.src = "edgeImage.png"
}


module.exports.readImage = readImage;