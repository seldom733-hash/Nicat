@echo off
REM ============================================
REM Nicat Dev Server - Windows Start Script
REM ============================================

setlocal enabledelayedexpansion

set BACKEND_PORT=3000
set FRONTEND_PORT=3001
set PGDATA=%~dp0pgdata
set PG_BIN="C:\Program Files\PostgreSQL\18\bin"
set HEALTH_CHECK_URL=http://localhost:%BACKEND_PORT%/api/v1/health
set HEALTH_CHECK_TIMEOUT=30

echo ============================================
echo  Nicat Dev Server - Starting...
echo ============================================
echo.

REM --- Start local PostgreSQL from project pgdata/ ---
%PG_BIN%\pg_ctl.exe -D "%PGDATA%" status >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Starting local PostgreSQL from pgdata/ on port 5433...
    %PG_BIN%\pg_ctl.exe -D "%PGDATA%" -l "%PGDATA%\logfile" start
    timeout /t 3 /nobreak >nul
    echo [SUCCESS] Local PostgreSQL started on port 5433
) else (
    echo [INFO] Local PostgreSQL is already running on port 5433
)
echo.

REM Check if ports are already in use
netstat -ano | findstr ":%BACKEND_PORT% " | findstr "LISTENING" >nul 2>&1
if %errorlevel% equ 0 (
    echo [WARNING] Port %BACKEND_PORT% is already in use
)

REM Start Backend
set DB_PORT=5433
echo [INFO] Starting Backend (NestJS) on port %BACKEND_PORT% (DB port 5433)...
start "Nicat Backend" cmd /c "cd /d "%~dp0" && set DB_PORT=5433 && npm run start:dev > C:\temp\nicat-backend.log 2>&1"

REM Wait for backend to be ready
echo [INFO] Waiting for backend to be ready...
set /a counter=0

:wait_loop
if %counter% geq %HEALTH_CHECK_TIMEOUT% (
    echo [ERROR] Backend failed to start within %HEALTH_CHECK_TIMEOUT% seconds
    goto :end
)

curl -s %HEALTH_CHECK_URL% | findstr "ok" >nul 2>&1
if %errorlevel% equ 0 (
    echo [SUCCESS] Backend is ready!
    goto :start_frontend
)

set /a counter+=1
timeout /t 1 /nobreak >nul
echo | set /p="."
goto :wait_loop

:start_frontend
echo.
echo [INFO] Starting Frontend (Next.js) on port %FRONTEND_PORT%...
start "Nicat Frontend" cmd /c "cd /d "%~dp0frontend" && npm run dev > C:\temp\nicat-frontend.log 2>&1"

REM Wait for frontend to be ready
echo [INFO] Waiting for frontend to be ready...
set /a counter=0

:wait_frontend
if %counter% geq 20 (
    echo [WARNING] Frontend might not be ready yet, continuing...
    goto :show_status
)

curl -s -o nul -w "%%{http_code}" http://localhost:%FRONTEND_PORT% | findstr "200" >nul 2>&1
if %errorlevel% equ 0 (
    echo [SUCCESS] Frontend is ready!
    goto :show_status
)

set /a counter+=1
timeout /t 1 /nobreak >nul
echo | set /p="."
goto :wait_frontend

:show_status
echo.
echo ============================================
echo  Nicat Dev Server is running!
echo ============================================
echo.
echo   Frontend:  http://localhost:%FRONTEND_PORT%
echo   Backend:   http://localhost:%BACKEND_PORT%
echo   API Docs:  http://localhost:%BACKEND_PORT%/api/docs
echo   Health:    http://localhost:%BACKEND_PORT%/api/v1/health
echo.
echo   Logs:
echo     Backend:  C:\temp\nicat-backend.log
echo     Frontend: C:\temp\nicat-frontend.log
echo.
echo   To stop: Close the terminal windows or run: stop-dev.cmd
echo ============================================

:end
pause
