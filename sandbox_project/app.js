/**
 * Copyright 2017, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

// [START gae_node_request_example]
const express = require('express');
const canny = require('canny-edge-detector');
const { Image } = require('image-js');

const app = express();

app.get('/', (req, res) => {
  res
    .status(200)
    .send('Hello, world!')
    .end();
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END gae_node_request_example]

execute().catch(console.error);

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

module.exports = app;


