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
      <span class="add-btn" @click="addBlueBillInfo()">新增</span>
      <page-table
        ref="blueBillInfoTable"
        col-align="left"
        :data="blueBillInfoData"
        :cols="blueBillInfoTableCols"
        :selection="false"
        :operator="true"
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
              icon="iconfont icon-bianji"
              @click.prevent.stop="editBlueBillInfo(scope.index, scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="text"
              size="small"
              title="删除"
              icon="iconfont icon-shanchu"
              @click.prevent.stop="deleteBlueBillInfo(scope.index, scope.row)"
            >
              删除
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
        :operator="true"
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
              icon="iconfont icon-bianji"
              @click.prevent.stop="
                tableAction('edit', {
                  index: scope.index,
                  data: scope.row,
                })
              "
            >
              编辑
            </el-button>

            <el-button
              type="text"
              size="small"
              title="删除"
              icon="iconfont icon-shanchu"
              @click.prevent.stop="
                tableAction('del', {
                  index: scope.index,
                  data: scope.row,
                })
              "
            >
              删除
            </el-button>
            <el-button
              type="text"
              size="small"
              title="上传"
              icon="iconfont icon-fabu"
              @click.prevent.stop="
                tableAction('save', {
                  index: scope.index,
                  data: scope.row,
                })
              "
            >
              上传
            </el-button>
          </flex>
        </template>
      </page-table>
    </wrapper>
    <blueBillInfo :show="blueAddShow" :blueAddData="blueAddData" @cancel="closeBlueAdd" @success="successBlueAdd" />
  </div>
</template>

<script>
import FormItem from '@/components/formItem';
import Wrapper from '@/components/wrapper';
import Flex from '@/components/flex';
import PageTable from '@/components/page-table';
import blueBillInfo from '@/view/invoiceManager/invoiceManagerList/Edit/redBillInfo.vue';
import { addBlueInvoice } from '@/api/invoiceManager/invoiceIndex';

export default {
  name: 'handleInfo',
  components: {
    FormItem,
    Wrapper,
    Flex,
    PageTable,
    blueBillInfo,
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
              prop: 'construction',
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
              onChange: (val) => {
                const params = this.common().taxRateCode.filter((ele) => ele.id === val)[0];

                this.form.rate = val;
                this.form.taxRate = (params.value || 0) / 100;
                console.log(params);
              },
            },
            {
              label: '选择维度',
              prop: 'choiceDimension',
              inputType: 'select',
              span: 12,
              options: [
                {
                  id: '1',
                  name: '按项目',
                },
                {
                  id: '2',
                  name: '按预缴税',
                },
              ],
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
      redBillInfoData: [],
      redBillInfoTableCols: [
        {
          label: '申请编号',
          prop: 'applyId',
          width: 200,
          align: 'center',
        },
        {
          label: '蓝票编号',
          prop: 'invoiceId',
          width: 200,
          align: 'center',
        },
        {
          label: '金额',
          prop: 'redAmount',
          width: 200,
          align: 'center',
        },
        {
          label: '备注',
          prop: 'remark',
          width: 200,
          align: 'center',
        },
        {
          label: '状态',
          prop: 'statusName',
          width: 200,
          align: 'center',
        },
      ],
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
      if (!this.isAdd) {
        this.reqDetail();
      }
    },
  },
  methods: {
    // 蓝票票据信息添加
    addBlueBillInfo() {
      if (!this.form.construction) {
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
        this.form = {
          ...this.form,
          ...row,
        };
      }

      console.log('this.common().taxRateCode==============');
      console.log(this.common().taxRateCode);
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

      // const param = {
      //   billId: '',
      //   choiceDimension: '1',
      //   consignor: 'CESHI001',
      //   details: [
      //     {
      //       amount: '5150',
      //       amountNTax: '5000.00',
      //       amountTax: '150.00',
      //       billId: '',
      //       choiceDimension: '1',
      //       confirmDate: '',
      //       createBy: '',
      //       createDate: '',
      //       erpNumber: '22XGDGZ测试001',
      //       erpNumberName: '22XGDGZ测试001',
      //       fundsType: 'fundsType_1',
      //       fundsTypeName: '进度款',
      //       id: '',
      //       indexRow: '',
      //       isHistory: '',
      //       mortgage: '',
      //       name: 'CT',
      //       operator: '',
      //       prePaymentBillid: '',
      //       remark: '22XGDGZ测试001\nWWW212121\n\n进度款\n按项目开票',
      //       subpackageSubBathId: '20220628746607-001',
      //       verifyAmount: '',
      //     },
      //   ],
      //   id: '',
      //   invoiceType: 'invoice_type_01',
      //   rate: 'tax_3',
      //   subject: 'GD_TJ',
      // };

      const param = {
        billId: val.billId ? val.billId : '',
        choiceDimension: val.choiceDimension,
        consignor: val.construction,
        details: this.blueBillInfoData,
        id,
        invoiceType: val.invoiceType,
        rate: val.rate,
        subject: val.subject,
      };
      const message = configType === 'add' ? '新增成功' : '修改成功';

      addBlueInvoice(param).then((res) => {
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
