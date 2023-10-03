<template>
  <div id="base" class="flexColumn">
    <!--项目过程 -->
    <div title="流程" class="statusList">
      <div
        v-for="(item, index) in statusList"
        :key="item.id"
        :class="form[item.id] ? 'active' : ''"
        @click="() => handleStatusActive(item, index)"
      >
        <i class="iconfont icon-guochengguanli" />
        <span>{{ `${form[item.id] ? '已' : '未'}${item.name}` }}</span>
      </div>
    </div>
    <formItem ref="supplyFormItem" :layout="layout" :rules="formRules" :disabled="true" :form.sync="form" />

    <wrapper title="过程信息">
      <ul class="step-list">
        <li :class="form.actualStartTime ? 'done' : 'undone'">
          <span class="heartbit"></span>
          <span class="yuan"></span>
          <span class="title">开工时间</span>
          <span class="time pos-a">{{ form.actualStartTime ? form.actualStartTime : '' }}</span>
        </li>
        <li :class="form.actualEndTime ? 'done' : 'undone'">
          <span class="heartbit"></span>
          <span class="yuan"></span>
          <span class="title">完工时间</span>
          <span class="time pos-a">{{ form.actualEndTime ? form.actualEndTime : '' }}</span>
        </li>
        <li :class="form.preliminaryDate ? 'done' : 'undone'">
          <span class="heartbit"></span>
          <span class="yuan"></span>
          <span class="title">初验时间</span>
          <span class="time pos-a">{{ form.preliminaryDate ? form.preliminaryDate : '' }}</span>
        </li>
        <li :class="form.submitTime ? 'done' : 'undone'">
          <span class="heartbit"></span>
          <span class="yuan"></span>
          <span class="title">审定时间</span>
          <span class="time pos-a">{{ form.submitTime ? form.submitTime : '' }}</span>
        </li>
        <li :class="form.finalDate ? 'done' : 'undone'">
          <span class="heartbit"></span>
          <span class="yuan"></span>
          <span class="title">终验时间</span>
          <span class="time pos-a">{{ form.finalDate ? form.finalDate : '' }}</span>
        </li>
      </ul>
    </wrapper>
    <dialogCont
      @on-cancel="canceledit('cancel')"
      @on-close="canceledit('close')"
      :customClass="'projectApprovalManagemenDialog'"
      @on-confirm="confirmedit"
      appendToBody
      :title="`${statuTitle}`"
      :width="form.submitTime ? '950px' : '450px'"
      :visible.sync="dialogShow"
      ref="dialog"
    >
      <div>
        <formItem
          ref="moneyFormItem"
          :layout="moneyLayout"
          :rules="formRules"
          v-if="form.submitTime"
          :form.sync="moneyForm"
        />
        <div class="flexRow" v-if="!form.submitTime">
          <span :style="'width: 100px; line-height: 30px'">选择时间：</span>
          <el-date-picker
            v-model="dataTime"
            type="datetime"
            placeholder="选择日期时间"
            :format="'yyyy-MM-dd HH:mm:ss'"
            :value-format="'yyyy-MM-dd HH:mm:ss'"
          />
        </div>
      </div>
    </dialogCont>
  </div>
</template>

<script>
import formItem from '@/components/formItem';
import dialogCont from '@/components/dialog';
import wrapper from '@/components/wrapper';
import { reductionRate, handleVerdictAmount, authorizeAmount, comparison } from '../utils';
import {
  getProjectProcessDetailsByErpNumber,
  updateProjectProcessStatus,
} from '@/api/marketMiddleStage/projectApprovalManagement';

