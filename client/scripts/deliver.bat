@echo off

echo The following "npm" command builds your Node.js/React application for
echo production in the local "build" directory (i.e. within the
echo "C:\path\to\your\project" directory),
echo correctly bundles React in production mode and optimizes the build for
echo the best performance.
call npm run build

echo The following "npm" command runs your Node.js/React application in
echo development mode and makes the application available for web browsing.
echo The "npm start" command runs in the background.
start /B npm start

echo Now...
echo Visit http://localhost:3000 to see your Node.js/React application in action.
