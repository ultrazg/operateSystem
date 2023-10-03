/* eslint-disable camelcase */
<template>
  <!--页面导航栏  -->
  <div id="projectApprovalManagement">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="协作" name="cooperation">
        <cooperation v-if="activeName === 'cooperation'" />
      </el-tab-pane>
      <el-tab-pane label="自建" name="oneSelf">
        <oneSelf v-if="activeName === 'oneSelf'" />
      </el-tab-pane>
      <el-tab-pane label="以租代建" name="instead">
        <instead v-if="activeName === 'instead'" />
        <!-- <sameInstead /> -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import cooperation from './cooperation.vue';
import oneSelf from './oneSelf.vue';
import instead from './instead.vue';
export default {
  name: 'projectApprovalManagement',
  inject: ['common'],
  data() {
    return {
      activeName: 'cooperation',
    };
  },
  components: {
    cooperation,
    oneSelf,
    instead,
    // sameInstead,
  },
  mounted() {
    // this.$nextTick(() => {});
  },
  methods: {},
};
</script>

<style lang="less" scoped>
#projectApprovalManagement {
}
</style>
