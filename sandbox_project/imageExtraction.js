async function execute() {

  const testOptions = {
    lowThreshold: 150,
    highThreshold: 300,
    gaussianBlur: 0.1
  };
  let image = await Image.load('test_doodle.png');
  let grey = image.grey() // convert the image to greyscale.
  let edge = canny(grey);
  edge.save('edgeimage.png');

  var canvas=document.getElementById("canvas");
  var ctx=canvas.getContext("2d");
  var cw=canvas.width;
  var ch=canvas.height;
  ctx.drawImage(edge, canvas.width / 2 - edge.width / 2, canvas.height / 2 - edge.height / 2);
  document.body.appendChild(canvas);

}

function getOutline(ctx,pointX,pointY,w,h){
    var imageData = ctx.getImageData(pointX, pointY, w, h);
    var data = imageData.data;
    var outline=[];
    for(var x=0;x<w;x++){
        for(var y=0;y<h;y++){
            var index = (x + y * w) * 4;

            var nextIndex, lastIndex, leftIndex, rightIndex;
            nextIndex = (x + (y +1) * w ) * 4;
            lastIndex = (x + (y -1) * w ) * 4;
            leftIndex = index - 4;
            rightIndex = index + 4;

            var cx={"X":x,"Y":y}; 
            if(data[index+3] !== 0 && 
                ( (data[nextIndex+3] === 0)
                    || ( data[lastIndex+3] === 0)
                    || ( data[leftIndex+3] === 0)
                    || ( data[rightIndex+3] === 0) 
                )
            ){
                outline.push(cx);
            }
        }
    }
    return outline;
}