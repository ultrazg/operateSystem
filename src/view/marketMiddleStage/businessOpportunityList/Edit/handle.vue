<template>
  <div id="base">
    <!-- 商机信息新增 -->
    <FormItem
      ref="supplyFormItem"
      :layout="layout"
      :rules="formRules"
      :disabled="inputDisabled"
      :isEdit="isEdit"
      :form.sync="form"
      @submit="submitForm"
    />
    <nextAuditPeople :show="peopleShow" :data="peopleData" @cancel="closeEdit" @success="successEdit" />
    <tenderInfoSelect
      :show="tenderInfoSelectShow"
      :data="tenderInfoSelectData"
      @cancel="closetenderInfoSelect"
      @success="successtenderInfoSelect"
    />
  </div>
</template>

<script>
import FormItem from '@/components/formItem';
import nextAuditPeople from '@/view/common/nextAuditPeople';
import tenderInfoSelect from '@/view/common/tenderInfoSelect';
import { selectListByParentCode, twoMajor } from '@/api/common';
import {
  getBusinessOpportunityById,
  editBusinessOpportunity,
  addBusinessOpportunity,
} from '@/api/marketMiddleStage/businessOpportunityList';
// import {
//   editDeviceInfo,
//   getFactorySelect,
//   roomSelectByCommand,
//   getDevModelSelect,
//   getDevTypeSelect
// } from "@/api/plan_center";

