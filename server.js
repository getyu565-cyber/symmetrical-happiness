const { WebSocketServer } = require('ws');

// Determine the port from environment variables or default to 8080
const PORT = process.env.PORT || 8080;

// Initialize the WebSocket server
const wss = new WebSocketServer({ port: PORT });

// Payload to send when the correct path is requested
const urlResponsePayload = JSON.stringify({
  success: true,
  urls: [
    {
      id: "google",
      name: "Google",
      url: "https://google.com",
      display_url: "https://google.com"
    },
    {
      id: "github",
      name: "GitHub",
      url: "https://github.com",
      display_url: "https://github.com"
    }
  ]
});

wss.on('connection', (ws, req) => {
  const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;

  // Check if the connection matches the desired WebSocket path
  if (pathname === '/api/get-url') {
    console.log(`[Connected] Client connected to /api/get-url`);

    // Send the requested URL data immediately upon connection
    ws.send(urlResponsePayload);

    // Optional: Handle incoming messages if needed
    ws.on('message', (message) => {
      console.log(`Received message: ${message}`);
    });

    ws.on('close', () => {
      console.log('[Disconnected] Client disconnected from /api/get-url');
    });
  } else {
    // Reject or close connections to invalid paths
    console.log(`[Rejected] Connection attempt to invalid path: ${pathname}`);
    ws.close(4004, 'Endpoint not found');
  }
});

console.log(`WebSocket server is running and listening on port ${PORT}`);
