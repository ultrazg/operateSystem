/* eslint-disable camelcase */
<template>
  <div id="tenderInfoList">
    <!-- 搜索框 -->
    <header-title>
      <!-- :addBtnVisible="true" -->
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
              openDialog('import', '导入投标信息', {
                row: {},
                type: 'import',
                configType: 'import',
              }),
          },
          {
            label: '下载模板',
            hide: !$_hasOperation(routerCode, 'download'),
            click: () => handleDownLoad(),
          },
          {
            label: '导出',
            hide: !$_hasOperation(routerCode, 'export'),
            click: () => getExcel(),
          },
          {
            label: '新增',
            hide: !$_hasOperation(routerCode, 'add'),
            click: () =>
              openDialog('detail', '新增投标信息', {
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
              <!--操作-详情  -->
              <el-button
                type="text"
                size="small"
                title="投标信息详情"
                icon="iconfont icon-yulan"
                v-if="$_hasOperation(routerCode, 'detail')"
                @click.prevent.stop="
                  openDialog('detail', '投标信息详情', {
                    row: scope.row,
                    type: 'base',
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
                title="投标信息编辑"
                icon="iconfont icon-bianji"
                v-if="$_hasOperation(routerCode, 'edit')"
                @click.prevent.stop="
                  openDialog('edit', '投标信息编辑', {
                    row: scope.row,
                    type: 'base',
                    configType: 'edit',
                  })
                "
              >
                编辑
              </el-button>
              <!--操作-删除  -->
              <el-button
                type="text"
                size="small"
                title="投标信息删除"
                icon="iconfont icon-shanchu"
                v-if="$_hasOperation(routerCode, 'delete')"
                @click.prevent.stop="handleDelete(scope.row)"
              >
                删除
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

    <edit
      :show="editshow"
      :dialogTitle="dialogTitle"
      :data="editdata"
      @cancel="closeEdit"
      @success="onCurrentChange(1)"
    ></edit>
  </div>
</template>

<script>
import headerTitle from 'components/headerTitle/headerTitle';
import searchForm from 'components/searchForm/searchForm';
import PageTable from '@/components/page-table';
import Flex from '@/components/flex';
import Edit from './Edit';
import { selectTenderInfoByConditions, deleteTenderInfoById, getExcel } from '@/api/marketMiddleStage/tenderInfoList';
import { excelDownload } from '@/api/basicInformationManagement/templetDownloadIndex';
export default {
  name: 'tenderInfoList',
  inject: ['common'],
  data() {
    return {
      searchVal: {
        startTime: '',
        endTime: '',
        busiId: '',
        productionCenter: '',
        documentType: '',
        projectBelong: '',
        tenderProgress: '',
        tenderResult: '',
      },
      // 搜索条件
      searchItems: [
        {
          type: 'input',
          label: '项目信息概况',
          initValue: '',
          props: {
            fieldName: 'busiName',
          },
        },
        {
          type: 'dataPicker',
          label: '开标时间起',
          initValue: '',
          labelWidth: '85px',
          props: {
            type: 'date',
            format: 'yyyy-MM-dd',
            fieldName: 'startTime',
            placeholder: '请选择开始时间',
          },
        },
        {
          type: 'dataPicker',
          label: '开标时间止',
          labelWidth: '85px',
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
          label: '所属生产中心',
          labelWidth: '85px',
          initValue: '',
          props: {
            fieldName: 'productionCenter',
            filterable: true,
            options: this.common().productionCenterCode,
          },
        },
        {
          type: 'input',
          label: '商机编号',
          initValue: '',
          props: {
            fieldName: 'busiId',
          },
        },
        {
          type: 'select',
          label: '投标进度',
          labelWidth: '85px',
          initValue: '',
          props: {
            fieldName: 'tenderProgress',
            filterable: true,
            options: this.common().tenderProgress,
          },
        },
        {
          type: 'select',
          label: '投标结果',
          labelWidth: '85px',
          initValue: '',
          props: {
            fieldName: 'tenderResult',
            filterable: true,
            options: this.common().tenderResult,
          },
        },
        {
          type: 'select',
          label: '项目归属',
          labelWidth: '85px',
          initValue: '',
          props: {
            fieldName: 'projectBelong',
            filterable: true,
            options: this.common().projectBelong,
          },
        },
        {
          type: 'select',
          label: '购买标书方式',
          labelWidth: '85px',
          initValue: '',
          props: {
            fieldName: 'documentType',
            filterable: true,
            options: this.common().documentType,
          },
        },
      ],
      page: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      multipleSelection: [], // 选中表格数据
      tableData: [], // 投标信息数据
      tableCols: [
        {
          label: '所属生产中心',
          prop: 'productionCenter',
          width: 200,
          align: 'center',
        },
        {
          label: '商机编号',
          prop: 'busiId',
          width: 200,
          align: 'center',
        },
        {
          label: '投标申请编号',
          prop: 'tenderApplyId',
          width: 200,
          align: 'center',
        },
        {
          label: '项目信息概况',
          prop: 'busiName',
          width: 200,
          align: 'center',
        },
        {
          label: '项目采购形式',
          prop: 'purchaseModality',
          width: 200,
          align: 'center',
        },
        {
          label: '总标的金额(万元)',
          prop: 'projectScale',
          width: 200,
          align: 'center',
        },
        {
          label: '标段划分',
          prop: 'sectionDivision',
          width: 200,
          align: 'center',
        },
        {
          label: '项目归属',
          prop: 'projectBelong',
          width: 200,
          align: 'center',
        },
        {
          label: '市场类型',
          prop: 'marketType',
          width: 200,
          align: 'center',
        },
        {
          label: '招标单位名称',
          prop: 'custName',
          width: 200,
          align: 'center',
        },
        {
          label: '购买标书金额(万元)',
          prop: 'documentAmount',
          width: 200,
          align: 'center',
        },
        {
          label: '购买标书方式',
          prop: 'documentType',
          width: 200,
          align: 'center',
        },
        {
          label: '招标文件获取时间',
          prop: 'documentDate',
          width: 200,
          align: 'center',
        },
        {
          label: '投标时间',
          prop: 'tenderDate',
          width: 200,
          align: 'center',
        },
        {
          label: '采购编号',
          prop: 'purchaseId',
          width: 200,
          align: 'center',
        },
        {
          label: '招标代理',
          prop: 'biddingAgent',
          width: 200,
          align: 'center',
        },
        {
          label: '招标代理编号',
          prop: 'biddingAgentId',
          width: 200,
          align: 'center',
        },
        {
          label: '招标代理联系人及邮箱',
          prop: 'biddingAgentEmail',
          width: 200,
          align: 'center',
        },
        {
          label: '投标形式',
          prop: 'tenderType',
          width: 200,
          align: 'center',
        },
        {
          label: '投标责任人',
          prop: 'projectManager',
          width: 200,
          align: 'center',
        },
        {
          label: '投标保证金缴纳金额(万元)',
          prop: 'bondAmount',
          width: 200,
          align: 'center',
        },
        {
          label: '投标保证金缴纳时间',
          prop: 'bondDate',
          width: 200,
          align: 'center',
        },
        {
          label: '投标保证金报账单编号',
          prop: 'bondSheetId',
          width: 200,
          align: 'center',
        },
        {
          label: '投标保证金退还时间',
          prop: 'bondReturnDate',
          width: 200,
          align: 'center',
        },
        {
          label: '投标保证金退还金额(万元)',
          prop: 'bondCancel',
          width: 200,
          align: 'center',
        },
        {
          label: '投标保证金是否已核销',
          prop: 'bondIsCancel',
          width: 200,
          align: 'center',
        },
        {
          label: '投标进度',
          prop: 'tenderProgress',
          width: 200,
          align: 'center',
        },
        {
          label: '投标结果',
          prop: 'tenderResult',
          width: 200,
          align: 'center',
        },
        {
          label: '投标情况复盘',
          prop: 'replay',
          width: 200,
          align: 'center',
        },
        {
          label: '中标单位',
          prop: 'winningUnit',
          width: 200,
          align: 'center',
        },
        {
          label: '立项生产单元',
          prop: 'projectUnit',
          width: 200,
          align: 'center',
        },
        {
          label: '中标价格',
          prop: 'tenderDiscount',
          width: 200,
          align: 'center',
        },
        {
          label: '预计合同签订额(万元)',
          prop: 'predictAmount',
          width: 200,
          align: 'center',
        },
        {
          label: '本次招标有效年限',
          prop: 'ageLimit',
          width: 200,
          align: 'center',
        },
        {
          label: '中标服务费缴纳形式',
          prop: 'payType',
          width: 200,
          align: 'center',
        },
        {
          label: '中标服务费缴纳金额(万元)',
          prop: 'payAmount',
          width: 200,
          align: 'center',
        },
        {
          label: '中标服务费缴纳编号',
          prop: 'payId',
          width: 200,
          align: 'center',
        },
        {
          label: '中标服务费是否已核销',
          prop: 'payIsCancel',
          width: 200,
          align: 'center',
        },
        {
          label: '中标服务费报账单核销编号',
          prop: 'paySheetId',
          width: 200,
          align: 'center',
        },
        {
          label: '备注',
          prop: 'remark',
          width: 200,
          align: 'center',
        },
      ],
      loading: false,
      editshow: false,
      editdata: {}, // 预览数据
      dialogTitle: '',
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
    // 导入
    importExcel() {
      this.$router.push();
    },
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
      this.editshow = false;
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
        // data: {
        //   startTime: '',
        //   endTime: '',
        //   busiId: '',
        //   productionCenter: '',
        //   documentType: '',
        //   projectBelong: '',
        //   tenderProgress: '',
        //   tenderResult: '',
        // },
        pageNo: this.page.current,
        pageSize: this.page.pageSize,
        sorting: 'id desc',
      };

      selectTenderInfoByConditions(parames).then((res) => {
        if (res.code === '200') {
          const { data, total } = res.data;

          this.loading = false;
          this.tableData = data;
          this.page.total = total;
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
    // 删除操作
    handleDelete(row) {
      this.$confirm('确定删除当前项目?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        deleteTenderInfoById(row.id).then((res) => {
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
    // 导出
    getExcel() {
      this.$confirm('确定导出投标信息?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        getExcel(this.searchVal).then((res) => {
          const fileName = '投标管理列表.xlsx';
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
      this.$confirm('确定下载投标管理模板信息?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        const api = excelDownload;

        api('tenderInfo').then((res) => {
          const fileName = '投标管理模板信息.xlsx';
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
#tenderInfoList {
}
</style>
