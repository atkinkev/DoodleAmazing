# Doodle Amazing
## Oregon State Senior Project

## Usage 
APK can be found in the Production folder  
Install APK on desired device or emulator  
See production folder for full documentation 

## Setup
Setup npm to include all packages:
npm install

## Running in Test
run 'npm start'  
Game will be at: http://localhost/8080   

## Deploying for Phone
npm run build
Webpack will have created dist/bundle.min.js in www folder
Change script src in index.html to bundle.min.js from bundle.js used in test
cordova build android
APK will be found in platforms/android/app/build/outputs/apk/debug

## Deploying for Web
npm run build  
Webpack will have created dist/bundle.min.js 
Move dist folder to deploy folder  
Make sure paths make sense  
Make sure index.html is up to date in www folder
Deploy via gcloud (https://doodleamazing.appspot.com/)

