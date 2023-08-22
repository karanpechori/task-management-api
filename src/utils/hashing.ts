import { randomBytes, pbkdf2 as pbkdf2Cb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const SALT_LENGTH_BYTES = 16;
const HASH_LENGTH_BYTES = 64;
const HASH_ITERATIONS = 1000;
const HASH_DIGEST = "sha512";
const JOIN_CHARACTER = ".";

/*
  Final hash character length will be:
  2 * ( SALT_LENGTH_BYTES + HASH_LENGTH_BYTES ) + JOIN_CHARACTER.length

  For example:
  2 * (16 + 64) + 1 = 161 characters
*/

const pbkdf2 = promisify(pbkdf2Cb);

export async function hash(password: string) {
  const salt = randomBytes(SALT_LENGTH_BYTES).toString("hex");
  const hash = await pbkdf2(
    password,
    salt,
    HASH_ITERATIONS,
    HASH_LENGTH_BYTES,
    HASH_DIGEST
  ).then((x) => x.toString("hex"));
  return `${hash}${JOIN_CHARACTER}${salt}`;
}

export async function verify(password: string, hashedPassword: string) {
  const [originalHash, originalSalt] = hashedPassword.split(JOIN_CHARACTER);

  if (!originalHash || !originalSalt) {
    throw Error("Invalid format for hashed password");
  }

  const originalHashBuffer = Buffer.from(originalHash, "hex");
  const generatedHashBuffer = await pbkdf2(
    password,
    originalSalt,
    HASH_ITERATIONS,
    HASH_LENGTH_BYTES,
    HASH_DIGEST
  );

  return timingSafeEqual(originalHashBuffer, generatedHashBuffer);
}
