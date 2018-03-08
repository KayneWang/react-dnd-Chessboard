let knightPosition = [1, 7]
let observe = null

function emitChange() {
  observe(knightPosition)
}

export function observe(o) {
  if (observe) {
    throw new Error('Multiple observers not implemented.')
  }

  observe = o
  emitChange()
}

export function moveKnight(toX, toY) {
  knightPosition = [toX, toY]
  emitChange()
}

export function canMoveKnight(toX, toY) {
  const [x, y] = knightPosition
  const dx = toX - x
  const dy = toY - y
  return (Math.abs(dx) === 2 && Math.abs(dy) === 1) || (Math.abs(dx) === 1 && Math.abs(dy) === 2)
}