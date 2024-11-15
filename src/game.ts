import kaplay from "kaplay"
import "kaplay/global"

const k = kaplay({
  background: [0, 0, 0],
})

type States = "greet" | "ready" | "initial" | "input-from" | "input-to"

export {k, States}
