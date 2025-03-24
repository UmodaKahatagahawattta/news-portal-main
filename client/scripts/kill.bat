@echo off

echo The following command terminates the "npm start" process using its PID
echo (written to ".pidfile"), all of which were conducted when "deliver.bat"
echo was executed.

for /f "delims=" %%i in (.pidfile) do set PID=%%i
echo Terminating process with PID %PID%.
taskkill /F /PID %PID%
