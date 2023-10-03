/* eslint-disable camelcase */
<template>
  <div id="businessOpportunityList">
    <!-- 搜索框 -->
    <header-title>
      <search-form
        ref="searchForm"
        slot="searchBox"
        :searchItems="searchItems"
        @onSearch="onSearch"
        @onReset="onReset"
        :otherBtnVisible="true"
        :otherBtnLists="[
          {
            label: '模板导入',
            hide: !$_hasOperation(routerCode, 'import'),
            click: () =>
              openDialog('import', {
                row: {},
                type: 'import',
                configType: 'import',
              }),
          },
          {
            label: '下载模板',
            hide: !$_hasOperation(routerCode, 'download'),
            click: () => this.handleDownLoad(),
          },
          {
            label: '导出',
            hide: !$_hasOperation(routerCode, 'export'),
            click: () => handleExport(),
          },
          {
            label: '新增',
            hide: !$_hasOperation(routerCode, 'add'),
            click: () =>
              openDialog('detail', {
                row: {},
                type: 'handle',
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
          :hideDefaultIndex="true"
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
              <!--操作-详情  -->
              <el-button
                type="text"
                size="small"
                title="商机详情"
                icon="iconfont icon-yulan"
                v-if="$_hasOperation(routerCode, 'detail')"
                @click.prevent.stop="
                  openDialog('detail', {
                    row: scope.row,
                    type: 'handle',
                    configType: 'detail',
                  })
                "
              >
                详情
              </el-button>
              <!--操作-编辑  -->
              <el-button
                type="text"
                size="small"
                title="商机编辑"
                icon="iconfont icon-bianji"
                v-if="
                  (scope.row.status === 'verify_draft' || scope.row.status === 'verify_pass') &&
                  $_hasOperation(routerCode, 'edit')
                "
                @click.prevent.stop="
                  openDialog('edit', {
                    row: scope.row,
                    type: 'handle',
                    configType: 'edit',
                  })
                "
              >
                编辑
              </el-button>
              <!-- v-if="scope.row.status === 'verify_draft' || scope.row.status === 'verify_pass'" -->
              <!--操作-删除  -->
              <el-button
                type="text"
                size="small"
                title="商机删除"
                icon="iconfont icon-shanchu"
                v-if="$store.state.user.adminUserDto.username === 'admin' && $_hasOperation(routerCode, 'delete')"
                @click.prevent.stop="handleDelete(scope.row)"
              >
                删除
              </el-button>
              <!--操作-提交审核  -->
              <el-button
                type="text"
                size="small"
                title="提交审核"
                icon="iconfont icon-fabu"
                v-if="scope.row.status === 'verify_draft' && $_hasOperation(routerCode, 'submitAudit')"
                @click.prevent.stop="
                  openDialog('examine', {
                    row: scope.row,
                    type: 'examine',
                    configType: 'examine',
                  })
                "
              >
                提交审核
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

    <edit :show="editshow" :data="editdata" @cancel="closeEdit" @success="handleSuccess"></edit>
  </div>
</template>

<script>
import headerTitle from 'components/headerTitle/headerTitle';
import searchForm from 'components/searchForm/searchForm';
import PageTable from '@/components/page-table';
import Flex from '@/components/flex';
import Edit from './Edit';
import {
  getListByCommand,
  deleteBusinessOpportunity,
  getValExcel,
  getExcel,
} from '@/api/marketMiddleStage/businessOpportunityList';
import { excelDownload } from '@/api/basicInformationManagement/templetDownloadIndex';

export default {
  name: 'businessOpportunityList',
  inject: ['common'],
  data() {
    return {
      loading: false,
      searchVal: {
        status: 'N',
        businessCode: undefined,
        startTime: undefined,
        endTime: undefined,
      },
      // 搜索条件
      searchItems: [
        {
          type: 'dataPicker',
          label: '获取时间起',
          labelWidth: '100px',
          initValue: '',
          props: {
            type: 'date',
            format: 'yyyy-MM-dd',
            fieldName: 'startTime',
            placeholder: '请选择开始时间',
          },
        },
        {
          type: 'dataPicker',
          label: '获取时间止',
          labelWidth: '100px',
          initValue: '',
          props: {
            type: 'date',
            format: 'yyyy-MM-dd',
            fieldName: 'endTime',
            placeholder: '请选择结束时间',
          },
        },
        {
          type: 'select',
          label: '商机来源',
          initValue: '',
          labelWidth: '100px',
          props: {
            fieldName: 'busiResource',
            filterable: true,
            options: this.common().busiResourceCode,
          },
        },
        {
          type: 'input',
          label: '商机编号',
          initValue: '',
          labelWidth: '100px',
          props: {
            fieldName: 'busiId',
          },
        },
        {
          type: 'dataPicker',
          label: '投标时间',
          initValue: '',
          labelWidth: '100px',
          props: {
            type: 'date',
            format: 'yyyy-MM-dd',
            fieldName: 'tenderDate',
            placeholder: '请选择投标时间',
          },
        },
        {
          type: 'select',
          label: '投标状态',
          initValue: '',
          labelWidth: '100px',
          props: {
            fieldName: 'tenderState',
            filterable: true,
            options: this.common().tenderStateInfo,
          },
        },
        {
          type: 'input',
          label: '商机(项目)名称',
          initValue: '',
          labelWidth: '100px',
          props: {
            fieldName: 'busiName',
          },
        },
        {
          type: 'input',
          label: '客户名称',
          initValue: '',
          labelWidth: '100px',
          props: {
            fieldName: 'custName',
          },
        },
        {
          type: 'select',
          label: '是否中标',
          initValue: '',
          labelWidth: '100px',
          props: {
            fieldName: 'tenderWin',
            filterable: true,
            options: this.common().tenderWin,
          },
        },
      ],
      page: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      multipleSelection: [], // 选中表格数据
      tableData: [], // 表格数据
      tableCols: [
        {
          label: '商机(项目)名称',
          prop: 'busiName',
          width: 200,
          align: 'center',
        },
        {
          label: '商机编号',
          prop: 'busiId',
          width: 180,
          align: 'center',
        },
        {
          label: '商机来源',
          prop: 'busiResource',
          width: 100,
          align: 'center',
        },
        {
          label: '商机获取日期',
          prop: 'busiDate',
          width: 200,
          align: 'center',
        },
        {
          label: '客户名称',
          prop: 'custName',
          width: 100,
          align: 'center',
        },
        {
          label: '项目实施地区',
          prop: 'implementArea',
          width: 150,
          align: 'center',
        },
        {
          label: '一级专业',
          prop: 'oneMajor',
          width: 100,
          align: 'center',
        },
        {
          label: '二级专业',
          prop: 'twoMajor',
          width: 100,
          align: 'center',
        },
        {
          label: '采购形式',
          prop: 'purchaseModality',
          width: 100,
          align: 'center',
        },
        {
          label: '市场类型',
          prop: 'marketType',
          width: 100,
          align: 'center',
        },
        {
          label: '投标时间',
          prop: 'tenderDate',
          width: 200,
          align: 'center',
        },
        {
          label: '项目规模(万元)',
          prop: 'projectScale',
          width: 150,
          align: 'center',
        },
        {
          label: '拟投规模(万元)',
          prop: 'planScale',
          width: 150,
          align: 'center',
        },
        {
          label: '商机类别',
          prop: 'opportunityCategory',
          width: 100,
          align: 'center',
        },
        {
          label: '预估毛利润率',
          prop: 'grossProfitRateString',
          width: 100,
          align: 'center',
        },
        {
          label: '拓展类型',
          prop: 'expandType',
          width: 100,
          align: 'center',
        },
        {
          label: '所属生产中心',
          prop: 'productionCenter',
          width: 150,
          align: 'center',
        },
        {
          label: '项目经理',
          prop: 'projectManager',
          width: 100,
          align: 'center',
        },
        {
          label: '投标状态',
          prop: 'tenderState',
          width: 100,
          align: 'center',
        },
        {
          label: '是否中标',
          prop: 'tenderWin',
          width: 100,
          align: 'center',
        },
        {
          label: '中标份额(万元)',
          prop: 'tenderShare',
          width: 150,
          align: 'center',
        },
        {
          label: '预计合同额(万元)',
          prop: 'expertContract',
          width: 150,
          align: 'center',
        },
        {
          label: '复盘',
          prop: 'replay',
          width: 100,
          align: 'center',
        },
        {
          label: '备注',
          prop: 'remark',
          width: 100,
          align: 'center',
        },
        {
          label: '审核状态',
          prop: 'statusName',
          width: 100,
          align: 'center',
        },
        {
          label: '处理结果',
          prop: 'auditResult',
          width: 100,
          align: 'center',
        },
        {
          label: '处理意见',
          prop: 'auditOpinion',
          width: 100,
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
      console.log(this.routerCode, this.$_hasOperation(this.routerCode, 'import'));
      this.onSearch();
    });
  },
  methods: {
    // 重置
    onReset() {
      console.log('onReset');
    },
    // 搜索
    onSearch(val) {
      this.searchVal = {
        ...val,
      };
      this.onCurrentChange(1);
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
        sorting: 'create_time desc',
      };

      // 获取数据列表
      getListByCommand(parames).then((res) => {
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
      return row.id + row.busiName;
    },
    // 保存选中表格数据
    onSelectionChange(args) {
      // console.log(args, "选中");
      this.multipleSelection = args;
    },
    // 预览
    openDialog(state, info = {}) {
      this.editshow = true;
      this.editdata = info;
    },
    // 关闭预览
    closeEdit() {
      this.editshow = false;
      this.editdata = {};
    },
    showView(info) {
      console.log('test');
    },
    // 删除项目
    handleDelete(row) {
      this.$confirm('确定删除当前项目?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        deleteBusinessOpportunity(row.id).then((res) => {
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
    // 导出项目信息
    handleExport() {
      this.$confirm('确定导出商机信息?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        getValExcel(this.searchVal).then((res) => {
          const fileName = '商机信息.xlsx';
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
    // 操作成功
    handleSuccess() {
      this.editshow = false;
      this.getDataAllList();
    },
    handleDownLoad() {
      this.$confirm('确定下载商机管理模板信息?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        const api = excelDownload;

        api('businessOpportunity').then((res) => {
          const fileName = '商机管理模板信息.xlsx';
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
  created() {
    console.log(this.routerCode, this.$_hasOperation(this.routerCode, 'add'));
  },
};
</script>

<style lang="less">
#businessOpportunityList {
}
</style>
