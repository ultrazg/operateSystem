/* eslint-disable camelcase */
<template>
  <div id="resourcesIndex">
    <!-- 按钮 -->
    <el-button size="small" type="primary" @click.prevent.stop="updataResources()">更新资源可用性</el-button>
    <!-- 页面 -->
    <div class="content-view">
      <div class="Modeltable">
        <el-tree
          :data="treeData"
          ref="permissionsListTree"
          show-checkbox
          default-expand-all
          node-key="id"
          :default-checked-keys="checkedKeys"
          :props="defaultProps"
        >
        </el-tree>
        <div v-show="false" class="nonedata">
          <div>
            <img src="~common/images/emptyData.png" alt="" />
            <p>暂无数据，晚点再来吧</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toTree } from 'util/util';
import { listAllPermissions } from '@/api/basicInformationManagement/resourcesManagement';
export default {
  name: 'resourcesIndex',
  inject: ['common'],
  data() {
    return {
      defaultProps: {
        label: 'permissionName',
      },
      treeData: [],
      checkedKeys: [],
      rolesListData: [],
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getListAllPermissions();
    });
  },
  methods: {
    getListAllPermissions() {
      listAllPermissions().then((res) => {
        this.treeData = toTree(res.data);
        this.checkedKeys = this.checkTree(res.data);
      });
    },
    // 获取当前被选中的数
    checkTree(treeData) {
      if (!treeData) {
        return [];
      }
      const check = [];

      treeData.forEach((item) => {
        if (item.isCheck) {
          check.push(item.id);
        }
      });

      return check;
    },
    updataResources() {
      this.getListAllPermissions();
    },
  },
};
</script>

<style lang="less" scoped>
#resourcesIndex {
}
</style>
