import init from './index.js'
import h from './h.js'
import propsModule from './modules/props.js'
import styleModule from './modules/style.js'
import classModule from './modules/class.js'

const patch = init([
  classModule,
  propsModule,
  styleModule
])

export const snabbdomBuddle = { patch, h }
export default snabbdomBuddle