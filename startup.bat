@echo off
title UNO Minda - Full System Starter

echo ==========================================
echo   Starting UNO Minda Full Application
echo ==========================================

REM ---------------- BACKEND ----------------
echo Starting Backend...
start "Backend API" cmd /k ^
"cd /d \"C:\Bot2do project\barcode\" && npm start"

REM ---------------- FRONTEND ----------------
echo Starting Frontend...
start "Frontend App" cmd /k ^
"cd /d \"C:\Bot2do project\uno_minda_frontend\" && npm run dev"

REM ---------------- ZK JAVA ----------------
echo Starting ZK Fingerprint Server...
start "ZK Fingerprint Server" cmd /k ^
"cd /d \"C:\Users\Madhankumar\Music\ZKFingerSDK_Windows_Standard\ZKFinger Standard SDK 5.3.0.33\Java\sample\ZKFinger Demo2\" ^
&& if not exist bin mkdir bin ^
&& javac -cp \"lib/*\" -d bin src\com\zkteco\biometric\*.java ^
&& java -cp \"bin;lib/*\" com.zkteco.biometric.ApiServer"

echo ==========================================
echo   All services launched successfully!
echo ==========================================
