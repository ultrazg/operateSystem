/* eslint-disable camelcase */
<template>
  <!--以租代建部分 -->
  <div id="instead">
    <!-- 搜索框 -->
    <header-title>
      <search-form
        ref="searchForm"
        slot="searchBox"
        :searchItems="searchItems"
        :addBtnVisible="$_hasOperation(routerCode, 'insteadAdd')"
        :addTitleBtn="'新增'"
        @onSearch="onSearch"
        @onChange="onChange"
        @onReset="onReset"
        @onAddBtn="onAddBtn"
        :otherBtnVisible="true"
        :otherBtnLists="[
          {
            label: '下载模板',
            hide: !$_hasOperation(routerCode, 'insteadDownload'),
            click: () => handleDown(),
          },
          {
            label: '模板导入',
            hide: !$_hasOperation(routerCode, 'insteadImport'),
            click: () =>
              openDialog('importInstead', {
                row: {},
                type: 'importInstead',
                configType: 'import',
              }),
          },
          {
            label: '导出',
            hide: !$_hasOperation(routerCode, 'insteadExport'),
            click: () => handleExport(),
          },
          {
            label: '拆站',
            hide: !$_hasOperation(routerCode, 'insteadSplit'),
            disabled: !multipleSelection || multipleSelection.length === 0,
            click: () =>
              openDialog('batchUpdate', {
                row: multipleSelection,
                type: 'batchUpdate',
                configType: 'batchUpdate',
              }),
          },
          {
            label: '生成合作合同',
            hide: !$_hasOperation(routerCode, 'insteadContract'),
            disabled: !multipleSelection || multipleSelection.length === 0,
            click: () =>
              openDialog('creatContract', {
                row: multipleSelection,
                type: 'creatContract',
                configType: 'creatContract',
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
          :selection="true"
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
              <!--操作 通过状态使用不同功能-->
              <el-button
                type="text"
                size="small"
                title="查看"
                icon="iconfont icon-yulan"
                v-if="$_hasOperation(routerCode, 'insteadDetail')"
                @click.prevent.stop="
                  openDialog('detail', {
                    row: scope.row,
                    type: 'insteadBase',
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
                v-if="scope.row.status === 'verify_draft' && $_hasOperation(routerCode, 'insteadEdit')"
                icon="iconfont icon-bianji"
                @click.prevent.stop="
                  openDialog('edit', {
                    row: scope.row,
                    type: 'insteadBase',
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
                v-if="scope.row.status === 'verify_draft' && $_hasOperation(routerCode, 'insteadDelete')"
                icon="iconfont icon-shanchu"
                @click.prevent.stop="
                  openDialog('del', {
                    row: scope.row,
                    configType: 'edit',
                  })
                "
              >
                删除
              </el-button>
              <el-button
                type="text"
                size="small"
                title="提交审核"
                v-if="scope.row.status === 'verify_draft' && $_hasOperation(routerCode, 'insteadSubmitAudit')"
                icon="iconfont icon-fabu"
                @click.prevent.stop="
                  openDialog('fabu', {
                    row: { ...scope.row, businessCode: 't_project_station' },
                    type: 'fabu',
                    configType: 'fabu',
                  })
                "
              >
                提交审核
              </el-button>
              <el-button
                type="text"
                size="small"
                title="申请作废"
                v-if="scope.row.status === 'verify_pass' && $_hasOperation(routerCode, 'insteadCancle')"
                icon="iconfont icon-iconclose"
                @click.prevent.stop="
                  openDialog('close', {
                    row: { ...scope.row, businessCode: 't_project_station' },
                    type: 'close',
                    configType: 'close',
                  })
                "
              >
                申请作废
              </el-button>
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
import headerTitle from '@/components/headerTitle/headerTitle';
import searchForm from '@/components/searchForm/searchForm';
import PageTable from '@/components/page-table';
import Flex from '@/components/flex';
import Edit from './Edit';
import {
  page,
  delStation,
  exportStation,
  batchUpdate,
} from '@/api/marketMiddleStage/projectApprovalManagement/instead';
import { excelDownload } from '@/api/basicInformationManagement/templetDownloadIndex';
export default {
  name: 'insteadTable',
  inject: ['common'],
  data() {
    return {
      loading: false,
      searchVal: {},
      // 搜索条件
      searchItems: [
        {
          type: 'input',
          label: '项目名称',
          initValue: undefined,
          props: {
            fieldName: 'name',
          },
        },
        {
          type: 'input',
          label: 'ERP编号',
          initValue: undefined,
          props: {
            fieldName: 'erpNumber',
            filterable: true,
          },
        },
        {
          type: 'select',
          label: '站点状态',
          initValue: undefined,
          props: {
            fieldName: 'stationStatus',
            filterable: true,
            options: this.common().stationStatus,
          },
        },
        {
          type: 'select',
          label: '申请状态',
          props: {
            fieldName: 'status',
            filterable: true,
            options: this.common().verifyStatusCode,
          },
        },
      ],
      page: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      multipleSelection: [], // 选中表格数据
      tableData: [], // 表单数据
      // 表单内容
      tableCols: [
        {
          label: '项目名称',
          prop: 'name',
        },
        {
          label: 'ERP编号',
          prop: 'cityErp',
          width: '200px',
          // ERP编号点击跳转 立项申请详情
          // render: (h, scope) => (
          //   <div>
          //     <el-link
          //       type="primary"
          //       onClick={(val) => {
          //         this.editdata = {
          //           row: scope.row,
          //           type: 'projectDetailShow',
          //           configType: 'detail',
          //         };
          //         this.editshow = true;
          //       }}
          //     >
          //       {scope.row.erpNumber}
          //     </el-link>
          //   </div>
          // ),
        },
        {
          label: '业务确认单号',
          prop: 'busiOrderId',
          width: '150px',
        },
        {
          label: '省份',
          prop: 'province',
        },
        {
          label: '地市',
          prop: 'city',
        },
        {
          label: '区县',
          prop: 'area',
        },
        {
          label: '委托模式',
          prop: 'entrustType',
        },
        {
          label: '申请状态',
          prop: 'statusInfo',
        },
        {
          label: '站点状态',
          prop: 'stationStatus',
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
    // 页面首先运行搜索 获取项目信息
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
      this.searchVal = {
        ...val,
      };
    },
    // 搜索
    onSearch(val) {
      this.searchVal = {
        ...val,
      };
      this.onCurrentChange(1);
    },
    // 新增
    onAddBtn() {
      this.editdata = {
        row: {},
        type: 'insteadBase',
        configType: 'addInstead',
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
      if (state === 'del') {
        this.$confirm('确定删除当前项目?', '信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.handleDelProjectApproval(info.row.id);
        });

        return;
      }
      this.editshow = true;
      this.editdata = info;
    },
    // 小站项目删除
    handleDelProjectApproval(id) {
      delStation(id).then((res) => {
        if (res && res.code === '200') {
          this.$notify({
            title: '成功',
            message: '更新成功',
            type: 'success',
            position: 'bottom-right',
          });
          this.getDataAllList();
        }
      });
    },
    // 关闭预览
    closeEdit() {
      this.editshow = false;
      this.editdata = {};
    },
    // 成功
    successEdit() {
      this.closeEdit();
      this.$refs.pageTable.getPageTable();
      this.onCurrentChange(1);
    },
    // 导出小站信息
    handleExport() {
      this.$confirm('确定导出以租代建列表信息?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        exportStation().then((res) => {
          const fileName = '以租代建列表信息.xlsx';
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
    // 下载以租代建项目信息
    handleDown() {
      this.$confirm('确定下载以租代建项目模板信息?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        excelDownload('projectStation').then((res) => {
          const fileName = '以租代建项目模板信息.xlsx';
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
#instead {
}
</style>
