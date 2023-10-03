<template>
  <div id="base">
    <!--商机信息详情  -->
    <FormItem
      ref="supplyFormItem"
      :layout="layout"
      :rules="formRules"
      :disabled="inputDisabled"
      :isEdit="isEdit"
      :form.sync="form"
      @submit="submitForm"
    />
  </div>
</template>

<script>
import FormItem from '@/components/formItem';
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
  },
  props: {
    show: Boolean,
    data: {},
  },
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
          title: '商机信息',
          formItems: [
            {
              label: '商机编号',
              prop: 'busiId',
              inputType: 'input',
              span: 12,
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
              inputType: 'input',
              span: 12,
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
            },
            {
              label: '二级专业',
              prop: 'twoMajor',
              inputType: 'select',
              span: 12,
            },
            {
              label: '采购形式',
              prop: 'purchaseModality',
              inputType: 'select',
              span: 12,
            },
            {
              label: '市场类型',
              prop: 'marketType',
              inputType: 'select',
              span: 12,
            },
            {
              label: '项目实施省份',
              prop: 'province',
              inputType: 'select',
              span: 12,
            },
            {
              label: '项目实施城市',
              prop: 'city',
              inputType: 'select',
              span: 12,
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
            },
            {
              label: '项目经理',
              prop: 'projectManager',
              inputType: 'input',
              span: 12,
            },
          ],
        },
        {
          title: '投标情况',
          formItems: [
            {
              label: '是否中标',
              prop: 'tenderWin',
              inputType: 'input',
              span: 12,
            },
            {
              label: '投标状态',
              prop: 'tenderState',
              inputType: 'select',
              span: 12,
            },
            {
              label: '中标份额(万元)',
              prop: 'tenderShare',
              inputType: 'input',
              span: 12,
            },
            {
              label: '预计合同额(万元)',
              prop: 'expertContract',
              inputType: 'input',
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
        // no: { required: true, message: "请输入公告名称", trigger: "blur" },
        // address: { required: true, message: "请输入公告号", trigger: "blur" },
        // buildArea: {
        //   required: true,
        //   message: "请选择公告类型",
        //   trigger: "blur",
        // },
      },
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
    // 请求数据
    reqDetail() {
      const { row } = this.data;

      if (row && row.id) {
        this.changeOther(row.tenderWin);
        this.form = {
          ...this.form,
          ...row,
        };
      }
    },

    changeOther(val) {
      this.layout[4].hide = val !== '';
    },
    submitFormItem() {
      this.$refs.supplyFormItem.submitForm();
    },
    // 提交表单
    submitForm(val) {
      console.log('this.data', this.data);
      // const { configType, row } = this.data;
      // const id = configType === 'add' ? '' : this.form.id;
      // const param = {
      //   // ...val,
      //   cityId: val.cityName instanceof Object ? val.cityName.id : this.form.cityId,
      //   cityName: val.cityName instanceof Object ? val.cityName.name : this.form.cityName,
      //   devClass: val.devClass instanceof Object ? val.devClass.name : this.form.devClass,
      //   devClassId: val.devClass instanceof Object ? val.devClass.id : this.form.devClassId,
      //   devIp: val.devIp,
      //   devName: val.devName,
      //   devType: val.devType instanceof Object ? val.devType.name : this.form.devType,
      //   devTypeId: val.devType instanceof Object ? val.devType.id : this.form.devTypeId,
      //   factoryId: val.factoryName instanceof Object ? val.factoryName.id : this.form.factoryId,
      //   factoryName: val.factoryName instanceof Object ? val.factoryName.name : this.form.factoryName,
      //   roomId: val.roomName instanceof Object ? val.roomName.id : this.form.roomId,
      //   roomName: val.roomName instanceof Object ? val.roomName.name : this.form.roomName,
      // };
      // const message = configType === 'add' ? '新增成功' : '修改成功';
    },
    // 取消提交
    cancelForm() {
      this.form = {};
      this.$refs.supplyFormItem.cancelForm();
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
