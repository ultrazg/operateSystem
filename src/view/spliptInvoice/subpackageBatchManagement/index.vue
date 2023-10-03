/* eslint-disable camelcase */
<template>
  <!--页面导航栏  -->
  <div id="subpackageBatchManagement">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="分配" name="distribution">
        <distribution v-if="activeName === 'distribution'" />
      </el-tab-pane>
      <el-tab-pane label="核销" name="writeOff">
        <writeOff v-if="activeName === 'writeOff'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import distribution from './distribution.vue';
import writeOff from './writeOff.vue';
export default {
  name: 'subpackageBatchManagement',
  inject: ['common'],
  data() {
    return {
      activeName: 'distribution',
    };
  },
  components: {
    distribution,
    writeOff,
  },
  mounted() {
    // this.$nextTick(() => {});
  },
  methods: {},
};
</script>

<style lang="less" scoped>
#subpackageBatchManagement {
}
</style>
