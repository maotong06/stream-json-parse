import { arrayItemSymbol, createJsonParseWritableStream } from '../src'
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

    async function writeableStream() {
      startCount()
      arr.value = []
      const response = await fetch(
        './bigJson1.json',
        {
          cache: 'no-store'
        }
      )
      response.body
        .pipeThrough(new TextDecoderStream())
        .pipeTo(createJsonParseWritableStream({
          completeItemPath: ['data', arrayItemSymbol],
          protoAction: 'ignore',
          updatePeriod: 100,
          constructorAction: 'ignore',
          jsonCallback: (error, isDone, val) => {
            console.error('jsonCallback', error, isDone, val)
            arr.value = val.data
            if (isDone) {
              stopCount()
            }
          }
        }));
    }
    return {
      arr,
      times,
      fetchNormal,
      writeableStream
    }
  }
}).mount('#app')

