async function getEdgeCoordinates(imagesrc){
	var coordinateArray = [];
	let image = await promiseLoad(imagesrc);
	console.log('hola');
	var canvas=document.getElementById("canvas");
	canvas.style.display = "none";
	canvas.width = image.width;
	canvas.height = image.height;
	coordinateArray.push(canvas.width);
	coordinateArray.push(canvas.height);

	var ctx=canvas.getContext("2d");
	var cw=canvas.width;
	var ch=canvas.height;

	ctx.drawImage(image, canvas.width / 2 - image.width / 2, canvas.height / 2 - image.height / 2);

	var imageData = ctx.getImageData(0, 0, cw, ch);
	var data = imageData.data;
	for (var x = 0; x < cw; x++){
	  for(var y = 0; y < ch; y++){

	  	var pIndex = ((x + y * cw) * 4) + 4;
	  	if (data[pIndex] == 0){
	  		coordinateArray.push({"X": x, "Y": y});
	  	}
	  }
	}
	canvas.remove();
	return coordinateArray;
}

/*
** promiseLoad()
** Helper function loads image as a promise 
*/
async function promiseLoad(src){
  return new Promise((resolve, reject) => {
  	var coordinateArray = [];
    let img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/* prepImage()
** Behavior: Helper function for processing image and applying canny edge filter
*/
async function prepImage(img_src, canny){
	const { Image } = require('image-js');
	let image = await Image.load(img_src);
	var resizeOptions = {"height": 500}
	// resize to managable size and greyscale(also converts to a pdf)
	let grey = image.resize(resizeOptions).grey();
	const edge = canny(grey);
	return edge;
}

module.exports.getEdgeCoordinates = getEdgeCoordinates;
module.exports.prepImage = prepImage;

// True black 255, 255, 255 ,255