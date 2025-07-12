const os = require('os');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      // Skip internal and non-IPv4 addresses
      if (interface.family === 'IPv4' && !interface.internal) {
        return interface.address;
      }
    }
  }
  
  return '127.0.0.1'; // Fallback to localhost
}

const localIP = getLocalIP();
console.log('\n=== Krunker Clone Network Setup ===');
console.log(`Your local IP address: ${localIP}`);
console.log(`Default port: 3000`);
console.log(`Share this URL with others: http://${localIP}:3000`);
console.log('\nTo start the server:');
console.log('1. Run: npm start');
console.log('2. Share the URL above with your friends');
console.log('3. Make sure your firewall allows connections on port 3000');
console.log('\nNote: If you\'re behind a router, you may need to:');
console.log('- Forward port 3000 to your computer');
console.log('- Or use a service like ngrok for external access');
console.log('=====================================\n'); 