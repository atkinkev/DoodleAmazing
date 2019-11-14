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
	const progressText = document.getElementById("loadtext");
	return new Promise((resolve, reject) => {
		inputElement.onchange = function(event) {

		  	var image = inputElement.files[0];
		  	var reader = new FileReader();
		    reader.onload = function(e){
		    	const greetingDiv = document.getElementById("greeting");
				greetingDiv.remove();
				const loader = document.getElementById("loader")
				loader.style.display = "inline";
		    	// remove upload button
		      	inputElement.style.display = "none";
		     	 // run image through canny edge detector
		     	progressText.innerText = "Prepping image...";
		      	prepImage(e.target.result, cannyEdgeDetector).then(resultImage =>{
		      		progressText.innerText = "Gathering wall coordinates...";
			        getEdgeCoordinates(resultImage.toDataURL()).then(wallCoordinates =>{
			        	progressText.innerText = "Finding ball...";
			        	findBall(resultImage.resize({"width":325}).toDataURL()).then(ballCoordinates =>{
			        		progressText.innerText = "Finding hole...";
			        		findHole(resultImage.resize({"width":325}).toDataURL()).then(holeCoordinates =>{
			        			const gameCoordinates = 
			        			{
			        			walls: wallCoordinates,
			        			ball: ballCoordinates,
			        			hole: holeCoordinates
			        			}
			        			loader.style.display = "none";
			        			const imageCanvas = document.getElementById("canvas");
			        			imageCanvas.remove();
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
	const ellipse = [
	  [1, 0, 0, 0, 0, 0, -1, -1, -1, 0, 0, 0, 0, 0, 1],
	  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
	  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
	  [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
	  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
	  [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
	  [-1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, -1],
	  [-1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, -1],
	  [-1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, -1],
	  [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
	  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
	  [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
	  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
	  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
	  [1, 0, 0, 0, 0, 0, -1, -1, -1, 0, 0, 0, 0, 0, 1],
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
	  			var score = ellipse[elipY][elipX] * data[pUnderReview];
	  			if (score > 0){
	  				curScore++;
	  			}
	  		}
	  	}
		if (curScore > bestScore){
			console.log(curScore);
			bestScore = curScore;
			bestCoord = [x, y];
		}
	  }
	}
	bestCoord[0] = bestCoord[0] * 2;
	bestCoord[1] = bestCoord[1] * 2;
	return bestCoord;
}

async function findBall(imagesrc){
	let image = await promiseLoad(imagesrc);
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
	  			var score = ellipse[elipY][elipX] * data[pUnderReview];
	  			if (score > 0){
	  				curScore++;
	  			}
	  		}
	  	}
		if (curScore > bestScore){
			console.log(curScore);
			bestScore = curScore;
			bestCoord = [x, y];
		}
	  }
	}
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

// True black 255, 255, 255 ,255