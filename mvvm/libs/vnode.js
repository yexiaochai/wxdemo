import init from './snabbdom/index.js'

import klass from './snabbdom/modules/class.js'
import props from './snabbdom/modules/props.js'
import attrs from './snabbdom/modules/attributes.js'
import style from './snabbdom/modules/style.js'
import eventlisteners from './snabbdom/modules/eventlisteners.js'
import h from './snabbdom/h.js'
import VNode from './snabbdom/vnode.js'


export { createElement } from './snabbdom/domApi.js'

export { h }
export { VNode }

export const patch = init([klass, props, attrs, style, eventlisteners])