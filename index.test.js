const equal = require('assert').deepEqual

let logDB = new Map()

function makeTask (oldTask, payload) {
  return [Date.now(), [...oldTask[1]], payload]
}

function rootTask(p) {
  return makeTask([0, []], p)
}

function pushLogNumber (sinkLog, task) {
  task[1].push(sinkLog)
  return task
}

function printLog(logN) {
  console.log(`log ${logN}`, getLog(logN))
}

function pushTask (logN, task) {
  let log = getLog(logN)
  let sinkTask = pushLogNumber(logN, task)
  log.push(sinkTask)
}

function getLog(logN) {
  if(logDB.get(logN) === undefined) {
    logDB.set(logN, [])
  }
  return logDB.get(logN)
}

function spawn (sourceLog, sinkLog, walker) {
  let logA = getLog(sourceLog)
  let i = 0
  let state = {count:0}
  setInterval(()=> {
    if(logA.length > i) {
      let task = logA[i]
      let [newState, newTask] = walker(state, task)
      state = newState
      pushTask(sinkLog, newTask)
      printLog(sinkLog)
      i += 1
    }
  }, 1)
}

function walkAB (state, task) {
  state.count += 1
  const out = makeTask(task, {name:'foo'})
  return [state, out]
}

const LOGALPHA = 1
const LOGBETA = 2
const LOGCHARLIE = 3

test('one', done => {
  const t1 = rootTask({foo:"bar"})
  pushTask(LOGALPHA, t1)
  spawn(LOGALPHA, LOGBETA, walkAB)
  spawn(LOGBETA, LOGCHARLIE, walkAB)
  setTimeout(()=>{
    printLog(LOGALPHA)
    printLog(LOGBETA)
    printLog(LOGCHARLIE)
    done()
  }, 300)
})
