/* eslint-disable camelcase */
<template>
  <div id="dictionariesIndex">
    <div class="dictionaries-left">
      <!-- show-checkbox -->
      <el-tree
        class="SingleElection"
        node-key="code"
        ref="tree"
        lazy
        highlight-current
        :data="menuTree"
        :load="loadNode"
        @node-click="nodeClick"
        :default-checked-keys="defaultCheckedKeys"
        :default-expanded-keys="defaultCheckedKeys"
        :check-strictly="true"
        @check-change="checkChange"
        :props="defaultProps"
      ></el-tree>
    </div>
    <div class="dictionaries-right">
      <!-- 搜索框 -->
      <header-title>
        <search-form
          ref="searchForm"
          slot="searchBox"
          :searchItems="searchItems"
          :labelWidth="'90px'"
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
                  @click.prevent.stop="deleteDictionaries(scope.row)"
                >
                  删除
                </el-button>
                <span v-if="scope.row.isEnabled && $_hasOperation(routerCode, 'disEnable')">
                  <el-button
                    type="text"
                    size="small"
                    title="设置为不可用"
                    @click.prevent.stop="disableDictionaries(scope.row)"
                  >
                    设置为不可用
                  </el-button>
                </span>
                <span v-if="$_hasOperation(routerCode, 'enable')">
                  <el-button
                    type="text"
                    size="small"
                    title="设置可用"
                    @click.prevent.stop="enableDictionaries(scope.row)"
                  >
                    设置可用
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
    </div>

    <edit :show="editshow" :data="editdata" @cancel="closeEdit" @success="successEdit"></edit>
  </div>
</template>

<script>
import headerTitle from 'components/headerTitle/headerTitle';
import searchForm from 'components/searchForm/searchForm';
import PageTable from '@/components/page-table';
import Flex from '@/components/flex';
import Edit from './Edit';
import {
  dictionaryListByParentId,
  dictionaryList,
  disableDictionaries,
  enableDictionaries,
  deleteDictionaries,
} from '@/api/basicInformationManagement/dictionariesIndex';
export default {
  name: 'dictionariesIndex',
  inject: ['common'],
  data() {
    return {
      loading: false,
      treeData: [],
      defaultCheckedKeys: [],
      editCheckId: '',
      menuTree: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: (data) => {
          // if (!data.identification) {
          //   return true;
          // }
        },
      },
      searchVal: {
        enabled: '',
        name: '',
      },
      searchItems: [
        {
          type: 'input',
          label: '字典名称/值',
          initValue: '',
          props: {
            fieldName: 'name',
          },
        },
        {
          type: 'select',
          label: '是否可用',
          initValue: '',
          props: {
            fieldName: 'enabled',
            filterable: true,
            options: [
              {
                name: '是',
                id: 'true',
              },
              {
                name: '否',
                id: 'false',
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
          label: '字典编码',
          prop: 'code',
          align: 'center',
        },
        {
          label: '字典名称',
          prop: 'name',
          align: 'center',
        },
        {
          label: '字典值',
          prop: 'value',
          align: 'center',
        },
        {
          label: '是否可用',
          prop: 'isEnabled',
          align: 'center',
          render: (h, scope) => {
            const text = scope.row.isEnabled ? '是' : '否';

            return <div>{{ text }}</div>;
          },
        },
      ],
      editshow: false,
      editdata: {},
      reqData: {},
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
      this.getTreeList();
      this.onSearch();
    });
  },
  methods: {
    getTreeList() {
      dictionaryList().then((res) => {
        if (res.code === '200') {
          this.formatList(res.data);
          // this.$emit('check-node', res.data[0]);
        }
      });
    },
    checkChange(item, node, self) {
      console.log('checkChange', item, node, self);
      if (node === true) {
        this.editCheckId = item.id;
        this.$refs.tree.setCheckedKeys([item.id]);
        this.getDataAllList();
        // this.$emit('check-node', item);
      } else {
        this.editCheckId = '';
      }
    },
    // 格式化成需要的树结构组
    formatList(list) {
      const root = [];

      const children = [];

      list.forEach((item) => {
        item.parentId = 'ROOT';
        if (item.code === 'ROOT') {
          root.push(item);
        } else {
          children.push(item);
        }
      });

      root[0].children = children;
      this.menuTree = root;
    },
    // 懒加载
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve(this.menuTree);
      }

      if (node.level === 1) {
        return resolve(this.menuTree[0].children);
      }
      // 加载子节点
      if (node.level > 1) {
        this.getTreeListCode(node.data, resolve);
      }
    },
    // 根据code懒加载树节点
    getTreeListCode(node, resolve) {
      const data = {
        data: {
          name: '',
          id: node.id,
          enabled: '',
        },
        pageNo: 1, // 查询的分页页码
        pageSize: 10000, // 查询的分页页大小, 默认10
        sorting: '',
      };

      dictionaryListByParentId(data).then((res) => {
        if (res.code === '200') {
          const arr = res.data.data;

          arr.forEach((item) => {
            item.parentId = node.id;
          });

          resolve(arr);
        }
      });
    },
    nodeClick(item, node, self) {
      this.editCheckId = item.id;

      this.$refs.tree.setCheckedKeys([item.id]);
      if (this.reqData[this.editCheckId]) {
        const { data, total } = this.reqData[this.editCheckId];

        this.tableData = data;
        this.page.total = total;
      } else {
        this.getDataAllList();
      }
    },

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
        row: {
          parentId: this.editCheckId || '0',
        },
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
          id: this.editCheckId || '0',
          ...this.searchVal,
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize,
        sorting: 'id desc',
      };

      dictionaryListByParentId(parames).then((res) => {
        if (res.code === '200') {
          const { data, total } = res.data;

          this.reqData[this.editCheckId] = {
            data,
            total,
          };
          console.log('data', data);
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
      info.parentCode = this.editCheckId || 'ROOT';
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
    disableDictionaries(row) {
      this.$confirm('确定禁用当前字典?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        disableDictionaries(row.id).then((res) => {
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
    enableDictionaries(row) {
      this.$confirm('确定启用当前字典?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        enableDictionaries(row.id).then((res) => {
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
    deleteDictionaries(row) {
      this.$confirm('确定删除当前字典?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        deleteDictionaries(row.id).then((res) => {
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
  },
};
</script>

<style lang="less" scoped>
#dictionariesIndex {
  display: flex;
  .dictionaries-left {
    width: 250px;
  }
  .dictionaries-right {
    flex: 1;
  }
}
</style>
