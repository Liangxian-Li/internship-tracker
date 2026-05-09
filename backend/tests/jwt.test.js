const { createToken } = require('../src/utils/jwt');

describe('createToken', () => {
  test('should return a JWT token string', () => {
    process.env.JWT_SECRET = 'test_secret_key';

    const token = createToken('123456789');

    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
  });
});