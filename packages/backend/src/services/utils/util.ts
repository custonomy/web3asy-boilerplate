import { ec } from 'elliptic';
const EC = new ec('secp256k1');
import sha256 from 'sha256';

/**
 * Generate new EC private key
 * @returns {string} EC private key in hex
 */
export const generateECPrivateKey = (): string => {
    const ecKey = EC.genKeyPair();
    return ecKey.getPrivate().toString('hex');
};

/**
 * Get EC public key from private key
 * @param {string} privateKey EC private key in HEX
 * @param {boolean} [compact] Get compact key (default = true)
 * @returns {string} EC public key in HEX
 */
export const getECPublicKey = (privateKey: string, compact: boolean = true): string => {
    if (privateKey.toLowerCase().startsWith('0x')) privateKey = privateKey.slice(2);
    const ecKey = EC.keyFromPrivate(privateKey, 'hex');
    return ecKey.getPublic(compact, 'hex');
};

/**
 * EC sign message
 * @param {string} message message to be signed
 * @param {string} privateKey EC private key in HEX
 * @returns {string} signature in HEX
 */
export const ecSign = (message: string, privateKey: string): string => {
    if (privateKey.toLowerCase().startsWith('0x')) privateKey = privateKey.slice(2);
    const ecKey = EC.keyFromPrivate(privateKey, 'hex');
    return ecKey.sign(sha256(message)).toDER('hex');
};

/**
 * Verify EC signature by public key
 * @param {string} message raw message
 * @param {string} signature signature
 * @param {string} publicKey EC public key in HEX
 * @returns {boolean} EC verify result
 */
export const ecVerify = (message: string, signature: string, publicKey: string): boolean => {
    const ecKey = EC.keyFromPublic(publicKey, 'hex');
    return ecKey.verify(message, signature);
};
