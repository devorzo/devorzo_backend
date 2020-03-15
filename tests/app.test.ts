// Sample Tests using mocha and assert
import * as assert from "assert"

describe("Array", function () {
    describe("#indexOf()", function () {
        it("should return -1 when the value is not present", function () {
            assert.equal([1, 2, 3].indexOf(4), -1)
        })
    })
})

describe("calculate", function () {
    it("add", function () {
        let result = 5 + 2
        assert.equal(result, 7)
    })
})