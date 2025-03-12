/**
 * Checks if the given value is a valid version 4 UUID.
 *
 * @param value - The value to be checked.
 * @return Returns true if the value is a valid version 4 UUID, otherwise false.
 */
export function isUUIDValidV4(value: string): boolean {
  const rgx =
    /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i

  return rgx.test(value)
}
