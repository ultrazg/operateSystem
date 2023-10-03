<template>
  <div class="confirm-payment">
    <el-form class="searchFrom" :label-position="'right'" :label-width="'100px'" :model="formData" ref="formRef">
      <el-row class="searchItem">
        <el-form-item label="付款日期：" prop="name">
          <el-date-picker
            v-model="formData.date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="请选择付款日期"
          ></el-date-picker>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { invoiceActualPaymentConfirm } from '@/api/financePay/invoiceActualPayment';
export default {
  name: 'confirmPayment',
  props: {
    data: {},
  },
  data() {
    return {
      formData: {
        date: '',
      },
    };
  },
  methods: {
    cancelForm() {
      this.formData.date = '';
    },
    submitFormItem() {
      const params = {
        id: this.data.row.id,
        paymentTime: this.formData.date,
      };

      invoiceActualPaymentConfirm(params).then((res) => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message: '确认成功',
            type: 'success',
            position: 'bottom-right',
          });
          this.$emit('success');
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.confirm-payment {
  height: 50px;
}
</style>
