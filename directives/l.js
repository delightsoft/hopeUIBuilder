import Vue from 'vue'
import localizationHelper from './localizationHelper'

export default {
  bind(el, binding, vnode) {
    if (vnode.context.$debug) {
      el.style.position = 'relative';
      const component = new Vue(localizationHelper).$mount();
      Vue.set(component, 'value', binding.value);
      el.appendChild(component.$el);
    }
  },
}
