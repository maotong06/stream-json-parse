import * as path from 'path';
import { jsonParse, arrayItemSymbol } from '../src/lib/parse'
import * as fs from 'fs-extra'
import _ from 'lodash'
import { getIsSubset, getIsSubsetByPath } from './utils'

/** 直接完成的 */
test('one time', done => {
  const json = fs.readJsonSync(path.join(__dirname, './json/miniTree.json'))
  const jsonStr = JSON.stringify(json)
  const {
    parseGenerate,
    updateText,
  } = jsonParse({
    jsonCallback: (err, isDone, val) => {
      if (err) {
        done(err)
      } else {
        try {
          expect(isDone).toEqual(true)
          expect(val).toEqual(
            json
          )
          done()
        } catch (error) {
          done(error)
        }
      }
    }
  })

  const parseCtrl = parseGenerate()
  parseCtrl.next()
  updateText(jsonStr, true);
  parseCtrl.next()
});



/** 分批完成的 */
test('stream', done => {
  const json = fs.readJsonSync(path.join(__dirname, './json/array.json'))
  const jsonStr = JSON.stringify(json)
  const strLength = jsonStr.length
  const jsonStrSplitArr: string[] = []
  let currentUpdateIndex: number = 0
  const splitLength = 100
  for (let i = 0; i < strLength; i += splitLength) {
    jsonStrSplitArr.push(jsonStr.slice(i, i + splitLength))
  }
  let currentObj: any = null
  // 每次都比上次多
  let lastLength = 0

  const {
    parseGenerate,
    updateText,
  } = jsonParse({
    updatePeriod: 100,
    jsonCallback: (err, isDone, value) => {
      if (err) {
        done(err)
      } else {
        try {
          if (isDone) {
            expect(value).toEqual(json)
            done()
          } else {
            currentObj = value
            const currentLength = JSON.stringify(currentObj).length
            const checkLength = currentLength <= (currentUpdateIndex + 1) * splitLength && currentLength > lastLength
            const isSub = getIsSubset(currentObj, json)
            if (checkLength && isSub) {
              lastLength = currentLength
            } else {
              done('length error')
            }
          }
        } catch (error) {
          done(error)
        }
      }
    }
  })

  const parseCtrl = parseGenerate()
  parseCtrl.next()
  let timer = setInterval(() => {
    let isEnd = currentUpdateIndex === jsonStrSplitArr.length - 1
    updateText(jsonStrSplitArr[currentUpdateIndex], isEnd)
    parseCtrl.next()
    currentUpdateIndex++
    isEnd && clearInterval(timer)
  }, 1)
})

/**  特定路径 */
test('path test', done => {
  const json = fs.readJsonSync(path.join(__dirname, './json/bigJson1.json'))
  const jsonStr = JSON.stringify(json)
  const strLength = jsonStr.length
  const jsonStrSplitArr: string[] = []
  let currentUpdateIndex: number = 0
  const splitLength = _.random(800, 1000)
  for (let i = 0; i < strLength; i += splitLength) {
    jsonStrSplitArr.push(jsonStr.slice(i, i + splitLength))
  }
  let currentObj: any = null
  // 每次都比上次多
  let lastLength = 0
  const completeItemPath = ['data', arrayItemSymbol]

  const {
    parseGenerate,
    updateText,
  } = jsonParse({
    updatePeriod: 100,
    completeItemPath,
    jsonCallback: (err, isDone, value) => {
      if (err) {
        done(err)
      } else {
        try {
          if (isDone) {
            expect(value).toEqual(json)
            done()
          } else {
            currentObj = value
            const currentLength = JSON.stringify(currentObj).length
            const checkLength = currentLength <= (currentUpdateIndex + 1) * splitLength && currentLength > lastLength
            const isSub = getIsSubsetByPath(currentObj, json, completeItemPath)
            // console.log('currentObj', currentLength)
            if (checkLength && isSub) {
              lastLength = currentLength
            } else {
              fs.writeFileSync(path.join(__dirname, './log.json'), JSON.stringify(currentObj, null, 4))
              done('test error')
            }
          }
        } catch (error) {
          done(error)
        }
      }
    }
  })

  const parseCtrl = parseGenerate()
  parseCtrl.next()
  let timer = setInterval(() => {
    let isEnd = currentUpdateIndex === jsonStrSplitArr.length - 1
    updateText(jsonStrSplitArr[currentUpdateIndex], isEnd)
    parseCtrl.next()
    currentUpdateIndex++
    isEnd && clearInterval(timer)
  }, 1)
})

