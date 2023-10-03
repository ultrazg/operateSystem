<template>
  <div id="base">
    <upload
      ref="upload"
      postUrl="#"
      :fileLists="uploadFileList"
      :multiple="true"
      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      @change="uploadChange"
      @remove="uploadRemove"
      @submit="uploadSubmit"
      @beforeUpload="beforeUpload"
    ></upload>
  </div>
</template>

<script>
import upload from '@/components/upload/upload';
import { importFile } from '@/api/user';
export default {
  name: 'importInfo',
  components: {
    upload,
  },
  props: {
    show: Boolean,
    data: {},
    api: {
      type: Function,
      default: importFile,
    },
  },
  inject: ['common'],
  data() {
    const { configType } = this.data;

    return {
      page: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      uploadFileList: [],
    };
  },
  mounted() {
    // this.$nextTick(() => {
    // });
  },
  methods: {
    submitFormItem() {
      this.uploadSubmit();
    },
    // submitForm() {
    // this.$refs.upload.submit();
    // this.uploadSubmit();
    // },
    cancelForm() {
      // this.form = {};
      // this.$refs.supplyFormItem.cancelForm();
    },
    handleChange(file, fileList) {
      console.log(file, fileList);
      if (file.status === 'ready') {
        const params = {
          name: file.name,
          size: `${(file.size / 1014).toFixed(1)}kb`,
          status: '等待上传',
        };

        this.tableData.push(params);
      }
      if (file.status === 'success' && file.response.code === '200') {
        this.$notify({
          title: '成功',
          message: '上传成功',
          type: 'success',
          position: 'bottom-right',
        });
        this.$emit('success');
      }
      // else {
      //   this.$notify({
      //     title: '失败',
      //     message: '上传失败',
      //     type: 'error',
      //     position: 'bottom-right',
      //   });
      // }
    },
    uploadChange(file) {
      this.uploadFileList = file.fileList;
    },
    uploadRemove(file) {
      this.uploadFileList = file.fileList;
    },
    beforeUpload(file) {
      console.log('file', file);

      return this;
    },
    uploadSubmit() {
      if (this.uploadFileList.length === 0) {
        this.$notifyError('请先选择上传文件!!!');

        return;
      }
      const wfForm = new FormData();

      this.uploadFileList.forEach((file) => {
        wfForm.append('file', file.raw);
      });
      this.api(wfForm).then((res) => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message: '文件上传成功',
            type: 'success',
            position: 'bottom-right',
          });
          this.uploadFileList = [];
          this.$emit('success');
        } else {
          this.$notifyError(res.message);

          return false;
        }
      });
    },
    handleDelete(scope) {
      console.log(scope);
      this.tableData.splice(scope.index, 1);
    },
  },
};
</script>

<style scoped lang="less">
.upload {
  display: flex;
  align-items: center;
  margin-bottom: 18px;
}
</style>
