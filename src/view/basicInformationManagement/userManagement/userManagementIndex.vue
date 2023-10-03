/* eslint-disable camelcase */
<template>
  <div id="userManagementIndex">
    <!-- 搜索框 -->
    <header-title>
      <search-form
        ref="searchForm"
        slot="searchBox"
        :searchItems="searchItems"
        :addBtnVisible="$_hasOperation(routerCode, 'add')"
        :addTitleBtn="'新增'"
        @onSearch="onSearch"
        @onChange="onChange"
        @onReset="onReset"
        @onAddBtn="onAddBtn"
      />
    </header-title>
    <!-- 页面 -->
    <div class="content-view">
      <div class="Modeltable">
        <page-table
          ref="pageTable"
          col-align="left"
          operator-width="110"
          :hideDefaultIndex="true"
          :loading="loading"
          :data="tableData"
          :cols="tableCols"
          :selection="false"
          :operator="true"
          reserveSelection
          :row-key="getRowKey"
          :page-current="page.current"
          :total="page.total"
          :page-size="page.pageSize"
          @selection-change="onSelectionChange"
          @current-change="onCurrentChange"
          @size-change="onPageSizeChange"
        >
          <template slot-scope="scope" slot="operator">
            <flex>
              <el-button
                type="text"
                size="small"
                title="配置角色"
                icon="iconfont icon-jiaoseguanli"
                v-if="$_hasOperation(routerCode, 'addUserRole')"
                @click.prevent.stop="
                  openDialog('configureRoles', '配置角色', {
                    row: scope.row,
                    type: 'configureRoles',
                    configType: 'configureRoles',
                  })
                "
              >
                配置角色
              </el-button>
              <el-button
                type="text"
                size="small"
                title="编辑"
                v-if="$_hasOperation(routerCode, 'edit')"
                icon="iconfont icon-bianji"
                @click.prevent.stop="
                  openDialog('edit', '编辑', {
                    row: scope.row,
                    type: 'handle',
                    configType: 'edit',
                  })
                "
              >
                编辑
              </el-button>
              <el-button
                type="text"
                size="small"
                title="重置密码"
                v-if="$_hasOperation(routerCode, 'edit')"
                icon="iconfont icon-huanyuan"
                @click.prevent.stop="resetPassword(scope.row)"
              >
                重置密码
              </el-button>
              <span v-if="scope.row.enabled && $_hasOperation(routerCode, 'disable')">
                <el-button
                  type="text"
                  size="small"
                  title="禁用"
                  icon="iconfont icon-zhuxiao"
                  @click.prevent.stop="disableUser(scope.row)"
                >
                  禁用
                </el-button>
              </span>
              <span v-if="$_hasOperation(routerCode, 'enable')">
                <el-button
                  type="text"
                  size="small"
                  title="启用"
                  icon="iconfont icon-check"
                  @click.prevent.stop="enableUser(scope.row)"
                >
                  启用
                </el-button>
              </span>
            </flex>
          </template>
        </page-table>
        <div v-show="false" class="nonedata">
          <div>
            <img src="~common/images/emptyData.png" alt="" />
            <p>暂无数据，晚点再来吧</p>
          </div>
        </div>
      </div>
    </div>

    <edit
      :show="editshow"
      :dialogTitle="dialogTitle"
      :data="editdata"
      @cancel="closeEdit"
      @success="successEdit"
    ></edit>
  </div>
</template>

