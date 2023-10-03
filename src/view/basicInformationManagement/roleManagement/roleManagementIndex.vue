/* eslint-disable camelcase */
<template>
  <div id="roleManagementIndex">
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
          :data="tableData"
          :cols="tableCols"
          :loading="loading"
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
                title="配置权限"
                v-if="$_hasOperation(routerCode, 'addRolePermissions')"
                @click.prevent.stop="
                  openDialog('configurePermissions', '配置权限', {
                    row: scope.row,
                    type: 'configurePermissions',
                    configType: 'configurePermissions',
                  })
                "
              >
                配置权限
              </el-button>
              <el-button
                type="text"
                size="small"
                title="编辑"
                v-if="$_hasOperation(routerCode, 'edit')"
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
                title="删除"
                v-if="$_hasOperation(routerCode, 'delete')"
                icon="iconfont icon-shanchu"
                @click.prevent.stop="deleteRole(scope.row)"
              >
                删除
              </el-button>
              <span v-if="scope.row.enabled">
                <el-button
                  type="text"
                  size="small"
                  title="禁用"
                  v-if="$_hasOperation(routerCode, 'disable')"
                  icon="iconfont icon-zhuxiao"
                  @click.prevent.stop="disableRole(scope.row)"
                >
                  禁用
                </el-button>
              </span>
              <span v-else>
                <el-button
                  type="text"
                  size="small"
                  title="启用"
                  v-if="$_hasOperation(routerCode, 'enable')"
                  icon="iconfont icon-check"
                  @click.prevent.stop="enableRole(scope.row)"
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
  listRolesByCondition,
  deleteRole,
  disableRole,
  enableUser,
} from '@/api/basicInformationManagement/roleManagementIndex';
export default {
  name: 'roleManagementIndex',
  inject: ['common'],
  data() {
    return {
      loading: false,
      dialogTitle: '',
      searchVal: {
        roleName: '',
        status: '',
      },
      searchItems: [
        {
          type: 'input',
          label: '角色名称',
          initValue: '',
          props: {
            fieldName: 'roleName',
          },
        },
        {
          type: 'select',
          label: '角色状态',
          initValue: '',
          props: {
            fieldName: 'status',
            filterable: true,
            options: [
              {
                name: '启用',
                id: '1',
              },
              {
                name: '禁用',
                id: '0',
              },
            ],
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
          label: '角色ID',
          prop: 'id',
          align: 'center',
        },
        {
          label: '角色名称',
          prop: 'roleName',
          align: 'center',
        },
        {
          label: '角色备注',
          prop: 'remark',
          align: 'center',
        },
        {
          label: '角色状态',
          prop: 'enabled',
          align: 'center',
          render: (h, scope) => {
            const text = scope.row.enabled ? '启用' : '禁用';

            return <div>{{ text }}</div>;
          },
        },
        {
          label: '角色类型',
          prop: 'type',
          align: 'center',
        },
        {
          label: '角色附带值',
          prop: 'roleValue',
          align: 'center',
        },
        {
          label: '创建时间',
          prop: 'createTime',
          align: 'center',
        },
        {
          label: '创建人员',
          prop: 'createUser',
          align: 'center',
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
      this.dialogTitle = '角色新增';
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

      listRolesByCondition(parames).then((res) => {
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
      this.onCurrentChange(1);
    },
    // 删除角色
    deleteRole(row) {
      this.$confirm('确定删除当前角色?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        deleteRole(row.id).then((res) => {
          if (res.code === '200') {
            this.$message({
              type: 'success',
              message: '删除成功!',
            });
            this.getDataAllList();
          }
        });
      });
    },
    disableRole(row) {
      this.$confirm('确定禁用当前角色?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        disableRole(row.id).then((res) => {
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
    enableRole(row) {
      this.$confirm('确定启用当前角色?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        enableUser(row.id).then((res) => {
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
  },
};
</script>

<style lang="less" scoped>
#roleManagementIndex {
}
</style>
