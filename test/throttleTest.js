const {assert} = require('chai')

const RemoteFile = require("../src/io/remoteFile")
const ThrottledFile = require("../src/io/throttledFile")
const RateLimiter = require("../src/io/rateLimiter")


suite('ThrottledFile', function () {

    test('test read range', async function () {

        this.timeout(600000);

        const url = "https://s3.amazonaws.com/igv.org.test/data/BufferedReaderTest.bin"

        const limiter = new RateLimiter(100)
        const file = new ThrottledFile(new RemoteFile({url: url}), limiter)


        for (let start = 25; start < 125; start += 10) {
            const range = {start: start, size: 10};
            const arrayBuffer = await file.read(range.start, range.size)
            assert.ok(arrayBuffer);
            const dataView = new DataView(arrayBuffer);
            for (let i = 0; i < range.size; i++) {
                const expectedValue = -128 + range.start + i;
                const value = dataView.getInt8(i);
                assert.equal(expectedValue, value);
            }
        }
    })

})