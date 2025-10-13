// Test TextEncoder in Jest/JSDOM environment
console.log('Node.js TextEncoder:', typeof TextEncoder);
console.log('Node.js global.TextEncoder:', typeof global.TextEncoder);

// Simulate JSDOM environment
delete global.TextEncoder;
console.log('After delete - TextEncoder:', typeof TextEncoder);
console.log('After delete - global.TextEncoder:', typeof global.TextEncoder);

// Check if util.TextEncoder works
const util = require('util');
console.log('util.TextEncoder:', typeof util.TextEncoder);

// Try to use it
try {
  const encoder = new util.TextEncoder();
  const encoded = encoder.encode('Hello');
  console.log('Encoding works:', encoded);
} catch (e) {
  console.error('Encoding failed:', e.message);
}
