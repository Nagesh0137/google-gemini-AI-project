#!/usr/bin/env python3
"""
Simple HTTP server for the Gemini AI Clone project.
This server adds proper CORS headers and serves static files.
"""

import http.server
import socketserver
import os
import sys
from urllib.parse import urlparse

class CORSHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """HTTP request handler with CORS headers."""
    
    def end_headers(self):
        """Add CORS headers to all responses."""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()
    
    def do_OPTIONS(self):
        """Handle OPTIONS requests for CORS preflight."""
        self.send_response(200)
        self.end_headers()
    
    def log_message(self, format, *args):
        """Custom log format."""
        print(f"[{self.log_date_time_string()}] {format % args}")

def run_server(port=8000, directory=None):
    """Run the HTTP server."""
    if directory:
        os.chdir(directory)
    
    # Ensure we're in the correct directory
    if not os.path.exists('index.html'):
        print("Error: index.html not found in current directory!")
        print(f"Current directory: {os.getcwd()}")
        sys.exit(1)
    
    handler = CORSHTTPRequestHandler
    
    try:
        with socketserver.TCPServer(("", port), handler) as httpd:
            print(f"🚀 Gemini AI Clone Server")
            print(f"📂 Serving directory: {os.getcwd()}")
            print(f"🌐 Server running at: http://localhost:{port}")
            print(f"📱 Access from network: http://{get_local_ip()}:{port}")
            print("⚡ Press Ctrl+C to stop the server")
            print("-" * 50)
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ Port {port} is already in use. Try a different port:")
            print(f"   python server.py --port 3000")
        else:
            print(f"❌ Error starting server: {e}")

def get_local_ip():
    """Get local IP address."""
    import socket
    try:
        # Connect to a remote server to get local IP
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except:
        return "localhost"

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Gemini AI Clone Development Server")
    parser.add_argument("--port", "-p", type=int, default=8000, help="Port to run server on (default: 8000)")
    parser.add_argument("--dir", "-d", type=str, help="Directory to serve (default: current directory)")
    
    args = parser.parse_args()
    
    run_server(args.port, args.dir)
