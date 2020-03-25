export const  generateHexString = function (len = 8) {

    const hex = "0123456789ABCDEF"
    let output = ""
    for (let i = 0; i < len; ++i) {
        output += hex.charAt(Math.floor(Math.random() * hex.length))
    }
    return output
}