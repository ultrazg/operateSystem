<template>
  <div class="comp-collapse">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'collapseComponent',
  componentName: 'collapseComponent',
  props: {
    accordion: Boolean,
    value: {
      type: [Array, String, Number],
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      activeNames: [].concat(this.value),
    };
  },
  provide() {
    return {
      collapse: this,
    };
  },
  methods: {
    setActiveNames(parames) {
      let activeNamesParames = parames;

      activeNamesParames = [].concat(activeNamesParames);
      const value = this.accordion ? activeNamesParames[0] : activeNamesParames;

      this.activeNames = activeNamesParames;
      this.$emit('change', value);
    },
    handleItemClick(item) {
      if (this.accordion) {
        this.setActiveNames(
          (this.activeNames[0] || this.activeNames === 0) && this.activeNames[0] === item.name ? '' : item.name,
        );
      } else {
        const activeNames = this.activeNames.slice(0);

        const index = activeNames.indexOf(item.name);

        if (index > -1) {
          activeNames.splice(index, 1);
        } else {
          activeNames.push(item.name);
        }
        this.setActiveNames(activeNames);
      }
    },
  },
  created() {
    this.$on('item-click', this.handleItemClick);
  },
};
</script>
