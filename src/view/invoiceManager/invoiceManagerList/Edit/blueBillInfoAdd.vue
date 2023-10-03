<template>
  <div id="base">
    <FormItem
      ref="supplyFormItem"
      :layout="layout"
      :rules="formRules"
      :disabled="inputDisabled"
      :isEdit="isEdit"
      :form.sync="form"
      @submit="submitForm"
    />
    <!-- 蓝票票据信息 -->
    <wrapper :key="'blueBillInfo'" :title="'蓝票票据信息'" :isFold="false">
      <span class="add-btn" @click="addBlueBillInfo()" v-if="!redAdd && !inputDisabled">新增</span>
      <page-table
        ref="blueBillInfoTable"
        col-align="left"
        :data="blueBillInfoData"
        :cols="blueBillInfoTableCols"
        :selection="false"
        :operator="!inputDisabled"
        :showPage="false"
        operator-width="110"
        :hideDefaultIndex="true"
        reserveSelection
      >
        <template slot-scope="scope" slot="operator">
          <flex>
            <el-button
              type="text"
              size="small"
              title="编辑"
              v-if="!redAdd"
              icon="iconfont icon-bianji"
              @click.prevent.stop="editBlueBillInfo(scope.index, scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="text"
              size="small"
              title="删除"
              v-if="!redAdd"
              icon="iconfont icon-shanchu"
              @click.prevent.stop="deleteBlueBillInfo(scope.index, scope.row)"
            >
              删除
            </el-button>
            <el-button
              type="text"
              size="small"
              title="红票申请"
              icon="iconfont icon-xinzeng"
              v-if="redAdd"
              @click.prevent.stop="
                tableAction('redAdd', {
                  index: scope.index,
                  data: scope.row,
                })
              "
            >
              红票申请
            </el-button>
          </flex>
        </template>
      </page-table>
    </wrapper>
    <!-- 红票票据信息 -->
    <wrapper :key="'redBillInfo'" :title="'红票票据信息'" :isFold="false">
      <page-table
        ref="uploadTenderTable"
        col-align="left"
        :data="redBillInfoData"
        :cols="redBillInfoTableCols"
        :selection="false"
        :operator="!inputDisabled"
        :showPage="false"
        operator-width="110"
        :hideDefaultIndex="true"
        reserveSelection
      >
        <template slot-scope="scope" slot="operator">
          <flex>
            <el-button
              type="text"
              size="small"
              title="编辑"
              v-if="scope.row.status === 'verify_draft' && !scope.row.editRow"
              icon="iconfont icon-bianji"
              @click.prevent.stop="
                tableAction('edit', {
                  index: scope.index,
                  data: scope.row,
                })
              "
            >
            </el-button>
            <el-button
              type="text"
              size="small"
              title="保存"
              v-if="scope.row.status === 'verify_draft' && scope.row.editRow"
              icon="iconfont icon-baocun1"
              @click.prevent.stop="
                tableAction('save', {
                  index: scope.index,
                  data: scope.row,
                })
              "
            >
            </el-button>
            <el-button
              type="text"
              size="small"
              title="删除"
              v-if="scope.row.status === 'verify_draft' && redAdd"
              icon="iconfont icon-shanchu"
              @click.prevent.stop="
                tableAction('del', {
                  index: scope.index,
                  data: scope.row,
                })
              "
            >
            </el-button>
            <el-button
              type="text"
              size="small"
              title="上传"
              v-if="scope.row.status === 'verify_draft' && redAdd"
              icon="iconfont icon-fabu"
              @click.prevent.stop="
                tableAction('fabu', {
                  index: scope.index,
                  data: scope.row,
                })
              "
            >
            </el-button>
          </flex>
        </template>
      </page-table>
    </wrapper>
    <blueBillInfo :show="blueAddShow" :blueAddData="blueAddData" @cancel="closeBlueAdd" @success="successBlueAdd" />
    <dialog-cont
      @on-cancel="canceledit('cancel')"
      @on-close="canceledit('close')"
      @on-confirm="confirmedit"
      :title="`提交审核`"
      width="950px"
      :visible.sync="fabuShow"
      ref="fabuDialog"
      :confirmShow="true"
      :appendToBody="true"
    >
      <fabuInfo ref="fabuInfo" :data="fabuData" @success="successSubmit" />
    </dialog-cont>
  </div>
</template>

