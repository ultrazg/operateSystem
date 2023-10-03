<template>
  <div id="electricityFee">
    <FormItem
      ref="supplyFormItem"
      :layout="layout"
      :rules="formRules"
      :disabled="true"
      :isEdit="false"
      :form.sync="form"
      @submit="submitForm"
    />
    <header-title>
      <search-form
        ref="searchForm"
        slot="searchBox"
        :searchItems="searchItems"
        @onSearch="onSearch"
        :otherBtnVisible="true"
        :otherBtnLists="[
          {
            label: '新增',
            click: () => onAddBtn(),
          },
          {
            label: '导出',
            click: () => handleExport(),
          },
        ]"
      />
    </header-title>
    <div class="content-view">
      <div class="Modeltable">
        <!-- 小站&&广州市 -->
        <page-table
          ref="pageTable"
          col-align="left"
          operator-width="110"
          :loading="loading"
          :data="tableData"
          :cols="tableCols"
          :selection="false"
          :operator="true"
          :showPage="true"
          reserveSelection
          :row-key="getRowKey"
          :page-current="page.current"
          :total="page.total"
          :page-size="page.pageSize"
          @current-change="onCurrentChange"
          @size-change="onPageSizeChange"
          v-if="stationType === 'littleStation'"
        >
          <template slot-scope="scope" slot="operator">
            <flex>
              <!-- <el-button
                type="text"
                size="small"
                title="查看"
                icon="iconfont icon-yulan"
                @click.prevent.stop="
                  openDialog('detail', {
                    row: scope.row,
                    type: 'electricBase',
                    configType: 'detail',
                  })
                "
                >查看
              </el-button>
              <el-button
                type="text"
                size="small"
                title="编辑"
                v-if="scope.row.isPrepay === '0'"
                icon="iconfont icon-bianji"
                @click.prevent.stop="
                  openDialog('edit', {
                    row: scope.row,
                    type: 'electricBase',
                    configType: 'edit',
                  })
                "
                >编辑
              </el-button> -->
              <el-button
                type="text"
                size="small"
                title="删除"
                v-if="scope.row.isPrepay === '0'"
                icon="iconfont icon-shanchu"
                @click.prevent.stop="
                  openDialog('delete', {
                    row: scope.row,
                    type: 'electricityFee',
                    configType: 'delete',
                  })
                "
                >删除
              </el-button>
            </flex>
          </template>
        </page-table>
        <!-- 宏站 -->
        <page-table
          ref="pageTable"
          col-align="left"
          operator-width="110"
          :loading="loading"
          :data="tableData"
          :cols="hTableCols"
          :selection="false"
          :operator="true"
          :showPage="true"
          reserveSelection
          :row-key="getRowKey"
          :page-current="page.current"
          :total="page.total"
          :page-size="page.pageSize"
          @current-change="onCurrentChange"
          @size-change="onPageSizeChange"
          v-if="stationType === 'bigStation'"
        >
          <template slot-scope="scope" slot="operator">
            <flex>
              <!-- <el-button
                type="text"
                size="small"
                title="查看"
                icon="iconfont icon-yulan"
                @click.prevent.stop="
                  openDialog('detail', {
                    row: scope.row,
                    type: 'electricBase',
                    configType: 'detail',
                  })
                "
                >查看
              </el-button>
              <el-button
                type="text"
                size="small"
                title="编辑"
                v-if="scope.row.isPrepay === '0'"
                icon="iconfont icon-bianji"
                @click.prevent.stop="
                  openDialog('edit', {
                    row: scope.row,
                    type: 'electricBase',
                    configType: 'edit',
                  })
                "
                >编辑
              </el-button> -->
              <el-button
                type="text"
                size="small"
                title="删除"
                v-if="scope.row.isPrepay === '0'"
                icon="iconfont icon-shanchu"
                @click.prevent.stop="
                  openDialog('delete', {
                    row: scope.row,
                    type: 'electricityFee',
                    configType: 'delete',
                  })
                "
                >删除
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
    <dialog-cont
      customClass="electricityFeeDialog"
      @on-cancel="canceledit('cancel')"
      @on-close="canceledit('close')"
      @on-confirm="confirmedit"
      @on-open="openedit"
      :title="`${title}电费具体详情`"
      width="950px"
      :visible.sync="dialogShow"
      ref="dialog"
      appendToBody
    >
      <!-- :confirmShow="baseData.configType !== 'detail' && stationType" -->
      <div class="dialogMain">
        <!-- <div class="flexColumn btnList" v-if="!stationType">
          <div @click="() => handleClickType('littleStation')">小站</div>
          <div @click="() => handleClickType('bigStation')">宏站</div>
        </div>  v-else -->
        <electricBase ref="electricBase" :data="baseData" :type="stationType" @success="addElectricBase()" />
      </div>
    </dialog-cont>
  </div>
</template>

