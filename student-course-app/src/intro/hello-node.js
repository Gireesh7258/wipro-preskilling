// Node version
console.log("Node Version:", process.version);

// Current file & directory
console.log("File Name:", __filename);
console.log("Directory Name:", __dirname);

// Welcome message every 3 seconds
const interval = setInterval(() => {
  console.log("Welcome to Node.js 🚀");
}, 3000);

// Stop after 10 seconds
setTimeout(() => {
  clearInterval(interval);
  console.log("Timer stopped after 10 seconds.");
}, 10000);