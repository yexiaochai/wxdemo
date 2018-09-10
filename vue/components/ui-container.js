
export default {
  name: 'ui-container',
  data: {
    props: {
      isShow: {
        type: String,
        default: ''
      }
    },
    methods: {
      onMaskClick: function(e) {
        if(e.target.dataset.type === 'mask') {
          this.$emit(this.maskEventName);
          // this.isShow = 'none';
        }
      }
    },
    data: function() {
      return {
        maskEventName: 'onmaskevent',
        zIndex: 3000
      }
    },
    template:
`
<div @click="onMaskClick" data-type="mask" class="cm-overlay"  :style="{zIndex: zIndex, display: isShow}" >
  <div class="cm-modal " :style="{zIndex: zIndex + 1, position: 'fixed', bottom: 0}">
    <slot ></slot>
  </div>
</div>
`
}
}
