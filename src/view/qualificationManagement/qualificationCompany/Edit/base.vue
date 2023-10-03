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
      @change="change"
    />
  </div>
</template>

<script>
import FormItem from '@/components/formItem';
import { addcompany, updatecompany, detailcompany } from '@/api/qualificationManagement/qualificationCompany';

export default {
  name: 'baseInfo',
  components: {
    FormItem,
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
          title: '资质信息',
          formItems: [
            {
              label: '资质名称',
              prop: 'name',
              inputType: 'input',
              span: 12,
            },
            {
              label: '资质等级',
              prop: 'level',
              inputType: 'input',
              span: 12,
            },
            {
              label: '有效期',
              prop: 'validityDate',
              inputType: 'dataPicker',
              span: 12,
            },
            {
              label: '颁发机构',
              prop: 'issuingAuthority',
              inputType: 'input',
              span: 12,
            },
            {
              label: '预警提醒日期',
              prop: 'warningDate',
              inputType: 'dataPicker',
              span: 12,
            },
            {
              label: '上传附件',
              prop: 'files',
              disabled: false,
              placeholder: '支持pdf/.jpg/.png格式文件',
              limit: 5,
              accept: '.jpg, .png, .pdf, .jpeg',
              inputType: 'upload',
              params: {
                filePath: 'fileUpload',
                serviceCode: 'qualification',
              },
              span: 24,
            },
          ],
        },
      ],
      formRules: {
        name: {
          required: true,
          message: '请输入资质名称',
          trigger: 'blur',
        },
        validityDate: {
          required: true,
          message: '请输入有效期',
          trigger: 'blur',
        },
        issuingAuthority: {
          required: true,
          message: '请输入颁发机构',
          trigger: 'blur',
        },
        warningDate: {
          required: true,
          message: '请输入预警提醒日期',
          trigger: 'blur',
        },
        files: {
          required: true,
          message: '请上传附件',
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

      if (row && row.id) {
        detailcompany(row.id).then((res) => {
          if (res && res.code === '200') {
            this.form = {
              ...this.form,
              ...res.data,
            };
            if (res.data.files) {
              const formItem = this.layout[0].formItems[5];

              formItem.disabled = res.data.files.length >= formItem.limit;
              this.form = {
                ...this.form,
                files: res.data.files,
              };
            }
          }
        });
      }
    },
    change(form) {
      const fileList = form.files;
      const formItem = this.layout[0].formItems[5];

      if (fileList && fileList.length >= formItem.limit) {
        formItem.disabled = true;
      } else {
        formItem.disabled = false;
      }
    },
    submitFormItem() {
      this.$refs.supplyFormItem.submitForm();
    },
    submitForm(val) {
      console.log('val', val);
      const { configType, row } = this.data;

      const files = [];

      val.files.forEach((file) => {
        files.push({
          ...file,
          qualificationId: file.qualificationId,
          qualificationType: 0,
        });
      });
      const params = {
        ...val,
        files,
      };

      let message = '新增成功';

      let api = addcompany;

      if (configType === 'edit') {
        params.id = this.form.id;
        message = '修改成功';
        api = updatecompany;
      }

      api(params).then((res) => {
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
</style>
