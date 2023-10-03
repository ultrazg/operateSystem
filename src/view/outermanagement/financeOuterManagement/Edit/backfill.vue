<template>
  <div id="backfill">
    <FormItem
      ref="supplyFormItem"
      :layout="layout"
      :rules="formRules"
      :disabled="inputDisabled"
      :isEdit="isEdit"
      :form.sync="form"
      @submit="submitForm"
    >
    </FormItem>
  </div>
</template>

<script>
import FormItem from '@/components/formItem';
import { backFillOutermanag } from '@/api/outermanagement/financeOuterManagement';

export default {
  name: 'backfillInfo',
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
          title: '外经证回填信息',
          formItems: [
            {
              label: '外经证编码',
              prop: 'outerCode',
              inputType: 'input',
              hide: false,
              span: 12,
            },
            {
              label: '外经证附件',
              prop: 'fileList',
              placeholder: '支持pdf/.jpg/.png格式文件',
              limit: 5,
              accept: '.jpg, .png, .pdf, .jpeg',
              inputType: 'upload',
              span: 12,
              params: {
                filePath: 'fileUpload',
                serviceCode: 'back_fill',
              },
            },
            {
              label: '有效期起',
              prop: 'startTime',
              inputType: 'dataPicker',
              span: 12,
            },
            {
              label: '有效期止',
              prop: 'endTime',
              inputType: 'dataPicker',
              span: 12,
            },
          ],
        },
      ],
      formRules: {
        outerCode: {
          required: true,
          message: '请输入外经证编码',
          trigger: 'blur',
        },
        fileList: {
          required: true,
          message: '请选择外经证附件',
          trigger: 'blur',
        },
        startTime: {
          required: true,
          message: '请选择有效期起',
          trigger: 'blur',
        },
        endTime: {
          required: true,
          message: '请选择有效期止',
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
      console.log('val', val);
      this.initStatus(val);
    },
  },
  methods: {
    initStatus(val) {
      this.isEdit = ['add', 'edit'].includes(val.configType);
      this.isAdd = ['add'].includes(val.configType);
      if (!this.isAdd) {
        this.reqDetail();
      }
    },
    reqDetail() {
      const { row } = this.data;

      if (row && row.id) {
        this.form = {
          ...this.form,
          ...row,
        };
      }
    },
    submitFormItem() {
      this.$refs.supplyFormItem.submitForm();
    },
    submitForm(val) {
      console.log('this.data', this.data, val);
      const { configType, row } = this.data;
      const id = configType === 'add' ? '' : this.form.id;
      const param = {
        ...val,
        id,
        fileList: val.fileList,
      };

      const message = '回填成功';

      backFillOutermanag(param).then((res) => {
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
    // 用户数据选择翻页记忆
    getRowKey(row) {
      return row.id;
    },
  },
  created() {
    this.initStatus(this.data);
  },
};
</script>

<style lang="less" scoped>
#base {
  #PageTable {
    min-height: auto;
    /deep/.el-table__row {
      .el-date-editor.el-input {
        width: 100%;
      }
    }
  }
  .comp-wrapper {
    #otherBtnList {
      margin-bottom: 10px;
    }
  }
  .receiptFrom {
    width: 100%;
  }
  #upload {
    /deep/.content-view {
      margin-bottom: 0;
    }
  }
}
</style>
