const menuController = require('./Menus.js');

async function getEdgeCoordinates(imagesrc){
	var coordinateArray = [];
	let image = await promiseLoad(imagesrc);

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

/* 
	Main calling point
*/
async function waitForInput(cannyEdgeDetector){
	var inputElement = document.getElementById("pic");
	return new Promise((resolve, reject) => {
		inputElement.onchange = function(event) {
		  	var image = inputElement.files[0];
		  	var reader = new FileReader();
		  	menuController.removeMainMenu();
		  	menuController.toggleLoader(true);
		    reader.onload = function(e){
		      	prepImage(e.target.result, cannyEdgeDetector).then(resultImage =>{
		      		menuController.updateLoadingText("Finding wall coordinates...");
			        getEdgeCoordinates(resultImage.toDataURL()).then(wallCoordinates =>{
			        	menuController.updateLoadingText("Finding ball...");
			        	findBall(resultImage.resize({"width":325}).toDataURL()).then(ballCoordinates =>{
			        		menuController.updateLoadingText("Finding hole...");
			        		findHole(resultImage.resize({"width":325}).toDataURL()).then(holeCoordinates =>{
			        			const gameCoordinates = 
			        			{
			        			walls: wallCoordinates,
			        			ball: ballCoordinates,
			        			hole: holeCoordinates,
			        			max_height: resultImage.height
			        			}
			        			const imageCanvas = document.getElementById("canvas");
			        			menuController.toggleLoader(false);
			          			resolve(gameCoordinates);
			        		})
			          	})
			        })
		      	})
		    }
		    reader.readAsDataURL(image);
		}
	})
}

async function findHole(imagesrc){
	let image = await promiseLoad(imagesrc);
	// make kernel model for a circle
	// -1 caps on corners to prefer smaller x's
	const crossKernel = [
	  [-1, -1, 0, 0, 0, 0, -1, -1, -1, 0, 0, 0, 0, -1, -1],
	  [-1, 1, 0, 0, 0, 0, -1, -1, -1, 0, 0, 0, 0, 1, -1],
	  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
	  [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
	  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
	  [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
	  [-1, -1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, -1, -1],
	  [-1, -1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, -1, -1],
	  [-1, -1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, -1, -1],
	  [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
	  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
	  [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
	  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
	  [-1, 1, 0, 0, 0, 0, -1, -1, -1, 0, 0, 0, 0, 1, -1],
	  [-1, -1, 0, 0, 0, 0, -1, -1, -1, 0, 0, 0, 0, -1, -1],
	];

	var canvas=document.getElementById("canvas");
	canvas.style.display = "none";
	canvas.width = image.width;
	canvas.height = image.height;

	var ctx=canvas.getContext("2d");
	var cw=canvas.width;
	var ch=canvas.height;

	// Calculate center of our kernel
	var halfHeight = Math.floor(crossKernel.length / 2);
	var halfWidth = Math.floor(crossKernel.length / 2);

	ctx.drawImage(image, canvas.width / 2 - image.width / 2, canvas.height / 2 - image.height / 2);
	var imageData = ctx.getImageData(0, 0, cw, ch);
	var data = imageData.data;
	var bestScore = 0;
	var bestCoord = [];
	var curScore = 0;
	var once = true;
	// start at the offset of the kernel and go until the offset of the kernel
	for (var x = halfWidth; x < cw - halfWidth; x++){
		if (x % 2 == 0){
			continue;
		}
	  for(var y = halfHeight; y < ch - halfHeight; y++){
	  	if (y % 2 == 0){
	  		continue;
	  	}
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
	  			var score = crossKernel[elipY][elipX] * data[pUnderReview];
	  			if (score > 0){
	  				curScore++;
	  			}
	  		}
	  	}
		if (curScore > bestScore){
			bestScore = curScore;
			bestCoord = [x, y];
		}
	  }
	}
	// return x, y of x
	bestCoord[0] = bestCoord[0] * 2;
	bestCoord[1] = bestCoord[1] * 2;
	return bestCoord;
}

async function findBall(imagesrc){
	let image = await promiseLoad(imagesrc);
	// make kernel model for a circle
	const ellipse = [
	  [0, 0, 0, 0, 0, 1, 1, 2, 1, 0, 0, 0, 0, 0, 0],
	  [0, 0, 1, 1, 1, , 0, 0, 1, 1, 1, 1, 0, 0, 0],
	  [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
	  [0, 1, , 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
	  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
	  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	  [1, 1, 0, 0, 0, -1, -1, -1, -1, 0, 0, 0, 0, 1, 1],
	  [2, 1, 0, 0, 0, -1, -1, -1, -1, 0, 0, 0, 0, 1, 2],
	  [1, 1, 0, 0, 0, -1, -1, -1, -1, 0, 0, 0, 0, 1, 1],
	  [1, 1, 0, 0, 0, -1, -1, -1, -1, 0, 0, 0, 0, 1, 1],
	  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	  [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
	  [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
	  [0, 0, 0, 1, 1, 1, 1, 2, 1, 1, 1, 1, 0, 0, 0],
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
		 if (x % 2 == 0){
	  		continue;
	  	}	
	  for(var y = halfHeight; y < ch - halfHeight; y++){
	  	if (y % 2 == 0){
	  		continue;
	  	}
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
	  			var score = ellipse[elipY][elipX] * data[pUnderReview];
	  			if (score > 0){
	  				curScore++;
	  			}
	  		}
	  	}
		if (curScore > bestScore){
			bestScore = curScore;
			bestCoord = [x, y];
		}
	  }
	}
	// return x, y of circle
	bestCoord[0] = bestCoord[0] * 2;
	bestCoord[1] = bestCoord[1] * 2;
	return bestCoord;
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
	image = image.resize({"width": 650});
	let grey = image.grey();
	const edge = canny(grey);
	return edge;
}

module.exports.waitForInput = waitForInput;