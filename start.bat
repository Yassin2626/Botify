@echo off
echo Starting Botify...
docker-compose up -d --build
echo.
echo Botify is running!
echo Dashboard: http://localhost:3000
echo.
pause
