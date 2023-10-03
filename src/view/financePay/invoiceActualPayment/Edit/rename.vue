<template>
  <div class="rename">
    <el-form class="searchFrom" :label-position="'right'" :label-width="'100px'" :model="formData" ref="formRef">
      <el-row class="searchItem">
        <el-form-item label="付款报账单号：" prop="name">
          <el-input v-model="formData.name" placeholder="请输入付款报账单号"></el-input>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { updateBackFill } from '@/api/financePay/invoiceActualPayment';
export default {
  name: 'renameInfo',
  props: {
    data: {},
  },
  data() {
    return {
      formData: {
        name: '',
      },
    };
  },
  methods: {
    cancelForm() {
      this.formData.name = '';
    },
    submitFormItem() {
      const params = {
        id: this.data.row.id,
        paymentNumber: this.formData.name,
      };

      console.log(params);
      updateBackFill(params).then((res) => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message: '修改成功',
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
.rename {
  height: 50px;
}
</style>
