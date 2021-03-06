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
	  	if (data[pIndex] < 100){
  			coordinateArray.push({"X": x, "Y": y});
	  	}
	  }
	}
	if (coordinateArray.length > 50000){
		coordinateArray = [{failure: true}];
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
		      	prepImage(e.target.result, cannyEdgeDetector, false).then(notCannied =>{
		      		menuController.updateLoadingText("Finding Walls...");
			        getEdgeCoordinates(notCannied.toDataURL()).then(wallCoordinates =>{
			        	menuController.updateLoadingText("Finding Ball...");
			        	findHole(notCannied.resize({"width":325}).toDataURL()).then(holeCoordinates =>{
			        		menuController.updateLoadingText("Finding Hole...");
			        		prepImage(e.target.result, cannyEdgeDetector, true).then(yesCannied =>{
				        		findBall(yesCannied.resize({"width":325}).toDataURL()).then(ballCoordinates =>{
				        			const gameCoordinates = 
				        			{
				        			walls: wallCoordinates,
				        			ball: ballCoordinates,
				        			hole: holeCoordinates,
				        			max_height: notCannied.height
				        			}
				        			const imageCanvas = document.getElementById("canvas");
				        			menuController.toggleLoader(false);
				          			resolve(gameCoordinates);
				        		})
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
	  [-1, 0, 0, 0, 0, -1, -2, -3, -3, -2, -1, -1, 0, 0, 0, 0, -1],
	  [0, 1, 0, 0, 0, 0, 0, -1, -1, 0, 0, 0, 0, 0, 0, 1, 0],
	  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
	  [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
	  [0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
	  [0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
	  [-2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0],
	  [-2, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, -1, -1],
	  [-3, -1, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, -1, -3],
	  [-2, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, -1, -1],
	  [-2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0],
	  [0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0],
	  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0 ,0 ],
	  [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
	  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
	  [0, 1, 0, 0, 0, 0, 0, -1, -1, 0, 0, 0, 0, 0, 0, 1 ,0 ],
	  [-1, 0, 0, 0, 0, -1, -2, -3, -3, -2, -1, -1, 0, 0, 0, 0, -1],
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
	var bestScore = Number.NEGATIVE_INFINITY;
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
	  			var intensity = 255 - data[pUnderReview];	// lower numbers are better so take difference from max
	  			var score = crossKernel[elipY][elipX] * intensity;
	  			if(!isNaN(score)){
	  				curScore += score;
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
	// make kernel model for a circle (Minecraft style)

	const ellipse = [
	  [0, 0, 0, 0, 0, 1, 1, 2, 1, 1, 0, 0, 0, 0, 0],
	  [0, 0, 0, 1, 1, , 0, 0, 0, 0, 1, 1, 0, 0, 0],
	  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
	  [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
	  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
	  [1, 0, 0, 0, -1, -1, -1, -1, -1, -1, 0, 0, 0, 0, 1],
	  [1, 0, 0, 0, -1, -1, -2, -2, -1, -1, 0, 0, 0, 0, 1],
	  [2, 0, 0, 0, -1, -1, -2, -2, -1, -1, 0, 0, 0, 0, 2],
	  [1, 0, 0, 0, -1, -1, -2, -2, -1, -1, 0, 0, 0, 0, 1],
	  [1, 0, 0, 0, -1, -1, -1, -1, -1, -1, 0, 0, 0, 0, 1],
	  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
	  [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
	  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
	  [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
	  [0, 0, 0, 0, 0, 1, 1, 2, 1, 1, 0, 0, 0, 0, 0],
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
	var bestScore = Number.NEGATIVE_INFINITY;
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
async function prepImage(img_src, canny, useCanny){
	const { Image } = require('image-js');
	let image = await Image.load(img_src);
	if (image.width < image.height){
		image = image.rotate(90);
	}
	image = image.resize({"width": 650});
	let grey = image.grey();
	if(useCanny){
		grey = canny(grey, {lowThreshold: 25, highThreshold: 50});
	}
	return grey;
}

module.exports.waitForInput = waitForInput;