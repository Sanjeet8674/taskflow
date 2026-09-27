import { describe, expect, it } from '@jest/globals';
import { hashToken, refreshExpiryDate } from '../src/utils/tokens.js';

describe('token utils', () => {
  it('hashes tokens with sha256 hex', () => {
    const hash = hashToken('sample-token');
    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[a-f0-9]+$/);
  });

  it('computes a future refresh expiry', () => {
    const expiry = refreshExpiryDate();
    expect(expiry.getTime()).toBeGreaterThan(Date.now());
  });
});
