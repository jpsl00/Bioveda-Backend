/**
 * Encodes a given String to B64
 *
 * @export
 * @param {string} data
 * @return {string} B64-encoded String
 */
export function encodeB64(data: string): string {
  return Buffer.from(data).toString("base64");
}

/**
 * Decodes a B64-encoded String
 *
 * @export
 * @param {string} data B64-encoded String
 * @return {string} Decoded String
 */
export function decodeB64(data: string): string {
  return Buffer.from(data, "base64").toString("utf-8");
}