<script>
import FormItem from '@/components/formItem';
import Wrapper from '@/components/wrapper';
import Flex from '@/components/flex';
import PageTable from '@/components/page-table';
import dialogCont from '@/components/dialog';
import fabuInfo from '@/view/common/fabu.vue';
import blueBillInfo from '@/view/invoiceManager/invoiceManagerList/Edit/blueBillInfo.vue';
import {
  addBlueInvoice,
  editInvoicePage,
  editRedInvoicePage,
  updateBlueInvoice,
  addRedInvoice,
  updateRedInvoice,
  deleteRedInvoice,
} from '@/api/invoiceManager/invoiceIndex';

export default {
  name: 'baseInfo',
  components: {
    FormItem,
    Wrapper,
    Flex,
    PageTable,
    blueBillInfo,
    fabuInfo,
    dialogCont,
  },
  props: {
    show: Boolean,
    data: {},
  },
  inject: ['common'],
  data() {
    const { configType } = this.data;

    return {
      blueAddShow: false,
      blueAddData: {},
      redAddShow: false,
      redAddData: {},
      redAdd: false,
      /** 输入禁用 */
      inputDisabled: configType === 'detail',
      isEdit: ['add', 'edit'].includes(configType),
      isAdd: ['add'].includes(configType),
      form: {},
      layout: [
        {
          title: '开票管理基础数据',
          formItems: [
            {
              label: '委托方',
              prop: 'consignor',
              inputType: 'select',
              span: 12,
              options: this.common().constructionCode,
            },
            {
              label: '建设主体',
              prop: 'subject',
              inputType: 'select',
              span: 12,
              options: this.common().subjectCode,
            },
            {
              label: '发票类型',
              prop: 'invoiceType',
              inputType: 'select',
              span: 12,
              options: this.common().invoiceType,
            },
            {
              label: '税率',
              prop: 'rate',
              inputType: 'select',
              span: 12,
              options: this.common().taxRateCode,
            },
            {
              label: '选择维度',
              prop: 'choiceDimension',
              inputType: 'select',
              span: 12,
              options: this.common().choiceDimension,
            },
          ],
        },
      ],
      formRules: {
        construction: {
          required: true,
          message: '请选择委托方',
          trigger: '[blur, change]',
        },
        subject: {
          required: true,
          message: '请选择建设主体',
          trigger: '[blur, change]',
        },
        invoiceType: {
          required: true,
          message: '请选择发票类型',
          trigger: '[blur, change]',
        },
        rate: {
          required: true,
          message: '请选择税率',
          trigger: '[blur, change]',
        },
        choiceDimension: {
          required: true,
          message: '请选择选择维度',
          trigger: '[blur, change]',
        },
      },
      // 蓝票票据信息Data
      blueBillInfoData: [],
      blueBillInfoTableCols: [
        {
          label: '业务编码',
          prop: 'billId',
          width: 200,
          align: 'center',
        },
        {
          label: '开票名称',
          prop: 'name',
          width: 200,
          align: 'center',
        },
        {
          label: 'ERP',
          prop: 'erpNumber',
          width: 200,
          align: 'center',
        },
        {
          label: '款项类型',
          prop: 'fundsTypeName',
          width: 200,
          align: 'center',
        },
        {
          label: '发票金额',
          prop: 'amount',
          width: 200,
          align: 'center',
        },
        {
          label: '不含税',
          prop: 'amountNTax',
          width: 200,
          align: 'center',
        },
        {
          label: '税金',
          prop: 'amountTax',
          width: 200,
          align: 'center',
        },
        {
          label: '质保金总额',
          prop: 'mortgage',
          width: 200,
          align: 'center',
        },
        {
          label: '申请人',
          prop: 'createBy',
          width: 200,
          align: 'center',
        },
        {
          label: '创建时间',
          prop: 'createDate',
          width: 200,
          align: 'center',
        },
        {
          label: '财务核销时间',
          prop: 'confirmDate',
          width: 200,
          align: 'center',
        },
        {
          label: '是否历史记录',
          prop: 'isHistory',
          width: 200,
          align: 'center',
        },
        {
          label: '已核销金额',
          prop: 'verifyAmount',
          width: 200,
          align: 'center',
        },
        {
          label: '摘要',
          prop: 'remark',
          width: 200,
          align: 'center',
        },
      ],
      // 红票票据信息Data
      editRow: false,
      redBillInfoData: [],
      redBillInfoTableCols: [
        {
          label: '申请编号',
          prop: 'applyId',
          align: 'center',
        },
        {
          label: '蓝票编号',
          prop: 'invoiceId',
          align: 'center',
        },
        {
          label: '金额',
          prop: 'redAmount',
          align: 'center',
          render: (h, scope) => {
            const d = scope.row;

            let html = scope.row.redAmount;

            if (d.editRow) {
              html = (
                <el-input
                  class="editInput"
                  value={scope.row[scope.column.property] || ''}
                  onInput={(val) => {
                    this.changeInput(val, scope.$index, scope.column.property);
                  }}
                ></el-input>
              );
            }

            return <div>{html}</div>;
          },
        },
        {
          label: '备注',
          prop: 'remark',
          align: 'center',
          render: (h, scope) => {
            const d = scope.row;

            let html = scope.row.remark;

            if (d.editRow) {
              html = (
                <el-input
                  class="editInput"
                  value={scope.row[scope.column.property] || ''}
                  onInput={(val) => {
                    this.changeInput(val, scope.$index, scope.column.property);
                  }}
                ></el-input>
              );
            }

            return <div>{html}</div>;
          },
        },
        {
          label: '状态',
          prop: 'statusName',
          width: 200,
          align: 'center',
        },
      ],
      fabuShow: false,
      fabuData: {},
    };
  },
  mounted() {
    // this.$nextTick(() => {
    // });
  },
  watch: {
    data(val) {
      // this.data = val;
      this.inputDisabled = val.configType === 'detail';
      this.isEdit = ['add', 'edit'].includes(val.configType);
      this.isAdd = ['add'].includes(val.configType);
      if (val.configType === 'redAdd') {
        this.redAdd = true;
        this.inputDisabled = true;
      } else {
        this.redAdd = false;
      }
      if (!this.isAdd) {
        this.reqDetail();
      }
    },
  },
  methods: {
    // 蓝票票据信息添加
    addBlueBillInfo() {
      if (!this.form.consignor) {
        this.$notify.error({
          title: '失败',
          message: '请选择委托方!!!',
          position: 'bottom-right',
        });

        return false;
      }
      if (!this.form.rate) {
        this.$notify.error({
          title: '失败',
          message: '请选择税率!!!',
          position: 'bottom-right',
        });

        return false;
      }
      if (!this.form.choiceDimension) {
        this.$notify.error({
          title: '失败',
          message: '请选择维度!!!',
          position: 'bottom-right',
        });

        return false;
      }
      this.form.editIndex = undefined;
      this.blueAddData = {
        row: this.form,
        type: 'add',
        configType: 'add',
      };
      this.blueAddShow = true;
    },
    reqDetail() {
      const { row } = this.data;

      if (row && row.id) {
        let api = editInvoicePage;

        if (this.redAdd) {
          api = editRedInvoicePage;
        }
        api(row.id).then((res) => {
          if (res && res.code === '200') {
            this.form = {
              ...this.form,
              ...res.data,
            };
            this.blueBillInfoData = res.data.details;
            this.redBillInfoData = res.data.redDetails;
          }
        });
      }
    },
    submitFormItem() {
      this.$refs.supplyFormItem.submitForm();
    },
    submitForm(val) {
      if (this.blueBillInfoData.length === 0) {
        this.$notify.error({
          title: '失败',
          message: '没有填写细项信息!!!',
          position: 'bottom-right',
        });

        return false;
      }
      console.log('this.data', this.data);
      const { configType, row } = this.data;
      const id = configType === 'add' ? '' : this.form.id;

      let param = {
        billId: val.billId ? val.billId : '',
        choiceDimension: val.choiceDimension,
        consignor: val.construction,
        details: this.blueBillInfoData,
        invoiceType: val.invoiceType,
        rate: val.rate,
        subject: val.subject,
      };
      const message = configType === 'add' ? '新增成功' : '修改成功';

      let api = addBlueInvoice;

      if (id) {
        api = updateBlueInvoice;
        param = {
          ...param,
          id,
        };
      }
      api(param).then((res) => {
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
    // 关闭蓝票票据信息添加
    closeBlueAdd() {
      this.blueAddShow = false;
      this.blueAddData = {};
    },
    // 确定保存添加
    successBlueAdd(obj) {
      this.closeBlueAdd();
      console.log('点击添加', obj);
      const oneDate = {
        amount: obj.amount,
        amountNTax: obj.amountNTax,
        amountTax: obj.amountTax,
        billId: obj.billId,
        choiceDimension: obj.choiceDimension,
        confirmDate: obj.confirmDate,
        createBy: obj.createBy,
        createDate: obj.createDate,
        erpNumber: obj.erpNumber,
        erpNumberName: obj.erpNumberName,
        fundsType: obj.fundsType,
        fundsTypeName: obj.fundsTypeName,
        id: '',
        indexRow: obj.indexRow,
        isHistory: obj.isHistory,
        mortgage: obj.mortgage,
        name: obj.name,
        operator: obj.operator,
        prePaymentBillid: obj.prePaymentBillid,
        remark: obj.remark,
        subpackageSubBathId: obj.subpackageSubBathId,
        verifyAmount: obj.verifyAmount,
      };

      if (obj.editIndex === undefined) {
        // 添加
        this.blueBillInfoData.push(oneDate);
      } else {
        // 编辑
        oneDate.editIndex = obj.editIndex;
        this.blueBillInfoData.splice(obj.editIndex, 1, oneDate);
      }
      console.log('this.blueBillInfoData', this.blueBillInfoData);
      this.blueBillInfoData.splice(1, 0);
      this.closeBlueAdd();
    },
    // 蓝屏票据信息编辑
    editBlueBillInfo(index, rowObj) {
      rowObj.editIndex = index;
      this.blueAddData = {
        row: rowObj,
        type: 'edit',
        configType: 'edit',
      };
      this.blueAddShow = true;
    },
    // 蓝屏票据信息删除
    deleteBlueBillInfo(index, rowObj) {
      this.blueBillInfoData.splice(index, 1);
    },
    // 输入框改变
    changeInput(val, index, name) {
      this.redBillInfoData[index] = {
        ...this.redBillInfoData[index],
        [name]: val,
      };
      this.redBillInfoData.splice(1, 0);
    },
    tableAction(type, row) {
      console.log('row', row);
      const { id, applyId, billId } = row.data;

      if (type === 'redAdd') {
        if (this.editRow) {
          this.$notifyError('请先保存当前新增行数据再进行添加操作');

          return;
        }

        this.editRow = true;
        this.redBillInfoData.push({
          applyId,
          invoiceId: billId,
          editRow: true,
        });
        this.redBillInfoData.splice(1, 0);
      }
      if (type === 'edit') {
        this.redBillInfoData[row.index] = {
          ...this.redBillInfoData[row.index],
          editRow: true,
        };
        this.editRow = true;
        this.redBillInfoData.splice(1, 0);
      }
      if (type === 'save') {
        let api = addRedInvoice;

        let message = '添加成功';

        if (id) {
          api = updateRedInvoice;
          message = '更新成功';
        }
        api(row.data).then((res) => {
          if (res && res.code === '200') {
            this.$notify({
              title: '成功',
              message,
              type: 'success',
              position: 'bottom-right',
            });
            this.redBillInfoData[row.index] = {
              ...this.redBillInfoData[row.index],
              editRow: false,
            };
            this.editRow = false;
            this.redBillInfoData.splice(1, 0);
            this.reqDetail();
          }
        });
      }
      if (type === 'del') {
        this.$confirm('确定删除当前红票?', '信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          deleteRedInvoice(row.data.id).then((res) => {
            if (res.code === '200') {
              this.$message({
                type: 'success',
                message: '删除成功!',
              });
              this.redBillInfoData.splice(row.index, 1);
              this.editRow = false;
            }
          });
        });
      }
      if (type === 'fabu') {
        this.fabuData = {
          row: {
            ...row.data,
            businessCode: 't_red_bule_relation',
          },
          type: 'fabu',
          configType: 'fabu',
        };
        this.fabuShow = true;
      }
    },
    canceledit(type) {
      if (this.$refs.fabuInfo) {
        this.$refs.fabuInfo.cancelForm();
      }
      this.fabuData = {};
      this.fabuShow = false;
    },
    confirmedit() {
      if (this.$refs.fabuInfo) {
        this.$refs.fabuInfo.submitFormItem();
      }
    },
    successSubmit() {
      this.canceledit();
      this.reqDetail();
    },
  },
  created() {
    this.inputDisabled = this.data.configType === 'detail';
    this.isEdit = ['add', 'edit'].includes(this.data.configType);
    this.isAdd = ['add'].includes(this.data.configType);
    if (this.data.configType === 'redAdd') {
      this.redAdd = true;
      this.inputDisabled = true;
    } else {
      this.redAdd = false;
    }
    if (this.isAdd === false) {
      this.reqDetail();
    }
  },
};
</script>

<style lang="less" scoped>
#base {
  .comp-page-table {
    min-height: auto;
  }
  .comp-wrapper {
    position: relative;
  }
  .add-btn {
    display: inline-block;
    padding: 3px 12px;
    color: #fff;
    background: linear-gradient(135deg, #f7660d 5%, #f00a00 100%);
    margin-bottom: 8px;
    cursor: pointer;
    position: absolute;
    right: 18px;
    top: 7px;
    z-index: 10;
    border-radius: 4px;
  }
}
</style>
