import { fetchStreamJson, arrayItemSymbol } from '../src'
const { createApp, ref } = window.Vue

createApp({
  setup() {
    const arr = ref([])
    const times = ref(0)

    let intTime = 0
    function startCount() {
      clearInterval(intTime)
      const startTime = window.performance.now()
      times.value = 0
      intTime = setInterval(() => {
        times.value = parseInt(window.performance.now() - startTime)
      }, 20)
    }
    function stopCount() {
      console.log('intTime', intTime)
      clearInterval(intTime)
    }

    function fetchJson() {
      startCount()
      arr.value = []
      fetchStreamJson({
        url: './bigJson1.json',
        JSONParseOption: {
          completeItemPath: ['data', arrayItemSymbol],
          protoAction: 'ignore',
          updatePeriod: 100,
          constructorAction: 'ignore',
          jsonCallback: (error, isDone, val) => {
            console.log('jsonCallback', error, isDone, val)
            arr.value = val.data
            if (isDone) {
              stopCount()
            }
          },
          diffCallBack: (text, isEq) => {
            console.log('1')
          }
        },
        fetchOptions: {
          cache: 'no-store'
        }
      })
    }

    function fetchNormal() {
      startCount()
      arr.value = []
      fetch('./bigJson1.json', {
        cache: 'no-store'
      }).then(res => {
        return res.json()
      }).then(res => {
        arr.value = res.data
        stopCount()
      })
    }
    return {
      arr,
      times,
      fetchJson,
      fetchNormal
    }
  }
}).mount('#app')