<script>
import headerTitle from 'components/headerTitle/headerTitle';
import searchForm from 'components/searchForm/searchForm';
import PageTable from '@/components/page-table';
import Flex from '@/components/flex';
import Edit from './Edit';
import {
  getUserListByCondition,
  cancelUser,
  enableUser,
  resetPassword,
} from '@/api/basicInformationManagement/userManagement';
export default {
  name: 'userManagementIndex',
  inject: ['common'],
  data() {
    return {
      loading: false,
      dialogTitle: '',
      searchVal: {
        mobile: '',
        realName: '',
        username: '',
      },
      searchItems: [
        {
          type: 'input',
          label: '用户名称',
          initValue: '',
          props: {
            fieldName: 'username',
          },
        },
        {
          type: 'input',
          label: '姓名',
          initValue: '',
          props: {
            fieldName: 'realName',
          },
        },
        {
          type: 'input',
          label: '手机号码',
          initValue: '',
          props: {
            fieldName: 'mobile',
          },
        },
      ],
      page: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      multipleSelection: [], // 选中表格数据
      tableData: [],
      tableCols: [
        {
          label: '用户名称',
          prop: 'username',
          align: 'center',
        },
        {
          label: '真实姓名',
          prop: 'realName',
          align: 'center',
        },
        {
          label: '性别',
          prop: 'sex',
          align: 'center',
        },
        {
          label: '邮箱',
          prop: 'email',
          align: 'center',
        },
        {
          label: '手机号码',
          prop: 'mobile',
          align: 'center',
          width: 150,
        },
        {
          label: '是否可用',
          prop: 'enabled',
          align: 'center',
          render: (h, scope) => {
            const text = scope.row.enabled ? '是' : '否';

            return <div>{{ text }}</div>;
          },
        },
        {
          label: '创建时间',
          prop: 'createTime',
          align: 'center',
          width: 150,
        },
      ],
      editshow: false,
      editdata: {},
    };
  },
  components: {
    headerTitle,
    searchForm,
    PageTable,
    Flex,
    Edit,
  },
  mounted() {
    this.$nextTick(() => {
      this.onSearch();
    });
  },
  methods: {
    // 重置
    onReset() {
      console.log('onReset');
    },
    onChange(val) {
      console.log('onChange');
    },
    // 搜索
    onSearch(val) {
      this.searchVal = {
        ...val,
      };
      this.onCurrentChange(1);
    },
    onAddBtn() {
      this.editdata = {
        row: {},
        type: 'base',
        configType: 'add',
      };
      this.dialogTitle = '新增';
      this.editshow = true;
    },
    // 请求某页数据
    onCurrentChange(val) {
      this.page.current = val;
      this.getDataAllList();
    },
    // 改变请求条数
    onPageSizeChange(val) {
      this.page.pageSize = val;
      this.onCurrentChange(1);
    },
    // 获取所有/查询数据列表
    getDataAllList() {
      this.loading = true;
      const parames = {
        data: {
          ...this.searchVal,
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize,
        sorting: 'id desc',
      };

      getUserListByCondition(parames).then((res) => {
        if (res.code === '200') {
          const { data, total } = res.data;

          this.tableData = data;
          this.page.total = total;
          this.loading = false;
        }
      });
    },
    // 用户数据选择翻页记忆
    getRowKey(row) {
      return row.id;
    },
    // 保存选中表格数据
    onSelectionChange(args) {
      // console.log(args, "选中");
      this.multipleSelection = args;
    },
    // 预览
    openDialog(state, dialogTitle, info = {}) {
      this.editshow = true;
      this.dialogTitle = dialogTitle;
      this.editdata = info;
    },
    // 关闭预览
    closeEdit() {
      this.editshow = false;
      this.editdata = {};
    },
    successEdit() {
      this.closeEdit();
      this.onCurrentChange(this.page.current || 1);
    },
    resetPassword(row) {
      this.$confirm('确定重置当前用户密码?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        resetPassword(row.username).then((res) => {
          if (res.code === '200') {
            this.$message({
              type: 'success',
              message: '重置成功!',
            });
            this.getDataAllList();
          }
        });
      });
    },
    // 禁用用户
    disableUser(row) {
      this.$confirm('确定禁用当前用户?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        cancelUser(row.username).then((res) => {
          if (res.code === '200') {
            this.$message({
              type: 'success',
              message: '禁用成功!',
            });
            this.getDataAllList();
          }
        });
      });
    },
    // 启用用户
    enableUser(row) {
      this.$confirm('确定启用当前用户?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        enableUser(row.username).then((res) => {
          if (res.code === '200') {
            this.$message({
              type: 'success',
              message: '启用成功!',
            });
            this.getDataAllList();
          }
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
#userManagementIndex {
}
</style>