export default {
  name: 'baseInfo',
  components: {
    FormItem,
    nextAuditPeople,
    tenderInfoSelect,
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
        projectManager: undefined,
      },
      layout: [
        {
          title: '商机信息',
          formItems: [
            {
              label: '商机编号',
              prop: 'busiId',
              inputType: 'input',
              span: 12,
              disabled: true,
            },
            {
              label: '商机(项目)名称',
              prop: 'busiName',
              inputType: 'input',
              span: 12,
            },
            {
              label: '商机获取日期',
              prop: 'busiDate',
              inputType: 'date',
              span: 12,
            },
            {
              label: '商机来源',
              prop: 'busiResource',
              inputType: 'select',
              span: 12,
              options: this.common().busiResourceCode,
              onChange: (val) => {
                this.form.busiResource = val;
              },
            },
            {
              label: '客户名称',
              prop: 'custName',
              inputType: 'input',
              span: 12,
            },
            {
              label: '投标时间',
              prop: 'tenderDate',
              inputType: 'date',
              span: 12,
            },
            {
              label: '一级专业',
              prop: 'oneMajor',
              inputType: 'select',
              span: 12,
              options: this.common().majorCode,
              onChange: (val) => {
                this.form.oneMajor = val;
                this.form.twoMajor = '';
                this.getTwoMajorInfo(val);
              },
            },
            {
              label: '二级专业',
              prop: 'twoMajor',
              inputType: 'select',
              span: 12,
              options: [],
              onChange: (val) => {
                this.form.twoMajor = val;
              },
            },
            {
              label: '采购形式',
              prop: 'purchaseModality',
              inputType: 'select',
              span: 12,
              options: this.common().purchaseModality,
              onChange: (val) => {
                this.form.purchaseModality = val;
              },
            },
            {
              label: '市场类型',
              prop: 'marketType',
              inputType: 'select',
              span: 12,
              options: this.common().marketType,
              onChange: (val) => {
                this.form.marketType = val;
              },
            },
            {
              label: '项目实施省份',
              prop: 'province',
              inputType: 'select',
              span: 12,
              options: this.common().provincialCode,
              onChange: (val) => {
                this.form.province = val;
                this.form.city = '';
                this.getCityInfo(val);
              },
            },
            {
              label: '项目实施城市',
              prop: 'city',
              inputType: 'select',
              multiple: true,
              span: 12,
              options: [],
              onChange: (val) => {
                this.form.city = val;
              },
            },
            {
              label: '项目规模(万元)',
              prop: 'projectScale',
              inputType: 'input',
              span: 12,
            },
          ],
        },
        {
          title: '商机评估',
          formItems: [
            {
              label: '拟投规模(万元)',
              prop: 'planScale',
              inputType: 'input',
              span: 12,
            },
            {
              label: '商机类别',
              prop: 'opportunityCategory',
              inputType: 'select',
              span: 12,
              options: this.common().opportunityCategory,
              onChange: (val) => {
                this.form.opportunityCategory = val;
              },
            },
            {
              label: '预估毛利润率',
              prop: 'grossProfitRate',
              min: 0,
              max: 100,
              precision: 1,
              inputType: 'inputNumber',
              class: 'grossProfitRate',
              appendStr: '%',
              span: 12,
            },
            {
              label: '拓展类型',
              prop: 'expandType',
              inputType: 'select',
              span: 12,
              options: this.common().expandType,
              onChange: (val) => {
                this.form.expandType = val;
              },
            },
          ],
        },
        {
          title: '归属团队',
          formItems: [
            {
              label: '所属生产中心',
              prop: 'productionCenter',
              inputType: 'select',
              span: 12,
              options: this.common().productionCenterCode,
              onChange: (val) => {
                this.form.productionCenter = val;
              },
            },
            {
              label: '项目经理',
              prop: 'projectManager',
              inputType: 'select',
              span: 12,
              onFocus: (val) => {
                this.peopleData = {
                  ...this.data,
                  ...this.form,
                  reqData: {
                    dept: this.$store.state.user.adminUserDto.department,
                  },
                };
                this.peopleShow = true;
              },
            },
          ],
        },
        {
          title: '投标情况',
          formItems: [
            {
              label: '是否中标',
              prop: 'tenderWin',
              inputType: 'select',
              span: 12,
              options: this.common().tenderWin,
              onChange: (val) => {
                this.form.tenderWin = val;
                const item = this.common().tenderWin.filter((data) => data.id === val);

                if (item && item[0]) {
                  this.changeOther(item[0].name);
                }
              },
            },
            {
              label: '投标申请编号',
              prop: 'tenderApplyId',
              hide: true,
              inputType: 'select',
              span: 12,
              onFocus: (val) => {
                this.tenderInfoSelectData = {
                  ...this.data,
                  ...this.form,
                };
                this.tenderInfoSelectShow = true;
              },
            },
            {
              label: '投标状态',
              prop: 'tenderResult',
              inputType: 'select',
              span: 12,
              hide: true,
              disabled: true,
              options: this.common().tenderResult,
            },
            {
              label: '预计合同额(万元)',
              prop: 'predictAmount',
              inputType: 'input',
              disabled: true,
              hide: true,
              span: 12,
            },
          ],
        },
        {
          title: '其他',
          hide: true,
          formItems: [
            {
              label: '复盘',
              prop: 'replay',
              inputType: 'input',
              span: 12,
            },
            {
              label: '备注',
              prop: 'remark',
              inputType: 'input',
              span: 12,
            },
          ],
        },
      ],
      formRules: {
        busiName: {
          required: true,
          message: '请输入商机(项目)名称',
          trigger: 'blur',
        },
        busiDate: {
          required: true,
          message: '请选择商机获取日期',
          trigger: 'change',
        },
        busiResource: {
          required: true,
          message: '请选择商机来源',
          trigger: 'change',
        },
        custName: {
          required: true,
          message: '请输入客户名称',
          trigger: 'blur',
        },
        tenderDate: {
          required: true,
          message: '请选择投标时间',
          trigger: 'change',
        },
        oneMajor: {
          required: true,
          message: '请选择一级专业',
          trigger: 'change',
        },
        twoMajor: {
          required: true,
          message: '请选择二级专业',
          trigger: 'change',
        },
        purchaseModality: {
          required: true,
          message: '请选择采购形式',
          trigger: 'change',
        },
        marketType: {
          required: true,
          message: '请选择市场类型',
          trigger: 'change',
        },
        province: {
          required: true,
          message: '请选择项目实施省份',
          trigger: 'change',
        },
        city: {
          required: true,
          message: '请选择项目实施城市',
          trigger: 'change',
        },
        projectScale: {
          required: true,
          message: '请输入项目规模(万元)',
          trigger: 'blur',
        },
        planScale: {
          required: true,
          message: '请输入拟投规模(万元)',
          trigger: 'blur',
        },
        opportunityCategory: {
          required: true,
          message: '请选择商机类别',
          trigger: 'change',
        },
        expandType: {
          required: true,
          message: '请选择拓展类型',
          trigger: 'change',
        },
        grossProfitRate: {
          required: true,
          message: '请输入预估毛利润率',
          trigger: 'blur',
        },
        productionCenter: {
          required: true,
          message: '请选择所属生产中心',
          trigger: 'change',
        },
        projectManager: {
          required: true,
          message: '请选择项目经理',
          trigger: 'change',
        },
        replay: {
          required: false,
          message: '请输入复盘',
          trigger: 'blur',
        },
        tenderApplyId: {
          required: false,
          message: '请选择投标申请编号',
          trigger: 'blur',
        },
      },
      peopleShow: false,
      peopleData: {},
      selectTable: {},
      backUpForm: {},
      tenderInfoSelectTable: {},
      tenderInfoSelectData: {},
      tenderInfoSelectShow: false,
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
    // 请求数据列表
    reqDetail() {
      const { row } = this.data;

      if (row && row.id) {
        getBusinessOpportunityById(row.id).then((res) => {
          if (res && res.code === '200') {
            const item = this.common().tenderWin.filter((data) => data.id === res.data.tenderWin);

            if (item && item[0]) {
              this.changeOther(item[0].name);
            }
            this.form = {
              ...this.form,
              ...res.data,
              city: res.data.city.split(','),
            };
            const findItem = this.common().provincialCode.filter((option) => option.id === this.form.province);

            if (findItem && findItem[0] && findItem[0].id) {
              const province = findItem[0].id;

              this.form.province = province;
              this.getCityInfo(province, true, this.form, true);
            }

            const majorItem = this.common().majorCode.filter((option) => option.id === this.form.oneMajor);

            if (majorItem && majorItem[0] && majorItem[0].id) {
              const major = majorItem[0].id;

              this.form.oneMajor = major;
              this.getTwoMajorInfo(major, true, this.form, true);
            }

            this.getSelectId(this.form, 'productionCenterCode', 'productionCenter');
            this.getSelectId(this.form, 'busiResourceCode', 'busiResource');
            this.getSelectId(this.form, 'tenderWin', 'tenderWin');
            this.getSelectId(this.form, 'expandType', 'expandType');
            this.getSelectId(this.form, 'opportunityCategory', 'opportunityCategory');
            this.getSelectId(this.form, 'marketType', 'marketType');
            this.getSelectId(this.form, 'purchaseModality', 'purchaseModality');
            this.getSelectId(this.form, 'tenderStateInfo', 'tenderState');

            this.backUpForm = { ...this.form };
          }
        });
      }
    },

    changeOther(val) {
      const check = val === '是' || val === '否';

      this.layout[3].formItems[1].hide = !check;
      this.layout[3].formItems[2].hide = !check;
      this.layout[3].formItems[3].hide = !check;
      this.formRules.tenderApplyId.required = check;

      this.layout[4].hide = !check;
      this.formRules.replay.required = check;
    },
    submitFormItem() {
      this.$refs.supplyFormItem.submitForm();
    },
    // 提交表单
    submitForm(val) {
      const { configType, row } = this.data;
      const id = configType === 'add' ? '' : this.form.id;
      const param = {
        busiDate: val.busiDate,
        busiId: val.busiId,
        busiName: val.busiName,
        busiResource: val.busiResource,
        city: val.city.join(','),
        custName: val.custName,
        expandType: val.expandType,
        grossProfitRate: val.grossProfitRate,
        id,
        managerName: val.managerName,
        marketType: val.marketType,
        oneMajor: val.oneMajor,
        opportunityCategory: val.opportunityCategory,
        planScale: val.planScale,
        productionCenter: val.productionCenter,
        projectManager: this.selectTable.realName || val.projectManager,
        projectScale: val.projectScale,
        province: val.province,
        purchaseModality: val.purchaseModality,
        remark: val.remark,
        replay: val.replay,
        tenderDate: val.tenderDate,
        tenderShare: val.tenderShare,
        tenderWin: val.tenderWin,
        twoMajor: val.twoMajor,
        tenderApplyId: val.tenderApplyId,
        tenderResult: val.tenderResult,
        expertContract: val.expertContract,
      };

      // 编辑的时候且审核状态为审核通过
      if (configType === 'edit' && row.status === 'verify_pass') {
        const hasFormChange = this.contrastForm(this.form, this.backUpForm);

        if (hasFormChange) {
          param.beDraft = 1; // 审核通过转为草稿
        } else {
          this.$emit('success');

          return;
        }
      }

      const message = configType === 'add' ? '新增成功' : '修改成功';
      const api = configType === 'add' ? addBusinessOpportunity : editBusinessOpportunity;

      api(param).then((res) => {
        if (res.code === '200') {
          // 成功返回数据
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
    // 获取城市信息
    getCityInfo(province, initValue = false, row = {}, isFirst = false) {
      selectListByParentCode(province).then((res) => {
        if (res && res.code === '200') {
          const city = res.data.map((item) => ({
            name: item.name,
            id: item.code,
          }));

          if (initValue) {
            const item = city.filter((option) => option.id === row.city);

            if (item && item[0]) {
              this.form.city = item[0].id;
              if (isFirst) {
                this.backUpForm.city = item[0].id; // 记录刚进来时的city
              }
            }
          }
          this.$set(this.layout[0].formItems[11], 'options', city);
        }
      });
    },
    getTwoMajorInfo(major, initValue = false, row = {}, isFirst = false) {
      twoMajor(major).then((res) => {
        if (res && res.code === '200') {
          const majorInfo = res.data.map((item) => ({
            name: item.name,
            id: item.code,
          }));

          if (initValue) {
            const item = majorInfo.filter((option) => option.id === row.twoMajor);

            if (item) {
              this.form.twoMajor = item[0].id;
              if (isFirst) {
                this.backUpForm.twoMajor = item[0].id; // 记录刚进来时的twoMajor
              }
            }
          }
          this.$set(this.layout[0].formItems[7], 'options', majorInfo);
        }
      });
    },
    // 获取选择的数据
    getSelectId(row, commonKey, key) {
      const item = this.common()[commonKey].filter((option) => option.name.includes(row[key]));

      if (item && item.length) {
        this.form[key] = item[0].id;
      }
    },
    // 关闭预览
    closeEdit() {
      this.peopleShow = false;
      this.peopleData = {};
    },
    // 成功获取数据
    successEdit(selectTable) {
      this.selectTable = selectTable;
      this.form = {
        ...this.form,
        projectManager: selectTable.realName,
      };
      // this.form.projectManager = selectTable.realName;
      this.closeEdit();
    },
    /**
     * 对比表单数据，是否存在某项已修改
     * @param newVal {Object}
     * @param oldVal {Object}
     */
    contrastForm(newVal, oldVal) {
      const newForm = this.handleTypeConversion(newVal);
      const oldForm = this.handleTypeConversion(oldVal);

      return JSON.stringify(newForm) !== JSON.stringify(oldForm);
    },

    // 将表单的数字类型数据转成字符串
    handleTypeConversion(form) {
      const keyList = Object.keys(form);

      const newForm = {};

      keyList.forEach((key) => {
        newForm[key] = Number.isFinite(form[key]) ? String(form[key]) : form[key];
      });

      return newForm;
    },
    // 关闭投标申请编号
    closetenderInfoSelect() {
      this.tenderInfoSelectShow = false;
      this.tenderInfoSelectData = {};
    },
    // 投标申请编号成功
    successtenderInfoSelect(selectTable) {
      this.tenderInfoSelectTable = selectTable;
      this.form = {
        ...this.form,
        tenderApplyId: selectTable.tenderApplyId,
        tenderResult: selectTable.tenderResult,
        expertContract: selectTable.predictAmount,
      };
      this.closeopportunitySelection();
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
  /deep/.grossProfitRate {
    + .append {
      position: absolute;
      top: 4px;
      right: 0;
      bottom: 3px;
      background-color: #f5f7fa;
      color: #909399;
      vertical-align: middle;
      display: table-cell;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      padding: 0 20px;
      white-space: nowrap;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
}
</style>
