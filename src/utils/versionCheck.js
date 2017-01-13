/**
 * @flow
 *
 */

type Result = "GREATER_THEN" | "EQUAL" | "LESS_THEN"

export const GREATER_THEN = 'GREATER_THEN'
export const EQUAL = 'EQUAL'
export const LESS_THEN = 'LESS_THEN'

export function versionCheck(currentVersionString: string, targetVersionString: string): Result {
  function numberialVersion(versionText) {
    return versionText.split('.').map((i) => parseInt(i, 10))
  }

  function compare(currentVersion, targetVersion) {
    const [current, ...restCurrent] = currentVersion
    const [target, ...restTarget] = targetVersion
    if (current == null && target == null) {
      return EQUAL
    }
    if (current === target) {
      return compare(restCurrent, restTarget)
    }

    if (current > target) return GREATER_THEN
    return LESS_THEN
  }

  return compare(
    numberialVersion(currentVersionString),
    numberialVersion(targetVersionString)
  )
}
