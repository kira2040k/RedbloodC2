const AesEncryption = require('aes-encryption')
const aes = new AesEncryption()
aes.setSecretKey('11122233344455566677788822244455555555555555555231231321313aaaff')
// Note: secretKey must be 64 length of only valid HEX characters, 0-9, A, B, C, D, E and F

const encrypted = aes.encrypt('some-plain-text')
const decrypted = aes.decrypt(encrypted)

console.log('encrypted >>>>>>', encrypted)
console.log('decrypted >>>>>>', decrypted)