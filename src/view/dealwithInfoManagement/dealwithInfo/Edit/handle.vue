<template>
  <div id="base">
    <formItem
      ref="supplyFormItem"
      :layout="layout"
      :rules="formRules"
      :disabled="inputDisabled"
      :isEdit="isEdit"
      :form.sync="form"
      @submit="submitForm"
    />
    <!-- <formItem
      ref="cooperateItem"
      :layout="cooperateLayout"
      :disabled="true"
      :isEdit="false"
      :form.sync="cooperateForm"
    /> -->
    <businessOpportunityList
      ref="businessOpportunityList"
      :data="{
        ...data,
        row: {
          ...data.row,
          id: data.row.businessId,
        },
        configType: 'detail',
      }"
      v-if="data.row.businessCode === 't_business_opportunity'"
    />
    <projectApprovalManagement
      ref="projectApprovalManagement"
      :data="{
        ...data,
        row: {
          ...data.row,
          id: data.row.businessId,
        },
        configType: 'detail',
      }"
      v-if="data.row.businessCode === 't_project_approval'"
    />
    <hireFramework
      ref="hireFramework"
      :data="{
        ...data,
        row: {
          ...data.row,
          id: data.row.businessId,
        },
        configType: 'detail',
      }"
      v-if="data.row.businessCode === 't_hire_framework'"
    />
    <contractList
      ref="contractList"
      :data="{
        ...data,
        row: {
          ...data.row,
          id: data.row.businessId,
        },
        configType: 'detail',
      }"
      v-if="data.row.businessCode === 'cooperation_contract'"
    />
    <blueBillInfoAdd
      ref="blueBillInfoAdd"
      :data="{
        ...data,
        row: {
          ...data.row,
          id: data.row.businessId,
        },
        configType: 'detail',
      }"
      v-if="data.row.businessCode === 't_apply_invoice'"
    />
    <blueBillInfoAdd
      ref="blueBillInfoAdd"
      :data="{
        ...data,
        row: {
          ...data.row,
          id: data.row.businessId,
        },
        configType: 'redAdd',
      }"
      v-if="data.row.businessCode === 't_red_bule_relation'"
    />
    <qualificationWidthInfo
      ref="qualificationWidthInfo"
      :data="{
        ...data,
        row: {
          ...data.row,
          id: data.row.businessId,
        },
        configType: 'detail',
      }"
      v-if="data.row.businessCode === 't_qualification_batch_apply'"
    />
    <insteadBase
      ref="insteadBase"
      :data="{
        ...data,
        row: {
          ...data.row,
          id: data.row.businessId,
        },
        configType: 'detail',
      }"
      v-if="data.row.businessCode === 't_project_station'"
    />
    <selfBaseInfo
      ref="selfBaseInfo"
      :data="{
        ...data,
        row: {
          ...data.row,
          id: data.row.businessId,
        },
        configType: 'detail',
      }"
      v-if="data.row.businessCode === 't_project_ext_self'"
    />
    <cooperationFrameworkCompent
      ref="cooperationFrameworkCompent"
      :data="{
        ...data,
        row: {
          ...data.row,
          id: data.row.businessId,
        },
        configType: 'detail',
      }"
      v-if="data.row.businessCode === 't_cooperation_framework'"
    />
    <financeOuterManagement
      ref="financeOuterManagement"
      :data="{
        ...data,
        row: {
          ...data.row,
          id: data.row.businessId,
        },
        configType: 'detail',
      }"
      v-if="data.row.businessCode === 't_finance_outermanag_apply'"
    />
    <extensionManagement
      ref="extensionManagement"
      :data="{
        ...data,
        row: {
          ...data.row,
          id: data.row.businessId,
        },
        configType: 'detail',
      }"
      v-if="data.row.businessCode === 't_finance_delay'"
    />
    <writeOffManagement
      ref="writeOffManagement"
      :data="{
        ...data,
        row: {
          ...data.row,
          id: data.row.businessId,
        },
        configType: 'detail',
      }"
      v-if="data.row.businessCode === 't_finance_cancel'"
    />
    <distribution
      ref="distribution"
      :data="{
        ...data,
        row: {
          ...data.row,
          id: data.row.businessId,
        },
        configType: 'detail',
      }"
      v-if="data.row.businessCode === 't_cooperation_invoice_batch'"
    />
    <writeOff
      ref="writeOff"
      :data="{
        ...data,
        row: {
          ...data.row,
          id: data.row.businessId,
        },
        configType: 'detailWriteOff',
      }"
      v-if="data.row.businessCode === 't_write_off_invoice_batch'"
    />
    <prepaymentInfo
      ref="prepaymentInfo"
      :data="{
        ...data,
        row: {
          ...data.row,
          id: data.row.businessId,
        },
        configType: 'detail',
      }"
      v-if="data.row.businessCode === 't_advance_tax'"
    />
    <receivableEnter
      ref="receivableEnter"
      :data="{
        ...data,
        row: {
          ...data.row,
          id: data.row.businessId,
        },
        configType: 'detail',
      }"
      v-if="data.row.businessCode === 't_invoice_receivable_batch'"
    />
    <nextAuditPeople :show="peopleShow" :data="peopleData" @cancel="closeEdit" @success="successEdit" />
  </div>
