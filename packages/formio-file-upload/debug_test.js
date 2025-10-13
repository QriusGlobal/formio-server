// Quick debug of the issue
const file = {
  bits: ['Hello World'],
  name: 'test.txt',
  options: { type: 'text/plain' },
  size: 11,
  type: 'text/plain',
  
  slice(start = 0, end = this.size, contentType) {
    console.log('slice called:', { start, end, contentType });
    const combinedBuffer = this.bits.reduce((acc, bit) => {
      if (typeof bit === 'string') {
        // TextEncoder is not defined in JSDOM!
        console.log('Need TextEncoder for:', bit);
        try {
          const encoder = new TextEncoder();
          return [...acc, ...Array.from(encoder.encode(bit))];
        } catch (e) {
          console.error('TextEncoder error:', e.message);
          return acc;
        }
      }
      return acc;
    }, []);
    
    const slicedData = combinedBuffer.slice(start, end);
    const slicedArray = new Uint8Array(slicedData);
    
    return {
      size: slicedArray.byteLength,
      type: contentType || this.type,
      arrayBuffer: () => Promise.resolve(slicedArray.buffer)
    };
  },
  
  arrayBuffer() {
    return this.slice(0, this.size).arrayBuffer();
  }
};

// Simulate what happens
(async () => {
  console.log('File size:', file.size);
  const chunk = file.slice(0, file.size);
  console.log('Chunk size:', chunk.size);
  const buffer = await chunk.arrayBuffer();
  console.log('ArrayBuffer size:', buffer.byteLength);
  console.log('Success!');
})().catch(err => console.error('Failed:', err));
