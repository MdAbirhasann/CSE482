@echo off
start cmd /k "cd server && npm install && npm start"
start cmd /k "cd client && npm install && npm run dev"
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
pause
