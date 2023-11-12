import { getIsSubset, getIsSubsetByPath } from './utils'
/** 测试工具函数 getIsSubset */
test('getIsSubset', () => {
  const obj1 = {
    a: 1,
  }
  const obj2 = {
    a: 1,
    b: 2,
    c: [1,2]
  }
  const obj3 = {
    a: 1,
    b: 2,
    c: [1,2,3]
  }
  expect(getIsSubset(obj1, obj2)).toBe(true)
  expect(getIsSubset(obj2, obj3)).toBe(true)
  expect(getIsSubset(obj3, obj3)).toBe(true)
})

test('getIsSubset', () => {
  const path = ['c', '[]']
  const obj1 = {
    a: 1,
  }
  const obj2 = {
    a: 1,
    b: 2,
    c: [{a: 1}, {}]
  }
  const obj3 = {
    a: 1,
    b: 2,
    c: [{a: 1}]
  }
  const obj4 = {
    a: 1,
    b: 2,
    c: [{a: 1}, {b:2}]
  }
  expect(getIsSubsetByPath(obj1, obj4, path)).toBe(true)
  expect(getIsSubsetByPath(obj2, obj4, path)).toBe(false)
  expect(getIsSubsetByPath(obj3, obj4, path)).toBe(true)
  expect(getIsSubsetByPath(obj4, obj4, path)).toBe(true)
})