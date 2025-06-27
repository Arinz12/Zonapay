function emailHash(email) {
    if (!email || typeof email !== 'string') {
      throw new Error('Invalid email input');
    }
  
    // Convert to Base64 and replace special characters
    const base64 = Buffer.from(email).toString('base64');
    
    // Replace problematic characters with safe alternatives
    const safeString = base64
      .replace(/\+/g, '-')   // Replace + with -
      .replace(/\//g, '_')   // Replace / with _
      .replace(/=/g, '');    // Remove padding =
      
    return safeString;
  }
    // Decrypt back to original

  function emailHashRvsl(hashedString) {
    if (!hashedString || typeof hashedString !== 'string') {
      throw new Error('Invalid hashed string input');
    }
  
    // Restore original Base64 characters
    const base64 = hashedString
      .replace(/-/g, '+')   // Restore - to +
      .replace(/_/g, '/');   // Restore _ to /
      
    // Add padding if needed (Base64 strings should be multiple of 4)
    const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
      
    // Convert back from Base64
    return Buffer.from(padded, 'base64').toString('utf8');
  }
  
  module.exports={emailHash,emailHashRvsl}