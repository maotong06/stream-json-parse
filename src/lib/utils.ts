export function structuralClone(obj: any) {
  return new Promise(resolve => {
    const { port1, port2 } = new MessageChannel()
    port2.onmessage = ev => resolve(ev.data)
    port1.postMessage(obj)
  })
}

export function arrayEqual(a: any[], b: any[]) {
  if (a.length === b.length) {
    let len = a.length
    for (let i = len - 1; i >= 0; i--) {
      if (a[i] !== b[i]) return false
    }
    return true
  }
  return false
}


export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}