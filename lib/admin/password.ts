import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

const hashPrefix = "scrypt";
const keyLength = 64;

export function hashAdminPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, keyLength).toString("hex");

  return `${hashPrefix}:${salt}:${hash}`;
}

export function verifyAdminPasswordHash(password: string, storedHash: string) {
  const [prefix, salt, hash] = storedHash.split(":");

  if (prefix !== hashPrefix || !salt || !hash) {
    return false;
  }

  const expected = Buffer.from(hash, "hex");
  const received = scryptSync(password, salt, keyLength);

  return (
    expected.length === received.length &&
    timingSafeEqual(expected, received)
  );
}
