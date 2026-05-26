const MIN_VALID_COMPLETION_YEAR = 1900;
const RANDOM_NUMBER_MODULUS = 10_000_000_000n;
const MAX_UINT64 = (1n << 64n) - 1n;
const ACCEPTABLE_MAX = MAX_UINT64 - (MAX_UINT64 % RANDOM_NUMBER_MODULUS);

export const generateHopecosaStudentId = (
  completionYear?: number | string | null,
) => {
  const parsedYear = Number(completionYear);
  const safeYear =
    Number.isInteger(parsedYear) && parsedYear >= MIN_VALID_COMPLETION_YEAR
      ? parsedYear
      : new Date().getFullYear();

  const randomBuffer = new BigUint64Array(1);
  let randomValue = 0n;

  do {
    crypto.getRandomValues(randomBuffer);
    randomValue = randomBuffer[0];
  } while (randomValue >= ACCEPTABLE_MAX);

  const randomNumber = (randomValue % RANDOM_NUMBER_MODULUS)
    .toString()
    .padStart(10, "0");

  return `HOPECOSA-${safeYear}-${randomNumber}`;
};
