import { isEqual } from 'lodash'
/** 获取类型 */
export function getType(value: any): string {
  return Object.prototype.toString.call(value).slice(8, -1)
}

// 一个函数，递归检查对象的每个属性，如果是数组，就检查每个元素，是否在另一个对象上，如果都是子集，就返回true
export function getIsSubset(subObj: any, fullObj: any): boolean {
  if (getType(subObj) !== getType(fullObj)) {
    return false  
  }
  if (subObj === fullObj) {
    return true
  }
  if (Array.isArray(subObj) && Array.isArray(fullObj)) {
    if (subObj.length > fullObj.length) {
      return false
    }
    for (let i = 0; i < subObj.length; i++) {
      const element = subObj[i];
      if (!getIsSubset(element, fullObj[i])) {
        return false
      }
    }
    return true
  } else {
    const keys1 = Object.keys(subObj)
    const keys2 = Object.keys(fullObj)
    if (keys1.length > keys2.length) {
      return false
    }
    for (let i = 0; i < keys1.length; i++) {
      const key = keys1[i];
      if (!getIsSubset(subObj[key], fullObj[key])) {
        return false
      }
    }
    return true
  }
}

/**  判断 2 个对象是否是子集，如果到了指定路径下，则判断是否完全相等 */
export function getIsSubsetByPath(subObj: any, fullObj: any, path: (string|symbol)[], isRightPath = true): boolean {
  if (getType(subObj) !== getType(fullObj)) {
    return false  
  }
  if (subObj === fullObj) {
    return true
  }
  if (path.length === 0 && isRightPath) {
    return isEqual(subObj, fullObj)
  }
  const currentPath = path[0]
  if (Array.isArray(subObj) && Array.isArray(fullObj)) {
    if (subObj.length > fullObj.length) {
      return false
    }
    for (let i = 0; i < subObj.length; i++) {
      const element = subObj[i];
      //  当前路径正确
      if (isRightPath && currentPath === '[]') {
        if (!getIsSubsetByPath(element, fullObj[i], path.slice(1), true)) {
          return false
        }
      } else {
        if (!getIsSubset(element, fullObj[i])) {
          return false
        }
      }
    }
    return true
  } else {
    const keys1 = Object.keys(subObj)
    const keys2 = Object.keys(fullObj)
    if (keys1.length > keys2.length) {
      return false
    }
    const currentPath = path[0]
    for (let i = 0; i < keys1.length; i++) {
      const key = keys1[i];
      if (isRightPath && currentPath === key) {
        if (!getIsSubsetByPath(subObj[key], fullObj[key], path.slice(1), true)) {
          return false
        }
      } else {
        if (!getIsSubset(subObj[key], fullObj[key])) {
          return false
        }
      }
    }
    return true
  }
}