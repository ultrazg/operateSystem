<template>
  <!--页面导航栏  -->
  <div id="projectApprovalManagement">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="核算总表" name="total">
        <TrialTable v-if="activeName === 'total'" />
      </el-tab-pane>
      <el-tab-pane label="核算账期表" name="period">
        <ResultTable v-if="activeName === 'period'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import TrialTable from './trialTable';
import ResultTable from './periodTable';
export default {
  name: 'projectApprovalManagement',
  inject: ['common'],
  data() {
    return {
      activeName: 'total',
    };
  },
  components: {
    TrialTable,
    ResultTable,
  },
  mounted() {
    // this.$nextTick(() => {});
  },
  methods: {},
};
</script>

<style lang="less" scoped></style>