export default {
  name: 'baseInfo',
  components: {
    formItem,
    wrapper,
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
      /** 输入禁用 */
      inputDisabled: configType === 'detail',
      isEdit: ['add', 'edit'].includes(configType),
      isAdd: ['add'].includes(configType),
      form: {},
      layout: [
        {
          title: '项目基本信息',
          formItems: [
            {
              label: 'ERP编号',
              prop: 'erpNumber',
              inputType: 'input',
              span: 12,
            },
            {
              label: '项目名称',
              prop: 'projectName',
              inputType: 'input',
              span: 12,
            },
            {
              label: '省份',
              prop: 'province',
              inputType: 'input',
              span: 12,
            },
            {
              label: '城市',
              prop: 'city',
              inputType: 'input',
              span: 12,
            },
            {
              label: '一级专业',
              prop: 'oneMajor',
              inputType: 'input',
              span: 12,
            },
            {
              label: '二级专业',
              prop: 'twoMajor',
              inputType: 'input',
              span: 12,
            },
            {
              label: '项目经理',
              prop: 'manager',
              inputType: 'input',
              span: 12,
            },
            {
              label: '计划开工',
              prop: 'startTime',
              inputType: 'input',
              span: 12,
            },
            {
              label: '计划完工',
              prop: 'endTime',
              inputType: 'input',
              span: 12,
            },
            {
              label: '项目内容',
              prop: 'description',
              inputType: 'input',
              span: 12,
            },
            {
              label: '项目状态',
              prop: 'status',
              inputType: 'input',
              span: 12,
            },
          ],
        },
      ],
      moneyForm: {
        auditFee: undefined,
        submit: 'true',
        materialNotCost: undefined,
        materialMoney: 0,
        materialCostTaxRate: undefined,
        constructionMoney: 0,
        constructionTotal: undefined,
        constructionNotCost: undefined,
        materialTotal: undefined,
        verdictAmount: undefined,
        other: undefined,
        dataTime: undefined,
      },
      moneyLayout: [
        {
          title: '金额信息',
          formItems: [
            {
              label: '结算金额',
              prop: 'authorizeAmount',
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: '审定金额',
              prop: 'verdictAmount',
              inputType: 'inputNumber',
              span: 12,
              onChange: (val) => {
                if (this.moneyForm.verdictAmount === val) {
                  return;
                }
                this.moneyForm = {
                  ...this.moneyForm,
                  verdictAmount: val,
                };
                this.moneyForm = authorizeAmount(this.moneyForm);
              },
            },
            {
              label: '审减率',
              prop: 'reductionRate',
              inputType: 'input',
              span: 12,
            },
            {
              label: '是否需要送审',
              prop: 'submit',
              inputType: 'select',
              span: 12,
              options: this.common().submitCode,
            },
            {
              label: '送审金额',
              prop: 'submitMoney',
              inputType: 'inputNumber',
              span: 12,
              onChange: (val) => {
                if (this.moneyForm.submitMoney === val) {
                  return;
                }
                this.moneyForm = {
                  ...this.moneyForm,
                  submitMoney: val,
                };
                this.moneyForm = reductionRate(this.moneyForm);
              },
            },
            {
              label: '送审时间',
              prop: 'submitTime',
              inputType: 'dataPicker',
              formatText: 'yyyy 年 MM 月 dd 日  HH 时 mm 分 ss 秒',
              format: 'yyyy-MM-dd HH:mm:ss',
              span: 12,
            },
            {
              label: '施工费',
              prop: 'constructionNotCost',
              inputType: 'inputNumber',
              span: 12,
              onChange: (val) => {
                if (this.moneyForm.constructionNotCost === val) {
                  return;
                }
                this.moneyForm = {
                  ...this.moneyForm,
                  constructionNotCost: val,
                };
                const { constructionNotCost, constructionCostTaxRate } = this.moneyForm;

                if (!constructionNotCost || !constructionCostTaxRate) {
                  this.moneyForm.constructionMoney = 0;

                  return;
                }
                const taxRetaValue = constructionCostTaxRate.split('_')[1];
                const amountTax = (
                  (parseFloat(constructionNotCost || 0) * parseFloat(taxRetaValue || 0)) /
                  100
                ).toFixed(2);

                this.moneyForm.constructionMoney = amountTax;
                // 合计
                this.moneyForm.materialTotal = parseFloat(this.moneyForm.materialTotal || 0);

                this.moneyForm.constructionTotal = parseFloat(constructionNotCost || 0) + parseFloat(amountTax || 0);

                // 审定金额
                this.moneyForm = handleVerdictAmount(
                  this.moneyForm,
                  this.moneyForm.constructionTotal,
                  this.moneyForm.materialTotal,
                );

                // 审减率
                this.moneyForm = reductionRate(
                  this.moneyForm,
                  this.moneyForm.constructionTotal,
                  this.moneyForm.materialTotal,
                );
              },
            },
            {
              label: '施工费税率',
              prop: 'constructionCostTaxRate',
              inputType: 'select',
              span: 12,
              options: this.common().taxRateCode,
              onChange: (val) => {
                if (this.moneyForm.constructionCostTaxRate === val) {
                  return;
                }
                this.moneyForm = {
                  ...this.moneyForm,
                  constructionCostTaxRate: val,
                };
                const taxRetaValue = val.split('_')[1];
                const { constructionNotCost, constructionCostTaxRate, materialTotal } = this.moneyForm;

                if (!constructionNotCost || !constructionCostTaxRate) {
                  this.moneyForm.constructionMoney = 0;

                  return;
                }
                const amountTax = (
                  (parseFloat(constructionNotCost || 0) * parseFloat(taxRetaValue || 0)) /
                  100
                ).toFixed(2);

                this.moneyForm.constructionMoney = amountTax;
                // 合计
                const constructionTotal = parseFloat(constructionNotCost || 0) + parseFloat(amountTax || 0);

                this.moneyForm.materialTotal = parseFloat(materialTotal || 0);
                this.moneyForm.constructionTotal = constructionTotal;

                // 定案总额
                this.moneyForm = handleVerdictAmount(this.moneyForm, constructionTotal, this.moneyForm.materialTotal);

                // 审减率
                this.moneyForm = reductionRate(this.moneyForm, constructionTotal, this.moneyForm.materialTotal);
              },
            },
            {
              label: '施工税',
              prop: 'constructionMoney',
              disabled: true,
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: '材料费',
              prop: 'materialNotCost',
              inputType: 'inputNumber',
              span: 12,
              onChange: (val) => {
                if (this.moneyForm.materialNotCost === val) {
                  return;
                }
                this.moneyForm = {
                  ...this.moneyForm,
                  materialNotCost: val,
                };
                const { constructionTotal, materialCostTaxRate, materialTotal, other } = this.moneyForm;

                if (materialCostTaxRate) {
                  const taxRetaValue = materialCostTaxRate.split('_')[1];
                  const amountTax = ((parseFloat(val || 0) * parseFloat(taxRetaValue || 0)) / 100).toFixed(2);

                  this.moneyForm.materialMoney = amountTax;
                  // 合计
                  this.moneyForm.constructionTotal = parseFloat(constructionTotal || 0);

                  this.moneyForm.materialTotal = parseFloat(val || 0) + parseFloat(amountTax || 0);
                  // 审定金额
                  this.moneyForm.verdictAmount =
                    this.moneyForm.constructionTotal + this.moneyForm.materialTotal + parseFloat(other || 0);
                  // 审减率
                  this.moneyForm = reductionRate(
                    this.moneyForm,
                    this.moneyForm.constructionTotal,
                    this.moneyForm.materialTotal,
                    other,
                  );
                }
              },
            },
            {
              label: '材料费税率',
              prop: 'materialCostTaxRate',
              inputType: 'select',
              span: 12,
              options: this.common().taxRateCode,
              onChange: (val) => {
                if (this.moneyForm.materialCostTaxRate === val) {
                  return;
                }
                this.moneyForm = {
                  ...this.moneyForm,
                  materialCostTaxRate: val,
                };
                const taxRetaValue = val.split('_')[1];

                const { materialNotCost, materialCostTaxRate, constructionTotal } = this.moneyForm;

                if (!materialNotCost || !materialCostTaxRate) {
                  this.moneyForm.materialMoney = 0;

                  return;
                }

                const amountTax = ((parseFloat(materialNotCost || 0) * parseFloat(taxRetaValue || 0)) / 100).toFixed(2);

                this.moneyForm.materialMoney = amountTax;
                // 合计
                this.moneyForm.constructionTotal = parseFloat(constructionTotal || 0);
                const materialTotal = parseFloat(this.moneyForm.materialNotCost || 0) + parseFloat(amountTax || 0);

                this.moneyForm.materialTotal = materialTotal;

                // 定案总额
                this.moneyForm = handleVerdictAmount(
                  this.moneyForm,
                  this.moneyForm.constructionTotal,
                  this.moneyForm.materialTotal,
                );

                // 审减率
                this.moneyForm = reductionRate(
                  this.moneyForm,
                  this.moneyForm.constructionTotal,
                  this.moneyForm.materialTotal,
                );
              },
            },
            {
              label: '材料税',
              prop: 'materialMoney',
              disabled: true,
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: '总材料费',
              prop: 'materialTotal',
              inputType: 'inputNumber',
              span: 12,
              onChange: (val) => {
                if (this.moneyForm.materialTotal === val) {
                  return;
                }
                this.moneyForm = {
                  ...this.moneyForm,
                  materialTotal: val,
                };
                const { constructionTotal, materialTotal } = this.moneyForm;

                const constructionTotalParame = parseFloat(constructionTotal || 0);

                const materialTotalParame = parseFloat(materialTotal || 0);

                // 定案总额
                this.moneyForm = handleVerdictAmount(this.moneyForm, constructionTotalParame, materialTotalParame);
              },
            },
            {
              label: '总施工费',
              prop: 'constructionTotal',
              inputType: 'inputNumber',
              span: 12,
              onChange: (val) => {
                if (this.moneyForm.constructionTotal === val) {
                  return;
                }
                this.moneyForm = {
                  ...this.moneyForm,
                  constructionTotal: val,
                };
                const { constructionTotal, materialTotal, other } = this.moneyForm;

                const constructionTotalParame = parseFloat(constructionTotal || 0);

                const materialTotalParame = parseFloat(materialTotal || 0);

                // 定案总额
                this.moneyForm = handleVerdictAmount(this.moneyForm, constructionTotalParame, materialTotalParame);
              },
            },
            {
              label: '其他',
              prop: 'other',
              inputType: 'inputNumber',
              span: 12,
              onChange: (val) => {
                if (this.moneyForm.other === val) {
                  return;
                }
                const { constructionTotal, materialTotal } = this.moneyForm;

                const constructionTotalParame = parseFloat(constructionTotal || 0);

                const materialTotalParame = parseFloat(materialTotal || 0);

                // 定案总额
                this.moneyForm = handleVerdictAmount(this.moneyForm, constructionTotalParame, materialTotalParame);

                // 审增减率
                this.moneyForm = reductionRate(this.moneyForm, constructionTotalParame, materialTotalParame);

                this.moneyForm = {
                  ...this.moneyForm,
                  other: val,
                };
              },
            },
            {
              label: '审计费',
              prop: 'auditFee',
              inputType: 'inputNumber',
              span: 12,
              onChange: (val) => {
                if (this.moneyForm.auditFee === val) {
                  return;
                }
                this.moneyForm = {
                  ...this.moneyForm,
                  auditFee: val,
                };
                this.moneyForm = authorizeAmount(this.moneyForm);
              },
            },
          ],
        },
        {
          title: '时间信息',
          formItems: [
            {
              label: '日期时间',
              prop: 'dataTime',
              inputType: 'dataPicker',
              span: 12,
              formatText: 'yyyy 年 MM 月 dd 日  HH 时 mm 分 ss 秒',
              format: 'yyyy-MM-dd HH:mm:ss',
            },
            {
              label: '上传附件',
              prop: 'fileList',
              disabled: false,
              placeholder: '支持pdf/.jpg/.png格式文件',
              limit: 1,
              accept: '.jpg, .png, .pdf, .jpeg',
              inputType: 'upload',
              params: {
                filePath: 'fileUpload',
                serviceCode: this.routerCode,
              },
              span: 12,
            },
          ],
        },
      ],
      formRules: {
        dataTime: {
          required: true,
          message: '请输入日期时间',
          trigger: 'blur',
        },
      },
      statusList: [
        {
          id: 'actualStartTime',
          name: '完工',
          value: 1,
        },
        {
          id: 'actualEndTime',
          name: '完成',
          value: 2,
        },
        {
          id: 'preliminaryDate',
          name: '初验',
          value: 3,
        },
        {
          id: 'submitTime',
          name: '审定',
          value: 5,
        },
        {
          id: 'finalDate',
          name: '终验',
          value: 4,
        },
      ],
      statuTitle: '',
      dataTime: undefined,
      minTime: undefined,
      dialogShow: false,
      dialogData: {},
      statusType: 0,
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
      this.reqDetail();
    },
  },
  methods: {
    // 请求数据
    reqDetail() {
      const { row } = this.data;

      if (row && row.erpNumber) {
        getProjectProcessDetailsByErpNumber(row.erpNumber).then((res) => {
          if (res && res.code === '200') {
            this.form = {
              ...this.form,
              ...res.data,
            };
            this.handleMinTime(res.data);
            if (res.data.submitTime && !res.data.finalDate) {
              this.$parent.confirmShow = true;
            }
          }
        });
      }
    },
    // 操作最短时间
    handleMinTime(res) {
      if (res.finalDate && !res.dataMinDate) {
        this.minTime = res.finalDate;
      } else if (res.submitTime && !res.dataMinDate) {
        this.minTime = res.submitTime;
      } else if (res.preliminaryDate && !res.dataMinDate) {
        this.minTime = res.preliminaryDate;
      } else if (res.actualEndTime && !res.dataMinDate) {
        this.minTime = res.actualEndTime;
      } else if (res.actualStartTime && !res.dataMinDate) {
        this.minTime = res.actualStartTime;
      }
    },
    submitFormItem() {
      this.$refs.supplyFormItem.submitForm();
    },
    // 提交数据
    submitForm(val) {
      const { configType, row } = this.data;
      const param = {
        erpNumber: row.erpNumber,
        verdictAmount: this.form.verdictAmount,
        constructionNotCost: this.form.constructionNotCost,
        constructionCostTaxRate: this.form.constructionCostTaxRate,
        constructionMoney: this.form.constructionMoney,
        constructionTotal: this.form.constructionTotal,
        materialNotCost: this.form.materialNotCost,
        materialCostTaxRate: this.form.materialCostTaxRate,
        materialMoney: this.form.materialMoney,
        materialTotal: this.form.materialTotal,
        other: this.form.other,
        reductionRate: this.form.reductionRate,
        submitMoney: this.form.submitMoney,
        authorizeAmount: this.form.authorizeAmount,
        submit: this.form.submit,
        auditFee: this.form.auditFee,
        submitTime: this.form.submitTime,
      };
      const message = configType === 'add' ? '新增成功' : '修改成功';

      // 更新项目过程状态
      updateProjectProcessStatus(param).then((res) => {
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
    // 取消提交
    cancelForm() {
      this.form = {};
      this.$refs.supplyFormItem.cancelForm();
    },

    handleStatusActive(item, index) {
      if (this.form[item.id]) {
        return;
      }
      const preItem = this.statusList[index - 1];

      if (preItem && !this.form[preItem.id]) {
        return;
      }
      this.statuTitle = `未${item.name}时间`;
      this.dialogShow = true;
      this.dialogData = item;
      this.statusType = item.value;
    },
    // 提交预览
    confirmedit() {
      const form = {
        ...this.form,
        ...this.moneyForm,
      };

      if (Number(this.statusType) === 4) {
        this.dataTime = form.dataTime;
      }
      const comparisonTime = comparison(this.minTime, this.dataTime);

      if (!comparisonTime && this.minTime) {
        this.$notify({
          title: '失败',
          message: '当前输入时间不能小于当前过程最小时间',
          position: 'bottom-right',
        });

        return;
      }
      if (this.dataTime) {
        const { row } = this.data;

        let parames = {
          erpNumber: row.erpNumber,
          statusType: `${this.statusType}`,
          updateTime: this.dataTime,
        };

        if (Number(this.statusType) === 4) {
          const fileList = form.fileList[0];

          parames = {
            erpNumber: `${row.erpNumber}`,
            verdictAmount: `${form.verdictAmount}`,
            constructionNotCost: `${form.constructionNotCost}`,
            constructionCostTaxRate: `${form.constructionCostTaxRate}`,
            constructionMoney: `${form.constructionMoney}`,
            constructionTotal: `${form.constructionTotal}`,
            materialNotCost: `${form.materialNotCost}`,
            materialCostTaxRate: `${form.materialCostTaxRate}`,
            materialMoney: `${form.materialMoney}`,
            materialTotal: `${form.materialTotal}`,
            other: `${form.other}`,
            reductionRate: `${form.reductionRate}`,
            statusType: `${this.statusType}`,
            submitMoney: `${form.submitMoney}`,
            authorizeAmount: `${form.authorizeAmount}`,
            submit: Boolean(form.submit),
            submitTime: form.submitTime,
            auditFee: `${form.auditFee}`,
            updateTime: this.dataTime,
            fileCode: fileList.fileCode,
            fileName: fileList.fileName,
          };
        }
        // 更新项目过程状态
        updateProjectProcessStatus(parames).then((res) => {
          if (res && res.code === '200') {
            this.reqDetail();
          }
        });
      }
      this.canceledit();
    },
    // 取消预览
    canceledit() {
      this.dialogShow = false;
      this.dialogData = {};
      this.statusType = 0;
      this.dataTime = undefined;
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
  .statusList {
    float: left;
    margin: 10px;
    margin-right: 0;
    > div {
      display: inline-block;
      position: relative;
      margin-right: 5px;
      line-height: 18px;
      padding: 7px 7px 7px 31px;
      background: #efefef;
      zoom: 1;
      *display: inline;
      *padding-left: 17px;
      cursor: pointer;
      .iconfont {
        margin-right: 5px;
      }
      &.active {
        color: #fff;
        background: linear-gradient(135deg, #f7660d 0%, #f00a00 100%);
        cursor: auto;
        .iconfont {
          color: #fff;
        }
        &::after {
          border-left-color: #f00a00;
        }
      }
      &:first-child {
        -moz-border-radius: 4px 0 0 4px;
        -webkit-border-radius: 4px 0 0 4px;
        border-radius: 4px 0 0 4px;
        padding-left: 12px;
        &::before {
          border: 0;
        }
      }
      &:last-child {
        -moz-border-radius: 0 4px 4px 0;
        -webkit-border-radius: 0 4px 4px 0;
        border-radius: 0 4px 4px 0;
        margin-right: 0;
        &::after {
          border: 0;
        }
      }
      &::before {
        position: absolute;
        left: 0;
        top: 0;
        height: 0;
        width: 0;
        border-bottom: 17px inset transparent;
        border-left: 20px solid #fff;
        border-top: 17px inset transparent;
        content: '';
      }
      &::after {
        position: absolute;
        right: -20px;
        top: 0;
        height: 0;
        width: 0;
        border-bottom: 16px inset transparent;
        border-left: 20px solid #efefef;
        border-top: 17px inset transparent;
        content: '';
        z-index: 2;
      }
    }
  }
  .step-list {
    padding: 30px 0 30px 0;
    margin: 20px 0 0 10%;
  }

  .step-list li {
    float: left;
    position: relative;
    width: 20%;
    border-bottom: 3px solid #eee;
  }

  .step-list li .yuan {
    position: absolute;
    left: 0;
    top: -3px;
    display: block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #eee;
  }

  .step-list li.done {
    border-color: #f00a00;
  }

  .step-list li.done .yuan {
    background-color: #f00a00;
  }

  .step-list li .title {
    position: absolute;
    top: -42px;
    left: -25px;
    font-weight: bold;
  }

  .step-list li:last-child {
    border-color: transparent !important;
    width: 50px;
  }

  .step-list li.done .heartbit {
    position: absolute;
    top: -7px;
    left: -4px;
    height: 18px;
    width: 18px;
    z-index: 10;
    background: linear-gradient(135deg, #f7660d 0%, #f00a00 100%);
    border-radius: 70px;
    -moz-animation: heartbit 1.8s ease-out;
    -moz-animation-iteration-count: infinite;
    -o-animation: heartbit 1.8s ease-out;
    -o-animation-iteration-count: infinite;
    -webkit-animation: heartbit 1.8s ease-out;
    -webkit-animation-iteration-count: infinite;
    animation-iteration-count: infinite;
  }

  .step-list li .time {
    bottom: 9px;
    font-size: 12px;
    left: -53px;
    color: #292929;
    min-width: 130px;
  }
}
</style>
<style lang="less">
.projectApprovalManagemenDialog {
  .el-dialog__body {
    display: flex;
    justify-content: center;
    .el-date-editor {
      width: 100%;
    }
  }
}
</style>
