<template>
  <div id="base">
    <FormItem
      ref="supplyFormItem"
      :layout="layout"
      :rules="formRules"
      :disabled="inputDisabled"
      :isEdit="isEdit"
      :form.sync="form"
    />
    <wrapper title="单位资质信息">
      <page-table
        ref="pageTable"
        col-align="left"
        operator-width="90"
        :data="tableData"
        :cols="tableCols"
        :showPage="false"
      ></page-table>
    </wrapper>
  </div>
</template>

<script>
import FormItem from '@/components/formItem';
import Wrapper from '@/components/wrapper';
import PageTable from '@/components/page-table';
import { getCooperationUnitById } from '@/api/cooperationUnitManagement/index';

export default {
  name: 'baseInfo',
  components: {
    FormItem,
    Wrapper,
    PageTable,
  },
  props: {
    show: Boolean,
    data: {},
    unitBaseInfo: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const { configType } = this.data;

    return {
      /** 输入禁用 */
      inputDisabled: configType === 'detail',
      isEdit: ['add', 'edit'].includes(configType),
      isAdd: ['add'].includes(configType),
      form: {
        type: '单位',
      },
      layout: [
        {
          title: '合作单位基础数据',
          formItems: [
            {
              label: '单位名称',
              prop: 'name',
              inputType: 'input',
              span: 12,
            },
            {
              label: '识别码',
              prop: 'identificationCode',
              inputType: 'input',
              span: 12,
            },
            {
              label: '开户行',
              prop: 'bank',
              inputType: 'input',
              span: 12,
            },
            {
              label: '开户账号',
              prop: 'bankCode',
              inputType: 'input',
              span: 12,
            },
            {
              label: '注册资金',
              prop: 'registerCapital',
              inputType: 'input',
              span: 12,
            },
            {
              label: '法人',
              prop: 'legalPerson',
              inputType: 'input',
              span: 12,
            },
            {
              label: '合作级别',
              prop: 'level',
              inputType: 'select',
              span: 12,
              // options: this.common().cooperationLevelCode,
              // onChange: (val) => {
              //   this.form.level = val;
              // },
            },
            {
              label: '联系人',
              prop: 'contactsPeople',
              inputType: 'input',
              span: 12,
            },
            {
              label: '联系电话',
              prop: 'tel',
              inputType: 'input',
              span: 12,
            },
            {
              label: '注册地址',
              prop: 'registerAddress',
              inputType: 'input',
              span: 12,
            },
            {
              label: '办公地址',
              prop: 'officeAddress',
              inputType: 'input',
              span: 12,
            },
            {
              label: '备案人员数量',
              prop: 'userNumber',
              inputType: 'input',
              span: 12,
            },
            {
              label: '备注',
              prop: 'remark',
              inputType: 'input',
              span: 12,
            },
            {
              label: '合作方编码',
              prop: 'partnerCode',
              inputType: 'input',
              span: 12,
            },
          ],
        },
      ],

      tableData: [],
      tableCols: [
        {
          label: '资质类型',
          prop: 'type',
        },
        {
          label: '颁发机构',
          prop: 'qualificationsMechanism',
        },
        {
          label: '资质名称',
          prop: 'qualificationsName',
        },
        {
          label: '资质编码',
          prop: 'qualificationsCode',
        },
        {
          label: '开始时间',
          prop: 'sDate',
        },
        {
          label: '结束时间',
          prop: 'eDate',
        },
        {
          label: '附件名称',
          prop: 'fileName',
          width: '150px',
          render: (h, scope) => {
            const d = scope.row;
            // 获取网络协议
            const { protocol } = window.location;
            // 获取主机名+端口号
            const domainPort = window.location.host;
            const fileHref = `${`${protocol}//${domainPort}`}/${d.filePath}`;
            // test filepath
            // const fileHref = 'http://localhost:3000/api/fileupload/download?fileCode=de51f1f544464f9284a05bf535d53a66';

            return (
              <div>
                {
                  <el-link class="attachment" href={fileHref} target="_blank">
                    {d.fileName}
                  </el-link>
                }
              </div>
            );
          },
        },
      ],
      formRules: {
        name: {
          required: true,
          message: '请输入名称',
          trigger: 'blur',
        },
        identificationCode: {
          required: true,
          message: '请输入识别码',
          trigger: 'blur',
        },
        bank: {
          required: true,
          message: '请输入开户行',
          trigger: 'blur',
        },
        bankCode: {
          required: true,
          message: '请输入开户账号',
          trigger: 'blur',
        },
        legalPerson: {
          required: true,
          message: '请输入法人',
          trigger: 'blur',
        },
        level: {
          required: true,
          message: '请输入合作级别',
          trigger: 'blur',
        },
        registerCapital: {
          required: true,
          message: '请输入注册资金',
          trigger: 'blur',
        },
        registerAddress: {
          required: true,
          message: '请输入注册地址',
          trigger: 'blur',
        },
        officeAddress: {
          required: true,
          message: '请输入办公地址',
          trigger: 'blur',
        },
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
    reqDetail() {
      const { row } = this.data;

      console.log(row, row.name);

      if (row && row.id) {
        this.form = {
          ...this.form,
          ...row,
        };
      }
      let { id } = row;

      if (this.unitBaseInfo) {
        id = row.unitId;
      }

      // 获取单位详情
      getCooperationUnitById(id).then((res) => {
        console.log(res);
        if (res.code === '200') {
          const { cooperationQlicationDtoList } = res.data;

          this.tableData = [...cooperationQlicationDtoList];

          if (this.unitBaseInfo) {
            this.form = {
              ...res.data,
            };
          }
          console.log(this.form);
          // console.log(data, total);
          // this.tableData = data;
          // this.page.total = total;
        }
      });
    },
    submitFormItem() {
      this.$refs.supplyFormItem.submitForm();
      console.log('submit work');
    },

    // submitForm(val) {
    //   console.log('this.data', this.data);
    //   const { configType, row } = this.data;
    //   const id = configType === 'add' ? '' : this.form.id;
    //   const param = {
    //     // ...val,
    //     cityId: val.cityName instanceof Object ? val.cityName.id : this.form.cityId,
    //     cityName: val.cityName instanceof Object ? val.cityName.name : this.form.cityName,
    //     devClass: val.devClass instanceof Object ? val.devClass.name : this.form.devClass,
    //     devClassId: val.devClass instanceof Object ? val.devClass.id : this.form.devClassId,
    //     devIp: val.devIp,
    //     devName: val.devName,
    //     devType: val.devType instanceof Object ? val.devType.name : this.form.devType,
    //     devTypeId: val.devType instanceof Object ? val.devType.id : this.form.devTypeId,
    //     factoryId: val.factoryName instanceof Object ? val.factoryName.id : this.form.factoryId,
    //     factoryName: val.factoryName instanceof Object ? val.factoryName.name : this.form.factoryName,
    //     roomId: val.roomName instanceof Object ? val.roomName.id : this.form.roomId,
    //     roomName: val.roomName instanceof Object ? val.roomName.name : this.form.roomName,
    //   };
    //   const message = configType === 'add' ? '新增成功' : '修改成功';

    //   editDeviceInfo(param).then((res) => {
    //     if (res.code === '200') {
    //       this.$notify({
    //         title: '成功',
    //         message,
    //         type: 'success',
    //         position: 'bottom-right',
    //       });
    //       this.$emit('success');
    //     }
    //   });
    // },
    cancelForm() {
      this.form = {};
      this.$refs.supplyFormItem.cancelForm();
    },

    // 单元格点击 下载附件
    // downAttachment(row) {
    //   console.log(row);
    // },
  },
  created() {
    if (this.unitBaseInfo) {
      this.formRules = {};
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
    min-height: unset;
  }
}
</style>
