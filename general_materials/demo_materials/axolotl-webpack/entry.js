document.write("<h3>TO THE CONSOLE!</h3>");
var axolotl = require("forward-secrecy");
var nacl = require("tweetnacl");
var base64 = require("base64-js");

var aliceLTK = nacl.box.keyPair();
var alicePEMK = nacl.box.keyPair();
console.log("A0: "+JSON.stringify({publicKey:base64.fromByteArray(alicePEMK.publicKey),secretKey:base64.fromByteArray(alicePEMK.secretKey)}));

var bobLTK = nacl.box.keyPair();
var bobPEMK = nacl.box.keyPair();
console.log("B0: "+JSON.stringify({publicKey:base64.fromByteArray(bobPEMK.publicKey),secretKey:base64.fromByteArray(bobPEMK.secretKey)}));

var aliceSession = new axolotl();
aliceSession
    .identity(aliceLTK)
    .handshake(alicePEMK)
    .theirIdentity(bobLTK.publicKey)
    .theirHandshake(bobPEMK.publicKey)
    .setRole('initiator')
    .computeMasterKey()

var bobSession = new axolotl();
bobSession
    .identity(bobLTK)
    .handshake(bobPEMK)
    .theirIdentity(aliceLTK.publicKey)
    .theirHandshake(alicePEMK.publicKey)
    .setRole('receiver')
    .computeMasterKey()

aliceSession.encrypt('Hello Bob!').then(function (encryptedMessage) {
    console.log("CK-A0-B0 MK-0: "+JSON.stringify(encryptedMessage));
    bobSession.decrypt(encryptedMessage).then(function (result) {
        console.log("CK-A0-B0 MK-0: "+result.cleartext); 
    })
})


aliceSession.encrypt('How is the weather?').then(function (encryptedMessage) {
    console.log("CK-A0-B0 MK-1: "+JSON.stringify(encryptedMessage));
    bobSession.decrypt(encryptedMessage).then(function (result) {
        console.log("CK-A0-B0 MK-1: "+result.cleartext); 
    })
})

aliceSession.encrypt('It is quite rainy here!').then(function (encryptedMessage) {
    console.log("CK-A0-B0 MK-2: "+JSON.stringify(encryptedMessage));
    bobSession.decrypt(encryptedMessage).then(function (result) {
        console.log("CK-A0-B0 MK-2: "+result.cleartext); 
    })
})

var bobPEMK2 = nacl.box.keyPair();
console.log("B1: "+JSON.stringify({publicKey:base64.fromByteArray(bobPEMK2.publicKey),secretKey:base64.fromByteArray(bobPEMK2.secretKey)}));

var alicePEMK2 = nacl.box.keyPair();
console.log("A1: "+JSON.stringify({publicKey:base64.fromByteArray(alicePEMK2.publicKey),secretKey:base64.fromByteArray(alicePEMK2.secretKey)}));

bobSession2 = new axolotl();
bobSession2
    .identity(bobLTK)
    .handshake(bobPEMK2)
    .theirIdentity(aliceLTK.publicKey)
    .theirHandshake(alicePEMK2.publicKey)
    .setRole('initiator')
    .computeMasterKey()

aliceSession2 = new axolotl();
aliceSession2
    .identity(aliceLTK)
    .handshake(alicePEMK2)
    .theirIdentity(bobLTK.publicKey)
    .theirHandshake(bobPEMK2.publicKey)
    .setRole('receiver')
    .computeMasterKey()

bobSession2.encrypt('Hello Alice!').then(function (encryptedMessage) {
    console.log("CK-A1-B1 MK-0: "+JSON.stringify(encryptedMessage));
    aliceSession2.decrypt(encryptedMessage).then(function (result) {
        console.log("CK-A1-B1 MK-0: "+result.cleartext); 
    })
})

bobSession2.encrypt('It is quite sunny here?').then(function (encryptedMessage) {
    console.log("CK-A1-B1 MK-1: "+JSON.stringify(encryptedMessage));
    aliceSession2.decrypt(encryptedMessage).then(function (result) {
        console.log("CK-A1-B1 MK-1: "+result.cleartext); 
    })
})
