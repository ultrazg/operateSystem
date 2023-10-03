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
              openDialog('import', '模板导入', {
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
              openDialog('detail', '新增采购信息', {
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
              <!--操作-->
              <el-button
                type="text"
                size="small"
                title="采购信息详情"
                icon="iconfont icon-yulan"
                v-if="$_hasOperation(routerCode, 'detail')"
                @click.prevent.stop="
                  openDialog('detail', '采购信息详情', {
                    row: scope.row,
                    type: 'base',
                    configType: 'detail',
                  })
                "
              >
                详情
              </el-button>

              <el-button
                type="text"
                size="small"
                title="采购信息编辑"
                icon="iconfont icon-bianji"
                v-if="$_hasOperation(routerCode, 'edit')"
                @click.prevent.stop="
                  openDialog('edit', '采购信息编辑', {
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
                title="采购信息删除"
                v-if="$store.state.user.adminUserDto.username === 'admin' && $_hasOperation(routerCode, 'delete')"
                icon="iconfont icon-shanchu"
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
import { getPurchaseListByConditions, deletePurchase, getExcel } from '@/api/marketMiddleStage/purchaseList';
import { excelDownload } from '@/api/basicInformationManagement/templetDownloadIndex';

export default {
  name: 'purchaseList',
  inject: ['common'],
  data() {
    return {
      loading: false,
      searchVal: {
        WWWId: '',
        isUnion: '',
        planId: '',
        prodId: '',
        productionCenter: '',
        purchaseProdId: '',
        winner: '',
        year: '',
      },
      // 搜索条件
      searchItems: [
        {
          type: 'select',
          label: '所属生产中心',
          labelWidth: '100px',
          initValue: '',
          props: {
            fieldName: 'productionCenter',
            filterable: true,
            options: this.common().productionCenterCode,
          },
        },
        {
          type: 'input',
          label: '甲方项目编号',
          labelWidth: '100px',
          initValue: '',
          hide: true,
          props: {
            fieldName: 'prodId',
          },
        },
        {
          type: 'input',
          label: '采购项目编号',
          labelWidth: '100px',
          initValue: '',
          props: {
            fieldName: 'purchaseProdId',
          },
        },
        {
          type: 'select',
          label: '是否联合拓展',
          labelWidth: '100px',
          initValue: '',
          props: {
            fieldName: 'isUnion',
            filterable: true,
            options: this.common().bondIsCancel,
          },
        },
        {
          type: 'select',
          label: '付款方式',
          labelWidth: '100px',
          initValue: '',
          props: {
            fieldName: 'paymentType',
            filterable: true,
            options: this.common().paymentType,
          },
        },
        {
          type: 'input',
          label: '年度',
          initValue: '',
          props: {
            fieldName: 'year',
          },
        },
        {
          type: 'input',
          label: '年度',
          initValue: '',
          hide: true,
          props: {
            fieldName: 'planId',
          },
        },
        {
          type: 'input',
          label: '中标人',
          labelWidth: '100px',
          hide: true,
          initValue: '',
          props: {
            fieldName: 'winner',
          },
        },
        {
          type: 'input',
          label: 'WWW2合同',
          labelWidth: '100px',
          hide: true,
          initValue: '',
          props: {
            fieldName: 'WWWId',
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
      tableCols: [
        {
          label: '甲方项目编号',
          prop: 'prodId',
          hide: true,
          width: 150,
          align: 'center',
        },
        {
          label: '所属生产中心',
          prop: 'productionCenter',
          width: 150,
          align: 'center',
        },
        {
          label: '付款方式',
          prop: 'paymentType',
          // width: 200,
          align: 'center',
          render: (h, scope) => {
            const val = scope.row.paymentType;
            const valItem = this.common().paymentType.filter((item) => item.id === val);

            return <div>{valItem && valItem[0] ? valItem[0].name : ''}</div>;
          },
        },
        {
          label: '年度',
          prop: 'year',
          // width: 200,
          align: 'center',
        },
        {
          label: '采购项目名称',
          prop: 'prodName',
          width: 150,
          align: 'center',
        },
        {
          label: '项目归属',
          prop: 'projectBelong',
          // width: 200,
          align: 'center',
        },
        {
          label: '省份',
          prop: 'province',
          // width: 200,
          align: 'center',
        },
        {
          label: '城市',
          prop: 'city',
          // width: 200,
          align: 'center',
        },
        {
          label: '一级专业',
          prop: 'oneMajor',
          // width: 200,
          align: 'center',
        },
        {
          label: '二级专业',
          prop: 'twoMajor',
          // width: 200,
          align: 'center',
        },
        {
          label: '项目工期',
          prop: 'prodDate',
          // width: 200,
          align: 'center',
        },
        {
          label: '项目预估收入(不含税)',
          prop: 'prodIncome',
          // width: 200,
          align: 'center',
        },
        {
          label: '税率',
          prop: 'taxRate',
          // width: 200,
          align: 'center',
        },
        {
          label: '采购项目编号',
          prop: 'purchaseProdId',
          // width: 200,
          align: 'center',
        },
        {
          label: '是否联合拓展',
          prop: 'isUnion',
          // width: 200,
          align: 'center',
        },
        {
          label: '合作方名称',
          prop: 'partnerName',
          hide: true,
          // width: 200,
          align: 'center',
        },
        {
          label: '注册资金(人民币)',
          prop: 'registerCapital',
          hide: true,
          // width: 200,
          align: 'center',
        },
        {
          label: '是否具有甲方项目要求的资质',
          prop: 'qualification',
          hide: true,
          // width: 200,
          align: 'center',
        },
        {
          label: '采购委托',
          prop: 'purchaseEntrust',
          hide: true,
          // width: 200,
          align: 'center',
        },
        {
          label: '公告/邀请函',
          prop: 'announcement',
          // width: 200,
          hide: true,
          align: 'center',
        },
        {
          label: '评审报告',
          prop: 'reviewReport',
          hide: true,
          // width: 200,
          align: 'center',
        },
        {
          label: '中标通知书',
          prop: 'biddingLetter',
          hide: true,
          // width: 200,
          align: 'center',
        },
        {
          label: '拦标价(不含税,万元)',
          prop: 'stopBiddingPrice',
          hide: true,
          // width: 200,
          align: 'center',
        },
        {
          label: '预购采购金额(不含税,万元)',
          prop: 'purchaseAmountNotRate',
          hide: true,
          // width: 200,
          align: 'center',
        },
        {
          label: '预估增值税金额(万元)',
          prop: 'addedValueTax',
          hide: true,
          // width: 200,
          align: 'center',
        },
        {
          label: '预购采购金额(万元)',
          prop: 'purchaseAmount',
          hide: true,
          // width: 200,
          align: 'center',
        },
        {
          label: '计划份额',
          prop: 'planLot',
          hide: true,
          // width: 200,
          align: 'center',
        },
        {
          label: '合同期限',
          prop: 'contractDeadline',
          // width: 200,
          hide: true,
          align: 'center',
        },
        {
          label: '方案编号',
          prop: 'planId',
          // width: 200,
          hide: true,
          align: 'center',
        },
        {
          label: '采购代理机构名称',
          prop: 'agencyName',
          // width: 200,

          hide: true,
          align: 'center',
        },
        {
          label: '采购方式',
          prop: 'purchaseType',
          hide: true,
          // width: 200,
          align: 'center',
        },
        {
          label: '价格/商务/技术分值',
          prop: 'PBTScore',
          hide: true,
          // width: 200,
          align: 'center',
        },
        {
          label: '(商务技术分)客观分值占比',
          prop: 'BScoreProportion',
          hide: true,
          // width: 200,
          align: 'center',
        },
        {
          label: '是否需公司总办会审议',
          prop: 'isNeedReview',
          hide: true,
          // width: 200,
          align: 'center',
        },
        {
          label: '采购方案其他',
          prop: 'payAmount',
          // width: 200,
          hide: true,
          align: 'center',
        },
        {
          label: '备注',
          prop: 'remark',
          // width: 200,
          hide: true,
          align: 'center',
        },
      ],
      editshow: false,
      editdata: {},
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
    // 页面首先运行搜索 获取采购信息
    this.$nextTick(() => {
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
      console.log('this.searchVal', this.searchVal);
      this.loading = true;
      const parames = {
        data: {
          ...this.searchVal,
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize,
        sorting: 'id desc',
      };

      // 查询采购列表
      getPurchaseListByConditions(parames).then((res) => {
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
    // 操作采购删除
    handleDelete(row) {
      this.$confirm('确定删除当前项目?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        deletePurchase(row.id).then((res) => {
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
    // 导出采购信息
    getExcel() {
      this.$confirm('确定导出采购信息?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        getExcel(this.searchVal).then((res) => {
          const fileName = '采购信息.xlsx';
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
      this.$confirm('确定下载采购管理模板信息?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        const api = excelDownload;

        api('purchase').then((res) => {
          const fileName = '采购管理模板信息.xlsx';
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
