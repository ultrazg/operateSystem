<template>
  <div id="base">
    <!-- 导入 -->
    <div class="upload">
      <span>选择文件：</span>
      <el-upload
        class="upload-demo"
        ref="upload"
        action="/api/excelImport/importFile"
        :show-file-list="false"
        :auto-upload="false"
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
            <!--操作-删除  -->
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
    data: {},
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
  mounted() {
    // this.$nextTick(() => {
    // });
  },
  methods: {
    submitFormItem() {
      this.submitForm();
    },
    // 提交数据
    submitForm() {
      this.$refs.upload.submit();
    },
    cancelForm() {
      // this.form = {};
      // this.$refs.supplyFormItem.cancelForm();
    },

    handleChange(file, fileList) {
      console.log(file, fileList);
      if (file.status === 'ready') {
        // 文件状态为ready
        const params = {
          name: file.name,
          size: `${(file.size / 1014).toFixed(1)}kb`,
          status: '等待上传',
        };

        this.tableData.push(params);
      }
      if (file.status === 'success') {
        // 文件状态为成功
        this.$notify({
          title: '成功',
          message: '导入成功',
          type: 'success',
          position: 'bottom-right',
        });
        this.$emit('success');
      }
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
