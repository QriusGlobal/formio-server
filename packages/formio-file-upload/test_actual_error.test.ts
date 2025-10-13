import { calculateFileChecksum } from './src/validators/fileIntegrity';

describe('Debug fileIntegrity', () => {
  it('should show actual error', async () => {
    const file = new File(['Hello World'], 'test.txt', { type: 'text/plain' });
    const result = await calculateFileChecksum(file);
    
    console.log('Full result:', JSON.stringify(result, null, 2));
    console.log('Valid:', result.valid);
    console.log('Error:', result.error);
    console.log('Checksum:', result.checksum);
    
    expect(result.valid).toBe(true);
  });
});