</template>

<script>
import formItem from '@/components/formItem';
import nextAuditPeople from '@/view/common/nextAuditPeople';
import businessOpportunityList from '@/view/marketMiddleStage/businessOpportunityList/Edit/handle.vue';
import projectApprovalManagement from '@/view/marketMiddleStage/projectApprovalManagement/Edit/base.vue';
import hireFramework from '@/view/marketMiddleStage/hireFramework/Edit/base.vue';
import contractList from '@/view/marketMiddleStage/contractList/Edit/base.vue';
import blueBillInfoAdd from '@/view/invoiceManager/invoiceManagerList/Edit/blueBillInfoAdd.vue';
import qualificationWidthInfo from '@/view/qualificationManagement/qualificationInfo/Edit/dealWidthInfo.vue';
import insteadBase from '@/view/marketMiddleStage/projectApprovalManagement/Edit/insteadBase.vue';
import selfBaseInfo from '@/view/marketMiddleStage/projectApprovalManagement/Edit/selfBaseInfo.vue';
import cooperationFrameworkCompent from '@/view/marketMiddleStage/cooperationFramework/Edit/base.vue';
import financeOuterManagement from '@/view/outermanagement/financeOuterManagement/Edit/base.vue';
import extensionManagement from '@/view/outermanagement/extensionManagement/Edit/base.vue';
import writeOffManagement from '@/view/outermanagement/writeOffManagement/Edit/base.vue';
import distribution from '@/view/spliptInvoice/subpackageBatchManagement/Edit/base.vue';
import writeOff from '@/view/spliptInvoice/subpackageBatchManagement/Edit/handle.vue';
import prepaymentInfo from '@/view/prepaymentManagement/prepaymentInfo/Edit/base.vue';
import receivableEnter from '@/view/receivableManagement/receivableEnter/Edit/base.vue';
import { cooperationFramework, checkAudit, submitAudit } from '@/api/dealwithInfoManagement/index.js';
import { selectListByParentCode } from '@/api/common';
export default {
  name: 'baseInfo',
  components: {
    formItem,
    nextAuditPeople,
    businessOpportunityList,
    projectApprovalManagement,
    hireFramework,
    blueBillInfoAdd,
    contractList,
    qualificationWidthInfo,
    insteadBase,
    selfBaseInfo,
    cooperationFrameworkCompent,
    financeOuterManagement,
    extensionManagement,
    writeOffManagement,
    distribution,
    writeOff,
    prepaymentInfo,
    receivableEnter,
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
      form: {
        judgeResult: undefined,
        auditOpinion: undefined,
        nextAuditPeople: undefined,
      },
      layout: [
        {
          title: '处理信息',
          formItems: [
            {
              label: '处理结果',
              prop: 'judgeResult',
              inputType: 'select',
              span: 8,
              hide: false,
              options: this.common().judgeResult,
              onChange: (val) => {
                const options = this.common().judgeResult;
                const findItem = options.filter((option) => option.id === val);

                this.form = {
                  ...this.form,
                  judgeResult: findItem[0].id,
                  auditOpinion: findItem[0].name,
                };
                this.getCheckAudit();
              },
            },
            {
              label: '处理意见',
              prop: 'auditOpinion',
              inputType: 'input',
              maxlength: 200,
              hide: false,
              span: 8,
            },
            {
              label: '指定审核人',
              prop: 'nextAuditPeople',
              inputType: 'select',
              hide: true,
              span: 8,
              onFocus: (val) => {
                this.peopleData = {
                  ...this.data,
                  ...this.form,
                };
                this.peopleShow = true;
                console.log('onFocus', val);
              },
            },
            {
              label: '处理人',
              prop: 'auditPeople',
              hide: true,
              inputType: 'input',
              span: 12,
            },
            {
              label: '处理结果',
              prop: 'auditResult',
              hide: true,
              inputType: 'select',
              options: this.common().judgeResult,
              span: 12,
            },
            {
              label: '处理时间',
              prop: 'auditTime',
              hide: true,
              inputType: 'input',
              span: 12,
            },
            {
              label: '处理意见',
              prop: 'auditOpinion',
              hide: true,
              inputType: 'input',
              span: 12,
            },
          ],
        },
      ],
      formRules: {
        judgeResult: {
          required: true,
          message: '请选择处理结果',
          trigger: 'blur',
        },
        auditOpinion: {
          required: true,
          message: '请输入处理意见',
          trigger: 'blur',
        },
        nextAuditPeople: {
          required: false,
          message: '请选择指定审核人',
          trigger: 'blur',
        },
      },
      peopleShow: false,
      peopleData: {},
      selectTable: {},
    };
  },
  watch: {
    data: {
      immediate: true,
      handler(val) {
        if (val) {
          console.log('val', val);
          this.inputDisabled = val.configType === 'detail';
          this.isEdit = ['add', 'edit'].includes(val.configType);
          this.isAdd = ['add'].includes(val.configType);
          const { row } = this.data;

          this.form = {
            ...this.form,
            businessCode: row.businessCode, // 业务编码
            businessId: row.businessId, // 业务id
            currStatus: row.currAuditStatus, // 当前状态(业务)
            dealwithId: row.id,
          };
          if (!this.isEdit) {
            this.layout[0].formItems[0].hide = true;
            this.layout[0].formItems[1].hide = true;
            this.layout[0].formItems[3].hide = false;
            this.layout[0].formItems[4].hide = false;
            this.layout[0].formItems[5].hide = false;
            this.layout[0].formItems[6].hide = false;
            this.reqData();
          }
        }
      },
    },
  },
  methods: {
    async setCity(province) {
      this.form = {
        ...this.form,
        province,
        city: undefined,
      };
      const options = this.common().provincialCode;
      const findItem = options.filter((option) => option.id === province);

      if (findItem.length === 0) {
        return;
      }
      const city = await this.$getCode(findItem[0].id);

      console.log('city', city);
      this.$set(this.cooperateLayout[0].formItems[4], 'options', city);
    },
    reqData() {
      const { row } = this.data;

      this.form = {
        ...this.form,
        ...row,
      };
    },
    getCooperationFramework() {
      cooperationFramework(this.data.row.businessId).then((res) => {
        if (res && res.code === '200') {
          this.cooperateForm = {
            ...this.cooperateForm,
            ...res.data,
            city: [res.data.city],
          };
          if (Boolean(res.data.province)) {
            this.getSelectListByParentCode(res.data.province);
          }
        }
      });
    },
    getSelectListByParentCode(province) {
      selectListByParentCode(province).then((res) => {
        if (res && res.code === '200') {
          const cityOptions = res.data.map((item) => ({
            name: item.name,
            id: item.code,
          }));

          this.cooperateLayout[0].formItems[4].options = cityOptions;
        }
      });
    },
    getCheckAudit() {
      const parames = {
        ...this.form,
        auditOpinion: this.form.auditOpinion, // 意见
        judgeResult: this.form.judgeResult, // 1 同意 2不同意
        nextAuditPeople: '', // ""
      };

      console.log('parames', parames);
      checkAudit(parames).then((res) => {
        if (res && res.code === '200') {
          // “1”显示指定审核人
          if (res.data === '1') {
            this.layout[0].formItems[2].hide = false;
            this.formRules.nextAuditPeople.required = true;
          } else {
            this.layout[0].formItems[2].hide = true;
            this.formRules.nextAuditPeople.required = false;
          }
        }
      });
    },
    submitFormItem() {
      this.$refs.supplyFormItem.submitForm();
    },
    submitForm(val) {
      console.log('this.data', this.data);
      const { configType, row } = this.data;
      const param = {
        businessCode: this.data.row.businessCode,
        businessId: this.data.row.businessId,
        currStatus: this.data.row.currAuditStatus,
        dealwithId: this.data.row.id,
        judgeResult: this.form.judgeResult,
        auditOpinion: this.form.auditOpinion,
        nextAuditPeople: this.selectTable.username,
      };
      const message = '处理成功';

      submitAudit(param).then((res) => {
        if (res && res.code === '200') {
          this.$notify({
            title: '成功',
            message,
            type: 'success',
            position: 'bottom-right',
          });
          this.$emit('success');
        } else {
          this.$emit('success');
        }
      });
    },
    closeEdit() {
      this.peopleShow = false;
      this.peopleData = {};
    },
    successEdit(selectTable) {
      console.log('selectTable', selectTable);
      this.selectTable = selectTable;
      this.form = {
        ...this.form,
        nextAuditPeople: selectTable.username,
        nextAuditPeopleName: selectTable.realName,
      };
      // this.form.nextAuditPeople = selectTable.realName;
      this.closeEdit();
    },
    cancelForm() {
      this.form = {};
      this.cooperateForm = {};
      this.$refs.supplyFormItem.cancelForm();
    },
  },
};
</script>

<style lang="less" scoped>
#base {
}
</style>
