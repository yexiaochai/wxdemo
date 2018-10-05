
import { directiveOn } from './on.js'
import { directiveFor } from './for.js'

export const directive = {
  install: function (MVVM) {
    MVVM.directive = function (name, callhook) {
      let hasDir = false;
      if(!MVVM.prototype.hooks) {
        MVVM.prototype.hooks = {};
      }
      MVVM.prototype.hooks[name] = callhook;
    };

    MVVM.directive('on', directiveOn);
    MVVM.directive('for', directiveFor);

  }
}