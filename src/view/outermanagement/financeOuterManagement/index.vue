/* eslint-disable camelcase */
<template>
  <div id="financeOuterManagement">
    <!-- 搜索框 -->
    <header-title>
      <search-form
        ref="searchForm"
        slot="searchBox"
        :searchItems="searchItems"
        @onSearch="onSearch"
        @onChange="onChange"
        @onReset="onReset"
        @onAddBtn="onAddBtn"
        :otherBtnVisible="true"
        :otherBtnLists="[
          {
            label: '模板导入',
            click: () =>
              openDialog('import', {
                row: {},
                type: 'import',
                configType: 'import',
              }),
          },
          {
            label: '下载模板',
            click: () => handleDownLoad(),
          },
          {
            label: '导出',
            click: () => handleExport(),
          },
          {
            label: '新增',
            click: () => onAdd(),
          },
          {
            label: '上传回执',
            hide: true,
            click: () => upload(),
          },
        ]"
      />
    </header-title>
    <!-- 页面 -->
    <div class="content-view">
      <div class="Modeltable">
        <page-table
          ref="pageTable"
          col-align="left"
          operator-width="110"
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
                title="查看"
                icon="iconfont icon-yulan"
                v-if="$_hasOperation(routerCode, 'detail')"
                @click.prevent.stop="
                  openDialog('detail', {
                    row: scope.row,
                    type: 'base',
                    configType: 'detail',
                  })
                "
              >
                查看
              </el-button>
              <el-button
                type="text"
                size="small"
                title="编辑外经证"
                v-if="scope.row.status === 'verify_draft' && $_hasOperation(routerCode, 'edit')"
                icon="iconfont icon-bianji"
                @click.prevent.stop="
                  openDialog('editFinance', {
                    row: scope.row,
                    type: 'base',
                    configType: 'edit',
                  })
                "
              >
                编辑
              </el-button>
              <el-button
                type="text"
                size="small"
                title="删除外经证"
                v-if="scope.row.status === 'verify_draft' && $_hasOperation(routerCode, 'delete')"
                icon="iconfont icon-shanchu"
                @click.prevent.stop="
                  openDialog('delFinance', {
                    row: scope.row,
                    type: 'finance',
                    configType: 'delFinance',
                  })
                "
              >
                删除
              </el-button>
              <el-button
                type="text"
                size="small"
                title="回填"
                v-if="
                  scope.row.status === 'verify_pass' &&
                  scope.row.backFillStatus === '待回填' &&
                  $_hasOperation(routerCode, 'backfill')
                "
                icon="iconfont icon-daibanshixiang1"
                @click.prevent.stop="
                  openDialog('backfill', {
                    row: scope.row,
                    type: 'backfill',
                    configType: 'backfill',
                  })
                "
              >
                回填
              </el-button>
              <el-button
                type="text"
                size="small"
                title="发起申请"
                v-if="scope.row.status === 'verify_draft' && $_hasOperation(routerCode, 'submitAudit')"
                icon="iconfont icon-chenggong"
                @click.prevent.stop="
                  openDialog('fabu', {
                    row: { ...scope.row, businessCode: 't_finance_outermanag_apply' },
                    type: 'fabu',
                    configType: 'fabu',
                  })
                "
              >
                发起申请
              </el-button>
              <!-- <el-button
                type="text"
                size="small"
                title="预缴税录入"
                icon="iconfont icon-jia"
                @click.prevent.stop="
                  openDialog('entry', {
                    row: scope.row,
                    type: 'base',
                    configType: 'entryEdit',
                  })
                "
              >
                预缴税录入
              </el-button> -->
              <!-- <el-button
                type="text"
                size="small"
                title="外经证打印"
                v-if="scope.row.status === 'verify_ing'"
                icon="iconfont icon-dayin1"
                @click.prevent.stop="
                  openDialog('printFinance', {
                    row: scope.row,
                    type: 'handle',
                    configType: 'printFinance',
                  })
                "
              >
                外经证打印
              </el-button> -->
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
  pageOutermanag,
  submit,
  deletefinanceOutermanag,
  exportOutermanag,
  deleteOutermanag,
} from '@/api/outermanagement/financeOuterManagement';
import { excelDownload } from '@/api/basicInformationManagement/templetDownloadIndex';
export default {
  name: 'financeOuterManagement',
  inject: ['common'],
  data() {
    return {
      loading: false,
      searchVal: {},
      searchItems: [
        {
          type: 'input',
          label: '外经证编号',
          initValue: '',
          props: {
            fieldName: 'outerCode',
          },
        },
        {
          type: 'input',
          label: '外经证名称',
          initValue: '',
          hide: true,
          props: {
            fieldName: 'outerName',
          },
        },
        {
          type: 'input',
          label: '承揽框架名称',
          initValue: '',
          props: {
            fieldName: 'frameworkName',
          },
        },
        {
          type: 'select',
          label: '使用状态',
          initValue: '',
          props: {
            fieldName: 'useStatus',
            filterable: true,
            options: this.common().useStatus,
          },
        },
        {
          type: 'select',
          label: '申请状态',
          initValue: '',
          props: {
            fieldName: 'status',
            filterable: true,
            options: this.common().verifyStatusCode.filter((codeItem) =>
              ['草稿', '审核中', '审核通过', '审核不通过'].includes(codeItem.name),
            ),
          },
        },
        {
          type: 'select',
          label: '回填状态',
          initValue: '',
          props: {
            fieldName: 'backFillStatus',
            filterable: true,
            options: this.common().backFill,
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
          label: '外经证编号',
          prop: 'outerCode',
          width: '150px',
        },
        // {
        //   label: '外经证名称',
        //   prop: 'outerName',
        //   width: '120px',
        // },
        {
          label: '承揽框架名称',
          prop: 'frameworkName',
          width: '120px',
        },
        {
          label: '涉税金额',
          prop: 'taxAmount',
        },
        {
          label: '延迟次数',
          prop: 'delayCount',
        },
        {
          label: '使用状态',
          prop: 'useType',
        },
        {
          label: '申请状态',
          prop: 'applyStatusInfo',
        },
        {
          label: '回填状态',
          prop: 'backFillStatus',
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

      pageOutermanag(parames).then((res) => {
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
    openDialog(state, info = {}) {
      const { row } = info;

      if (state === 'configFinance') {
        submit(row.id).then((res) => {
          if (res && res.code === '200') {
            this.$notify({
              title: '成功',
              message: '确认外经证成功',
              type: 'success',
              position: 'bottom-right',
            });
            this.getDataAllList();
          }
        });

        return;
      }
      if (state === 'delFinance') {
        this.$confirm('确定删除当前角色?', '信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          const { id } = info.row;

          deleteOutermanag(id).then((res) => {
            if (res && res.code === '200') {
              this.$notify({
                title: '成功',
                message: '删除外经证成功',
                type: 'success',
                position: 'bottom-right',
              });
              this.getDataAllList();
            }
          });
        });

        return;
      }
      this.editshow = true;
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
    onAdd() {
      this.editdata = {
        row: {},
        type: 'base',
        configType: 'add',
      };
      this.editshow = true;
    },
    upload() {
      this.editdata = {
        row: {},
        type: 'upload',
        configType: 'addUpload',
      };
      this.editshow = true;
    },
    handleExport() {
      this.$confirm('确定导出外经证申请列表信息?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        const api = exportOutermanag;

        api().then((res) => {
          const fileName = '外经证申请列表信息.xlsx';
          const blob = new Blob([res], {
            type: 'application/vnd.ms-excel;charset=utf-8',
          });

          if (navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, fileName);
          } else {
            const link = document.createElement('a');

            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
            URL.revokeObjectURL(link.href);
          }
        });
      });
    },
    handleDownLoad() {
      this.$confirm('确定下载外经证申请模板信息?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        const api = excelDownload;

        api('financeOutermanagement').then((res) => {
          const fileName = '外经证申请模板信息.xlsx';
          const blob = new Blob([res], {
            type: 'application/vnd.ms-excel;charset=utf-8',
          });

          if (navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, fileName);
          } else {
            const link = document.createElement('a');

            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
            URL.revokeObjectURL(link.href);
          }
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
#financeOuterManagement {
}
</style>
