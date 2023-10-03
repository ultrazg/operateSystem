<template>
  <div id="base">
    <div class="upload">
      <span>选择文件：</span>
      <el-upload
        class="upload-demo"
        ref="upload"
        :action="action"
        :data="{ filePath: filePath, serviceCode: serviceCode }"
        :show-file-list="false"
        :multiple="false"
        :on-change="handleChange"
      >
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      </el-upload>
    </div>
    <div class="Modeltable">
      <page-table
        ref="pageTable"
        col-align="left"
        operator-width="110"
        :data="tableData"
        :cols="tableCols"
        :hideDefaultIndex="true"
        :selection="false"
        :showPage="false"
        :operator="true"
        reserveSelection
      >
        <template slot-scope="scope" slot="operator">
          <flex>
            <el-button
              type="text"
              size="small"
              title="删除"
              icon="iconfont icon-shanchu"
              @click.prevent.stop="handleDelete(scope)"
            >
              删除
            </el-button>
          </flex>
        </template>
      </page-table>
    </div>
  </div>
</template>

<script>
import PageTable from '@/components/page-table';
import Flex from '@/components/flex';
export default {
  name: 'importInfo',
  components: {
    PageTable,
    Flex,
  },
  props: {
    show: Boolean,
    data: [],
    action: {
      type: String,
      default: '/api/fileupload/upload',
    },
  },
  inject: ['common'],
  data() {
    // const { configType } = this.data;

    return {
      filePath: 'uploadFile//qlication',
      serviceCode: 'qlication',
      page: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      tableData: [],
      tableCols: [
        {
          label: '文件名',
          prop: 'name',
          align: 'center',
        },
        {
          label: '大小',
          prop: 'size',
          align: 'center',
        },
        {
          label: '状态',
          prop: 'status',
          align: 'center',
        },
      ],
    };
  },
  watch: {
    data: {
      deep: true,
      immediate: true,
      handler(val) {
        console.log('import', val);
        if (val) {
          this.tableData = val;
        }
      },
    },
  },
  mounted() {
    // this.$nextTick(() => {});
  },
  methods: {
    submitFormItem() {
      this.submitForm();
    },
    submitForm() {
      this.$refs.upload.submit();
    },
    cancelForm() {
      // this.form = {};
      // this.$refs.supplyFormItem.cancelForm();
    },
    handleChange(file, fileList) {
      console.log(file, fileList, file.status);
      if (file.status === 'ready') {
        const params = {
          name: file.name,
          size: `${(file.size / 1014).toFixed(1)}kb`,
          status: '等待上传',
          uid: file.uid,
        };

        this.tableData.push(params);
        // debugger;
      }
      if (file.status === 'success') {
        const fileIndex = this.tableData.findIndex((data) => data.uid === file.uid);

        this.tableData[fileIndex] = {
          ...this.tableData[fileIndex],
          status: '上传成功',
        };
        this.tableData.splice(1, 0);
        this.$notify({
          title: '成功',
          message: '导入成功',
          type: 'success',
          position: 'bottom-right',
        });

        // this.$emit('success');
        const { response } = file;
        const fileData = {
          size: `${(file.size / 1014).toFixed(1)}kb`,
          uid: file.uid,
          fileName: response.data.split(':')[0],
          fileCode: response.data.split(':')[1],
        };

        this.$emit('sendFileData', fileData);
      }
    },
    handleDelete(scope) {
      console.log(scope);
      this.tableData.splice(scope.index, 1);
      this.$emit('sendFileData', {
        size: '',
        uid: '',
        fileCode: '',
        fileName: '',
      });
    },
    // handleSuccess(res, file) {
    //   console.log(res, file);
    // },
  },
};
</script>

<style scoped lang="less">
.upload {
  display: flex;
  align-items: center;
  margin-bottom: 18px;

  .comp-page-table {
    min-height: unset;
  }
}
</style>
