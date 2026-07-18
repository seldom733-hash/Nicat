#!/bin/bash

# ============================================
# Nicat Dev Server - Start Script
# ============================================
# This script starts both backend (NestJS) and frontend (Next.js)
# with a health check to ensure backend is ready before frontend starts.
#
# Usage:
#   ./start-dev.sh          # Start both services
#   ./start-dev.sh --stop   # Stop all services
#   ./start-dev.sh --status # Check status
# ============================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKEND_PORT=3000
FRONTEND_PORT=3001
HEALTH_CHECK_URL="http://localhost:${BACKEND_PORT}/api/v1/health"
HEALTH_CHECK_TIMEOUT=30
HEALTH_CHECK_INTERVAL=1

# PID files
BACKEND_PID_FILE=".backend.pid"
FRONTEND_PID_FILE=".frontend.pid"

# ============================================
# Helper functions
# ============================================

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if a port is in use
is_port_in_use() {
    local port=$1
    if command -v netstat &> /dev/null; then
        netstat -ano | findstr ":${port}" | findstr "LISTENING" > /dev/null 2>&1
    elif command -v lsof &> /dev/null; then
        lsof -i:${port} > /dev/null 2>&1
    else
        curl -s "http://localhost:${port}" > /dev/null 2>&1
    fi
}

# Wait for backend to be ready
wait_for_backend() {
    log_info "Waiting for backend to be ready on port ${BACKEND_PORT}..."
    local counter=0
    
    while [ $counter -lt $HEALTH_CHECK_TIMEOUT ]; do
        if curl -s "$HEALTH_CHECK_URL" | grep -q '"status":"ok"'; then
            log_success "Backend is ready!"
            return 0
        fi
        
        counter=$((counter + HEALTH_CHECK_INTERVAL))
        sleep $HEALTH_CHECK_INTERVAL
        echo -n "."
    done
    
    echo ""
    log_error "Backend failed to start within ${HEALTH_CHECK_TIMEOUT} seconds"
    return 1
}

# Stop all services
stop_services() {
    log_info "Stopping all services..."
    
    # Stop backend
    if [ -f "$BACKEND_PID_FILE" ]; then
        local backend_pid=$(cat "$BACKEND_PID_FILE")
        if kill -0 "$backend_pid" 2>/dev/null; then
            log_info "Stopping backend (PID: $backend_pid)..."
            kill "$backend_pid" 2>/dev/null || true
        fi
        rm -f "$BACKEND_PID_FILE"
    fi
    
    # Stop frontend
    if [ -f "$FRONTEND_PID_FILE" ]; then
        local frontend_pid=$(cat "$FRONTEND_PID_FILE")
        if kill -0 "$frontend_pid" 2>/dev/null; then
            log_info "Stopping frontend (PID: $frontend_pid)..."
            kill "$frontend_pid" 2>/dev/null || true
        fi
        rm -f "$FRONTEND_PID_FILE"
    fi
    
    # Also try to kill by port
    if is_port_in_use $BACKEND_PORT; then
        log_warning "Port ${BACKEND_PORT} still in use, attempting to kill process..."
        if command -v netstat &> /dev/null; then
            netstat -ano | findstr ":${BACKEND_PORT}" | findstr "LISTENING" | awk '{print $5}' | cut -d'/' -f1 | xargs -I {} taskkill /PID {} /F 2>/dev/null || true
        fi
    fi
    
    if is_port_in_use $FRONTEND_PORT; then
        log_warning "Port ${FRONTEND_PORT} still in use, attempting to kill process..."
        if command -v netstat &> /dev/null; then
            netstat -ano | findstr ":${FRONTEND_PORT}" | findstr "LISTENING" | awk '{print $5}' | cut -d'/' -f1 | xargs -I {} taskkill /PID {} /F 2>/dev/null || true
        fi
    fi
    
    log_success "All services stopped"
}

# Show status
show_status() {
    log_info "Checking service status..."
    
    # Backend
    if is_port_in_use $BACKEND_PORT; then
        log_success "Backend: RUNNING on port ${BACKEND_PORT}"
    else
        log_warning "Backend: NOT RUNNING"
    fi
    
    # Frontend
    if is_port_in_use $FRONTEND_PORT; then
        log_success "Frontend: RUNNING on port ${FRONTEND_PORT}"
    else
        log_warning "Frontend: NOT RUNNING"
    fi
    
    # Health check
    if curl -s "$HEALTH_CHECK_URL" | grep -q '"status":"ok"'; then
        log_success "Health Check: PASSED"
    else
        log_warning "Health Check: FAILED"
    fi
}

# Start services
start_services() {
    log_info "Starting Nicat Dev Server..."
    echo ""
    
    # Check if ports are already in use
    if is_port_in_use $BACKEND_PORT; then
        log_warning "Port ${BACKEND_PORT} is already in use"
        log_info "Backend might already be running. Attempting to continue..."
    fi
    
    # Start Backend
    log_info "Starting Backend (NestJS) on port ${BACKEND_PORT}..."
    cd "$(dirname "$0")"
    npm run start:dev > /tmp/nicat-backend.log 2>&1 &
    echo $! > "$BACKEND_PID_FILE"
    log_success "Backend started with PID $(cat $BACKEND_PID_FILE)"
    
    # Wait for backend to be ready
    if ! wait_for_backend; then
        log_error "Failed to start backend. Check logs at /tmp/nicat-backend.log"
        stop_services
        exit 1
    fi
    
    # Start Frontend
    log_info "Starting Frontend (Next.js) on port ${FRONTEND_PORT}..."
    cd frontend
    npm run dev > /tmp/nicat-frontend.log 2>&1 &
    echo $! > "../$FRONTEND_PID_FILE"
    cd ..
    log_success "Frontend started with PID $(cat $FRONTEND_PID_FILE)"
    
    # Wait for frontend to be ready
    log_info "Waiting for frontend to be ready on port ${FRONTEND_PORT}..."
    local counter=0
    while [ $counter -lt 20 ]; do
        if curl -s -o /dev/null -w "%{http_code}" "http://localhost:${FRONTEND_PORT}" | grep -q "200"; then
            log_success "Frontend is ready!"
            break
        fi
        counter=$((counter + 1))
        sleep 1
        echo -n "."
    done
    echo ""
    
    # Final status
    echo ""
    echo "============================================"
    log_success "Nicat Dev Server is running!"
    echo "============================================"
    echo ""
    echo "  Frontend:  http://localhost:${FRONTEND_PORT}"
    echo "  Backend:   http://localhost:${BACKEND_PORT}"
    echo "  API Docs:  http://localhost:${BACKEND_PORT}/api/docs"
    echo "  Health:    http://localhost:${BACKEND_PORT}/api/v1/health"
    echo ""
    echo "  Network:   http://$(hostname -I 2>/dev/null | awk '{print $1}' || echo '192.168.x.x'):${FRONTEND_PORT}"
    echo ""
    echo "  Logs:"
    echo "    Backend:  /tmp/nicat-backend.log"
    echo "    Frontend: /tmp/nicat-frontend.log"
    echo ""
    echo "  To stop:   ./start-dev.sh --stop"
    echo "  Status:    ./start-dev.sh --status"
    echo "============================================"
}

# ============================================
# Main
# ============================================

case "${1}" in
    --stop)
        stop_services
        ;;
    --status)
        show_status
        ;;
    *)
        start_services
        ;;
esac
