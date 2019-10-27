# Doodle Amazing

##Changelog
KEA 10/27/2019
* Updated game flow to begin with image prompt and game not yet loaded in
* Added complete processing pipeline image upload -> canny edges -> coordinates read -> game starts
* Commented out upload flow so game can easily be tweaked without upload flow each time
* Added fix for jpeg images not working

** Up Next **
[] Improve coordinate detection algorithm
[] Improve landing page looks
[] Understand wall creation in Phaser
[] Discuss game flow and integration
[] Discuss necessity of Cordova vs running in mobile browser

## Setup
Setup npm to include all packages:
npm install

## Running in Test
npm start  
Game will be at: http://localhost/8080  

## Deploying
npm run build  
Webpack will have created dist/bundle.min.js 
We may not need this depending on how exporting works

## Exporting to Phone
We will be using Apache Cordova to export the project to mobile.
https://cordova.apache.org/
