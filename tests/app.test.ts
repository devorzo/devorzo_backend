// Sample Tests using mocha and assert
import * as assert from 'assert';

describe('Array', () => {
  describe('#indexOf()', () => {
    it('should return -1 when the value is not present', () => {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});

describe('calculate', () => {
  it('add', () => {
    const result = 5 + 2;
    assert.equal(result, 7);
  });
});
