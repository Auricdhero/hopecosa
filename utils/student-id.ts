const MIN_VALID_COMPLETION_YEAR = 1900;

export const generateHopecosaStudentId = (
  completionYear?: number | string | null,
) => {
  const parsedYear = Number(completionYear);
  const safeYear =
    Number.isInteger(parsedYear) && parsedYear > MIN_VALID_COMPLETION_YEAR
      ? parsedYear
      : new Date().getFullYear();

  const randomBuffer = new Uint32Array(1);
  crypto.getRandomValues(randomBuffer);
  const randomNumber = randomBuffer[0].toString().padStart(10, "0");

  return `HOPECOSA-${safeYear}-${randomNumber}`;
};
