# Doodle Amazing

## Changelog
KEA 11/3/2019
* Hosted site for midpoint check
* Cleaned up files
* Created express server for bundled code
* Worked on image coordinates

KEA 10/31/2019
* Experimented with creating a landing screen  
* Ported to Mobile!
* Ported to Browser!

KEA 10/27/2019
* Updated game flow to begin with image prompt and game not yet loaded in 
* Added complete processing pipeline image upload -> canny edges -> coordinates read -> game starts 
* Commented out upload flow so game can easily be tweaked without upload flow each time 
* Added fix for jpeg images not working 

Up Next  
* Improve coordinate detection algorithm 
* Improve landing page looks 
* Understand wall creation in Phaser 
* Discuss game flow and integration 
* Discuss necessity of Cordova vs running in mobile browser 

## Setup
Setup npm to include all packages:
npm install

## Running in Test
run 'npm start'  
Game will be at: http://localhost/8080   

## Explorting for Phone
* Test *
cordova run android (setup target emulator or plugin android with USB debugging turned on)

* Production *
See : https://cordova.apache.org/docs/en/2.9.0/guide/getting-started/android/ 
We will need a Mac to export for iPhone 

## Deploying for Web
npm run build  
Webpack will have created dist/bundle.min.js 
Move dist folder to deploy folder  
Make sure paths make sense  
Deploy via gcloud (https://doodleamazing.appspot.com/)

