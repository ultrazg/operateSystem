/* eslint-disable camelcase */
<template>
  <div id="costManagement">
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
        :otherBtnVisible="false"
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
            click: () =>
              openDialog('detail', {
                row: {},
                type: 'base',
                configType: 'add',
              }),
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
                title="编辑"
                icon="iconfont icon-bianji"
                @click.prevent.stop="
                  openDialog('edit', {
                    row: scope.row,
                    type: 'base',
                    configType: 'edit',
                  })
                "
              >
                编辑
              </el-button>
              <!-- <el-button
                type="text"
                size="small"
                title="删除"
                icon="iconfont icon-shanchu"
                @click.prevent.stop="
                  openDialog('delete', {
                    row: scope.row,
                    type: 'delete',
                    configType: 'delete',
                  })
                "
                >删除
              </el-button>
              <el-button
                type="text"
                size="small"
                title="发起申请"
                v-if="scope.row.status === 'verify_draft'"
                icon="iconfont icon-chenggong"
                @click.prevent.stop="
                  openDialog('fabu', {
                    row: { ...scope.row, businessCode: 't_cooperation_invoice_batch' },
                    type: 'fabu',
                    configType: 'fabu',
                  })
                "
              >
                发起申请
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
import { excelDownload } from '@/api/basicInformationManagement/templetDownloadIndex';
import { page } from '@/api/accountManagement/costManagement';
export default {
  name: 'costManagement',
  inject: ['common'],
  data() {
    return {
      loading: false,
      searchVal: {},
      searchItems: [
        {
          type: 'input',
          label: '项目编码',
          labelWidth: '80px',
          props: {
            fieldName: 'projectCode',
          },
        },
        {
          type: 'input',
          label: '项目名称',
          labelWidth: '80px',
          props: {
            fieldName: 'projectName',
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
          label: '项目编码',
          prop: 'projectCode',
        },
        {
          label: '项目名称',
          prop: 'projectName',
        },
        {
          label: '项目成本金额(不含税)',
          prop: 'totalProjectCost',
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

      page(parames).then((res) => {
        if (res && res.code === '200') {
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
      if (state === 'delete') {
        this.$confirm('确定删除当前应收发票数据?', '信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          const { id } = info.row;

          deleteInvoice(id).then((res) => {
            if (res && res.code === '200') {
              this.$notify({
                title: '成功',
                message: '删除应收发票数据成功',
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
    // 导出
    handleExport() {
      this.$confirm('确定导出应收发票列表信息?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        exportList(this.searchVal).then((res) => {
          const fileName = '应收发票列表信息.xlsx';
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
    // 下载模板
    handleDownLoad() {
      this.$confirm('确定下载模板信息?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        const api = excelDownload;

        api('financeOutermanagement').then((res) => {
          const fileName = '模板信息.xlsx';
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
    // 关闭预览
    closeEdit() {
      this.editshow = false;
      this.editdata = {};
    },
    successEdit() {
      this.closeEdit();
      this.onCurrentChange(1);
    },
  },
};
</script>

<style lang="less" scoped>
#costManagement {
}
</style>
