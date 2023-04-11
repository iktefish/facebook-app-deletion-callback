const crypto = require("crypto")

console.log("Starting REPL ...")

function b_decode(data) {
    while (data.length % 4 !== 0) {
        data += "+"
    }

    data = data.replace(/-/g, "+").replace(/_/g, "/")
    return new Buffer(data, "base64").toString("utf-8")
}

function parse_fb_signed_req(signed_req, secret) {
    let encoded_data = signed_req.split(".", 2)
    let signature = encoded_data[0]
    let json = b_decode(encoded_data[1])
    let data = JSON.parse(json)

    if (!data.algorithm || data.algorithm.toUpperCase() !== "HMAC-SHA256") {
        console.log("[ERR] data.algorithm~~> ", data.algorithm)
    }

    let expected_signature = crypto
        .createHmac("sha256", secret)
        .update(encoded_data[1])
        .digest("base64")
        .replace(/\//g, "_")
        .replace("=", "")

    if (signature !== expected_signature) {
        console.log("[ERR] signature~~> ", signature)
    }

    return data
}
