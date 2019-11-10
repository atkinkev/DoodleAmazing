async function getEdgeCoordinates(imagesrc){
	var coordinateArray = [];
	let image = await promiseLoad(imagesrc);
	//document.body.appendChild(image);
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
	var skip = false;
	for (var x = 0; x < cw; x++){
	  for(var y = 0; y < ch; y++){
	  	var pIndex = ((x + y * cw) * 4);
	  	if (data[pIndex] == 255){
	  		if(skip){
	  			coordinateArray.push({"X": x, "Y": y});
	  		}
	  		skip = !skip;
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

async function waitForInput(cannyEdgeDetector){
	var inputElement = document.getElementById("pic");
	return new Promise((resolve, reject) => {
		inputElement.onchange = function(event) {
		  var image = inputElement.files[0];
		  var reader = new FileReader();
		    reader.onload = function(e){
		    // remove upload button
		      inputElement.style.display = "none";
		      // run image through canny edge detector
		      prepImage(e.target.result, cannyEdgeDetector).then(resultImage =>{
		        getEdgeCoordinates(resultImage.toDataURL()).then(coordinates =>{
		          resolve(coordinates);
		        })
		      })
		    }
		    reader.readAsDataURL(image);
		}
	})
}



async function findBall(imagesrc){
	let image = await promiseLoad(imagesrc);
	document.body.appendChild(image);
	// make kernel model for a circle
	const ellipse = [
	  [0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
	  [0, 0, 1, 1, 1, , 0, 0, 1, 1, 1, 1, 0, 0, 0],
	  [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
	  [0, 1, , 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
	  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
	  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	  [1, 0, 0, 0, 0, -1, -1, -1, -1, 0, 0, 0, 0, 0, 1],
	  [1, 0, 0, 0, 0, -1, -1, -1, -1, 0, 0, 0, 0, 0, 1],
	  [1, 0, 0, 0, 0, -1, -1, -1, -1, 0, 0, 0, 0, 0, 1],
	  [1, 0, 0, 0, 0, -1, -1, -1, -1, 0, 0, 0, 0, 0, 1],
	  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
	  [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
	  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
	];

	var canvas=document.getElementById("canvas");
	canvas.style.display = "none";
	canvas.width = image.width;
	canvas.height = image.height;

	var ctx=canvas.getContext("2d");
	var cw=canvas.width;
	var ch=canvas.height;

	// Calculate center of our kernel
	var halfHeight = Math.floor(ellipse.length / 2);
	var halfWidth = Math.floor(ellipse.length / 2);

	ctx.drawImage(image, canvas.width / 2 - image.width / 2, canvas.height / 2 - image.height / 2);
	var imageData = ctx.getImageData(0, 0, cw, ch);
	var data = imageData.data;
	var bestScore = 0;
	var bestCoord = [];
	var curScore = 0;
	var once = true;
	// start at the offset of the kernel and go until the offset of the kernel
	for (var x = halfWidth; x < cw - halfWidth; x++){
	  for(var y = halfHeight; y < ch - halfHeight; y++){
	  	curScore = 0;
	  	var elipX = -1;
	  	var pIndex = ((x + y * cw) * 4);
	  	// read all coordinates of this spot
	  	for(var horizOffset = -halfWidth; horizOffset < halfWidth; horizOffset++){
	  		elipX++;
	  		elipY = -1;
	  		for(var vertOffset = -halfHeight; vertOffset < halfHeight; vertOffset++){
	  			// calculate the index of the pixel under review => currentPixelIndex - (vericalOffset * canvasWidth * 4) - (horizontalOffset * 4)
	  			// More simply: currentIndex + rows away + columns away
	  			elipY++;
	  			var pUnderReview = pIndex + (vertOffset * cw * 4) + (horizOffset * 4);
	  			curScore += ellipse[elipY][elipX] * data[pUnderReview];
	  			if(once && vertOffset == -7 && horizOffset == -6){
	  				console.log(pUnderReview);
	  				console.log(data[pUnderReview]);
	  				once = !once;
	  			}
	  		}
	  	}
		if (curScore > bestScore){
			bestScore = curScore;
			bestCoord = [x, y];
		}
	  }
	}
	console.log(bestScore);
	console.log(bestCoord);
}

/* prepImage()
** Behavior: Helper function for processing image and applying canny edge filter
*/
async function prepImage(img_src, canny){
	const { Image } = require('image-js');
	let image = await Image.load(img_src);
	if (image.width < image.height){
		image = image.rotate(90);
	}
	var resizeOptions = {"width": 650}
	// resize to managable size and greyscale(also converts to a png)
	image = image.resize(resizeOptions);
	shapeImage = image.resize({"width": 325}).grey().gaussianFilter();
	let ballcoord = await findBall(shapeImage.toDataURL());
	let grey = image.grey();
	const edge = canny(grey);
	return edge;
}

module.exports.waitForInput = waitForInput;

// True black 255, 255, 255 ,255