<script>
import FormItem from '@/components/formItem';
import headerTitle from 'components/headerTitle/headerTitle';
import searchForm from 'components/searchForm/searchForm';
import PageTable from '@/components/page-table';
import Flex from '@/components/flex';
import dialogCont from '@/components/dialog';
import electricBase from './electricBase';
import {
  getDetails,
  getDetailsList,
  deleteElectricCost,
  handleExportDetails,
} from '@/api/costManagement/stationElectric';

export default {
  name: 'electricityFee',
  components: {
    FormItem,
    headerTitle,
    searchForm,
    PageTable,
    Flex,
    dialogCont,
    electricBase,
  },
  props: {
    show: Boolean,
    data: {},
  },
  inject: ['common'],
  data() {
    const { configType } = this.data;

    return {
      loading: false,
      searchItems: [
        {
          type: 'dataPicker',
          label: '有效期起',
          labelWidth: '80px',
          initValue: '',
          props: {
            type: 'date',
            format: 'yyyy-MM-dd',
            fieldName: 'startTime',
          },
        },
        {
          type: 'dataPicker',
          label: '有效期止',
          labelWidth: '80px',
          initValue: '',
          props: {
            type: 'date',
            format: 'yyyy-MM-dd',
            fieldName: 'endTime',
          },
        },
        {
          type: 'select',
          label: '是否生成暂估应付',
          labelWidth: '120px',
          initValue: '',
          props: {
            fieldName: 'isPrepay',
            filterable: true,
            options: this.common().isJudge,
          },
        },
      ],
      page: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      multipleSelection: [], // 选中表格数据
      layout: [
        {
          title: '',
          formItems: [
            {
              label: '总成本金额',
              prop: 'amountAll',
              inputType: 'inputNumber',
              disabled: true,
              span: 12,
            },
            {
              label: '已付款金额',
              prop: 'amountPaid',
              inputType: 'inputNumber',
              disabled: true,
              span: 12,
            },
            {
              label: '待付款金额',
              prop: 'amountWaitPaid',
              inputType: 'inputNumber',
              disabled: true,
              span: 12,
            },
          ],
        },
      ],
      form: {},
      tableData: [],
      tableCols: [
        {
          label: '起始日期',
          prop: 'startTime',
        },
        {
          label: '截止日期',
          prop: 'endTime',
        },
        {
          label: '本次申请支付年限(年)',
          prop: 'limitYear',
        },
        {
          label: '电费单价(元/年)',
          prop: 'priceYear',
        },
        {
          label: 'RRU/AAU设备数量',
          prop: 'devCount',
        },
        {
          label: '成本金额',
          prop: 'cost',
        },
        {
          label: '是否生成暂估应付',
          prop: 'isPrepay',
          render: (h, scope) => {
            const text = scope.row.isPrepay === 1 ? '是' : '否';

            return <div>{{ text }}</div>;
          },
        },
        {
          label: '已付款金额',
          prop: 'amountPaid',
        },
        {
          label: '待付款金额',
          prop: 'amountWaitPaid',
        },
      ],
      hTableCols: [
        {
          label: '起始日期',
          prop: 'startTime',
        },
        {
          label: '截止日期',
          prop: 'endTime',
        },
        {
          label: '成本金额',
          prop: 'cost',
        },
        {
          label: '本次缴纳度数(度)',
          prop: 'degree',
          width: 100,
        },
        {
          label: '电价(元/度)',
          prop: 'priceDegree',
        },
        {
          label: '本次读数(度)',
          prop: 'degreeThis',
        },
        {
          label: '上次读数(度)',
          prop: 'degreeLast',
        },
        {
          label: '是否生成暂估应付',
          prop: 'isPrepay',
          render: (h, scope) => {
            const text = scope.row.isPrepay === 1 ? '是' : '否';

            return <div>{{ text }}</div>;
          },
        },
        {
          label: '已付款金额',
          prop: 'amountPaid',
        },
        {
          label: '待付款金额',
          prop: 'amountPaid',
        },
      ],
      formRules: {},
      baseData: {},
      title: '新增',
      dialogShow: false,
      stationType: null,
    };
  },
  mounted() {
    this.$nextTick(() => {
      // this.onSearch();
      this.inputDisabled = this.data.configType === 'detail';
      this.isEdit = ['add', 'edit'].includes(this.data.configType);
      this.isAdd = ['add'].includes(this.data.configType);
      if (!this.isAdd) {
        this.reqDetail();
      }
    });
  },
  watch: {
    data(val) {
      // this.data = val;
      this.inputDisabled = val.configType === 'detail';
      this.isEdit = ['add', 'edit'].includes(val.configType);
      this.isAdd = ['add'].includes(val.configType);
      if (!this.isAdd) {
        this.reqDetail();
      }
    },
  },
  methods: {
    reqDetail() {
      this.getDetailsForm(); // 获取上面from的数据
      this.getDataAllList(); // 获取下面表格的数据
    },
    onSearch(val) {
      this.searchVal = {
        ...val,
      };
      this.onCurrentChange(1);
    },
    getDetailsForm() {
      const { row } = this.data;

      if (row && row.id) {
        this.loading = true;
        getDetails(row.id).then((res) => {
          if (res && res.code === '200' && res.data) {
            this.form = {
              ...this.form,
              ...res.data,
            };
            this.loading = false;
          }
        });
        if (row.stationType === '小站' && row.city === '广州市') {
          this.handleClickType('littleStation');
        } else {
          this.handleClickType('bigStation');
        }
      }
    },
    // 请求某页数据
    onCurrentChange(val) {
      this.page.current = val;
      this.getDataAllList();
      this.getDetailsForm();
    },
    // 改变请求条数
    onPageSizeChange(val) {
      this.page.pageSize = val;
      this.onCurrentChange(1);
    },
    // 用户数据选择翻页记忆
    getRowKey(row) {
      return row.id;
    },
    getDataAllList() {
      this.loading = true;
      const { row } = this.data;
      const parames = {
        data: {
          ...this.searchVal,
          id: row.id,
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize,
        sorting: 'id desc',
      };

      getDetailsList(parames).then((res) => {
        if (res.code === '200') {
          const { data, total } = res.data;

          this.tableData = data;
          this.page.total = total;
          this.loading = false;
        }
      });
    },
    // 新增月份电费数据
    onAddBtn() {
      const { row } = this.data;

      this.baseData = {
        row: {
          tableData: this.tableData,
          id: row.id,
          outRowData: row,
          detailsData: this.form,
        },
        type: 'electricBase',
        configType: 'add',
      };
      this.title = '新增';
      this.dialogShow = true;
    },
    // 导出站点电费详情
    handleExport() {
      this.$confirm('确定导出以租代建电费详情列表信息?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        const api = handleExportDetails;
        const { row } = this.data;

        api(row.id).then((res) => {
          const fileName = '以租代建电费详情列表信息.xlsx';
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
    // 预览
    openDialog(state, info = {}) {
      const { row } = info;

      if (state === 'delete') {
        this.$confirm('确定删除当前月份电费数据?', '信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          const { id } = info.row;

          deleteElectricCost(row.id).then((res) => {
            if (res && res.code === '200') {
              this.$notify({
                title: '成功',
                message: '删除月份电费数据成功',
                type: 'success',
                position: 'bottom-right',
              });
              this.getDataAllList();
            }
          });
        });

        return;
      }
      if (info.configType === 'detail') {
        this.title = '查看';
      } else if (info.configType === 'edit') {
        this.title = '编辑';
      }
      this.dialogShow = true;
      this.baseData = info;
    },
    handleClickType(type) {
      this.stationType = type;
    },
    openedit() {
      const { row } = this.data;

      if (row && row.id) {
        console.log(row);
        // if (row.stationType === '宏站') {
        //   this.handleClickType('bigStation');
        // } else {
        //   this.handleClickType('littleStation');
        // }

        if (row.stationType === '小站' && row.city === '广州市') {
          this.handleClickType('littleStation');
        } else {
          this.handleClickType('bigStation');
        }
      }
    },
    closeedit() {
      if (this.$refs.electricBase) {
        this.$refs.electricBase.cancelForm();
      }
    },
    canceledit() {
      // this.stationType = null;
      this.closeedit();
      this.dialogShow = false;
    },
    confirmedit() {
      if (this.$refs.electricBase) {
        this.$refs.electricBase.submitFormItem();
      }
    },
    submitFormItem() {
      this.$refs.supplyFormItem.submitForm();
    },
    submitForm(val) {
      console.log('this.data', this.data);
      const { configType, row } = this.data;
      const id = configType === 'add' ? '' : this.form.id;
      const param = {
        // ...val,
      };
      const message = configType === 'add' ? '新增成功' : '修改成功';

      editDeviceInfo(param).then((res) => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message,
            type: 'success',
            position: 'bottom-right',
          });
          this.$emit('success');
        }
      });
    },
    cancelForm() {
      this.form = {};
      this.$refs.supplyFormItem.cancelForm();
    },
    // 新增完成，刷新列表，关闭弹窗
    addElectricBase() {
      this.canceledit('close');
      this.onCurrentChange(1);
    },
  },
  created() {
    if (this.isAdd === false) {
      this.reqDetail();
    }
  },
};
</script>

<style lang="less" scoped>
#base {
}
.electricityFeeDialog {
  .dialogMain {
    .btnList {
      justify-content: center;
      align-items: center;
      div {
        width: 105px;
        height: 30px;
        background: linear-gradient(135deg, #f7660d 0%, #f00a00 100%);
        border-radius: 0;
        margin-right: 10px;
        cursor: pointer;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 15px;
      }
    }
  }
}
</style>
