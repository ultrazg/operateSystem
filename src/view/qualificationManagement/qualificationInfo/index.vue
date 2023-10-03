<template>
  <div id="qualificationInfo">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="申请下载记录" name="downRecord">
        <downRecord v-if="activeName === 'downRecord' && $_hasOperation(routerCode, 'applyQuery')" />
      </el-tab-pane>
      <el-tab-pane label="预警提醒信息" name="warnTip">
        <warnTip v-if="activeName === 'warnTip' && $_hasOperation(routerCode, 'tipsQuery')" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import downRecord from './downRecord';
import warnTip from './warnTip';
export default {
  name: 'qualificationInfo',
  inject: ['common'],
  data() {
    return {
      activeName: 'downRecord',
    };
  },
  components: {
    downRecord,
    warnTip,
  },
  mounted() {
    // this.$nextTick(() => {});
  },
  methods: {},
};
</script>

<style lang="less" scoped>
#qualificationInfo {
  /deep/.el-tabs {
    .el-tabs__nav {
      .el-tabs__item {
        &.is-active {
          color: #ea2134;
        }
      }
    }
  }
}
</style>
