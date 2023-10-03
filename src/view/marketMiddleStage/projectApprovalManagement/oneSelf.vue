/* eslint-disable camelcase */
<template>
  <div id="oneSelf">
    <!--自建部分-->
    <!-- 搜索框 -->
    <header-title>
      <search-form
        ref="searchForm"
        slot="searchBox"
        :searchItems="searchItems"
        :addBtnVisible="$_hasOperation(routerCode, 'selfAdd')"
        :addTitleBtn="'新增'"
        @onSearch="onSearch"
        @onChange="onChange"
        @onReset="onReset"
        @onAddBtn="onAddBtn"
        :otherBtnVisible="true"
        :otherBtnLists="[
          {
            label: '下载模板',
            hide: !$_hasOperation(routerCode, 'selfDownload'),
            click: () => handleDown(),
          },
          {
            label: '模板导入',
            hide: !$_hasOperation(routerCode, 'selfImport'),
            click: () =>
              openDialog('importSelf', {
                row: {},
                type: 'importSelf',
                configType: 'import',
              }),
          },
          {
            label: '导出',
            hide: !$_hasOperation(routerCode, 'selfExport'),
            click: () => handleExport(),
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
              <!--操作 通过状态使用不同功能-->
              <el-button
                type="text"
                size="small"
                title="查看"
                icon="iconfont icon-yulan"
                v-if="$_hasOperation(routerCode, 'selfDetail')"
                @click.prevent.stop="
                  openDialog('detail', {
                    row: scope.row,
                    type: 'selfBase',
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
                v-if="scope.row.status === 'verify_draft' && $_hasOperation(routerCode, 'selfEdit')"
                icon="iconfont icon-bianji"
                @click.prevent.stop="
                  openDialog('edit', {
                    row: scope.row,
                    type: 'selfBase',
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
                v-if="scope.row.status === 'verify_draft' && $_hasOperation(routerCode, 'selfDelete')"
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
                v-if="scope.row.status === 'verify_draft' && $_hasOperation(routerCode, 'selfSubmitAudit')"
                icon="iconfont icon-fabu"
                @click.prevent.stop="
                  openDialog('fabu', {
                    row: { ...scope.row, businessCode: 't_project_ext_self' },
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
                title="项目过程"
                v-if="scope.row.status === 'verify_pass' && $_hasOperation(routerCode, 'selfPpm')"
                icon="iconfont icon-guochengguanli"
                @click.prevent.stop="
                  openDialog('edit', {
                    row: scope.row,
                    type: 'handle',
                    configType: 'handle',
                  })
                "
              >
                项目过程
              </el-button>
              <el-button
                type="text"
                size="small"
                title="成本录入"
                v-if="scope.row.status === 'verify_pass' && false"
                icon="iconfont icon-chaifenbiaoji"
                @click.prevent.stop="
                  openDialog('edit', {
                    row: scope.row,
                    type: 'costEntry',
                    configType: 'costEntry',
                  })
                "
              >
                成本录入
              </el-button>
              <el-button
                type="text"
                size="small"
                title="生成合作合同"
                v-if="
                  scope.row.status === 'verify_pass' &&
                  scope.row.hasCooperationContract !== '1' &&
                  scope.row.hasPackage !== '0' &&
                  $_hasOperation(routerCode, 'selfContract')
                "
                icon="iconfont icon-chaifenbiaoji"
                @click.prevent.stop="
                  openDialog('edit', {
                    row: scope.row,
                    type: 'addSelfContract',
                    configType: 'creatContract',
                  })
                "
              >
                生成合作合同
              </el-button>
              <el-button
                type="text"
                size="small"
                title="申请作废"
                v-if="scope.row.status === 'verify_pass' && $_hasOperation(routerCode, 'selfCancle')"
                icon="iconfont icon-iconclose"
                @click.prevent.stop="
                  openDialog('close', {
                    row: { ...scope.row, businessCode: 't_project_ext_self' },
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
import { page, delSelf, exportSelf } from '@/api/marketMiddleStage/projectApprovalManagement/oneSelf';
import { excelDownload } from '@/api/basicInformationManagement/templetDownloadIndex';
export default {
  name: 'oneSelf',
  inject: ['common'],
  data() {
    return {
      loading: false,
      searchVal: {
        name: undefined,
        erpNumber: undefined,
        consignor: undefined,
        oneMajor: undefined,
        twoMajor: undefined,
        status: undefined,
        province: undefined,
        city: undefined,
      },
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
          type: 'input',
          label: '框架编号',
          initValue: undefined,
          props: {
            fieldName: 'contractId',
          },
        },
        {
          type: 'select',
          label: '申请状态',
          initValue: undefined,
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
          prop: 'erpNumber',
          width: '200px',
          // ERP编号点击跳转 立项申请详情
          render: (h, scope) => (
            <div>
              <el-link
                type="primary"
                onClick={(val) => {
                  this.editdata = {
                    row: scope.row,
                    type: 'projectDetailShow',
                    configType: 'detail',
                  };
                  this.editshow = true;
                }}
              >
                {scope.row.erpNumber}
              </el-link>
            </div>
          ),
        },
        {
          label: '框架编号',
          prop: 'contractId',
        },
        {
          label: '框架名称',
          prop: 'frameName',
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
          label: '区/县',
          prop: 'area',
        },
        {
          label: '委托方',
          prop: 'consignor',
        },
        {
          label: '是否有分包费',
          prop: 'hasPackage',
          render: (h, scope) => {
            const val = scope.row.hasPackage;
            const valItem = this.common().isHas.filter((item) => item.id === val);

            return <div>{valItem && valItem[0] ? valItem[0].name : ''}</div>;
          },
        },
        {
          label: '申请状态',
          prop: 'statusName',
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
      console.log('cccc', this.routerCode, this.$_hasOperation(this.routerCode, 'selfImport'));
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
        type: 'selfBase',
        configType: 'addSelf',
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
      return row.id + row.name;
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
    // 删除自建项目
    handleDelProjectApproval(id) {
      delSelf(id).then((res) => {
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
    // 下载自建项目信息
    handleDown() {
      this.$confirm('确定下载自建项目模板信息?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        excelDownload('selfProject').then((res) => {
          const fileName = '自建项目模板信息.xlsx';
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
    // 导出自建项目信息
    handleExport() {
      this.$confirm('确定导出自建列表信息?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        exportSelf().then((res) => {
          const fileName = '自建列表信息.xlsx';
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
    // 成功
    successEdit() {
      this.closeEdit();
      this.onCurrentChange(1);
    },
  },
};
</script>

<style lang="less" scoped>
#oneSelf {
}
</style>
