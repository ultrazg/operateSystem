<template>
  <div id="upload" :class="className">
    <!-- 文件上传 -->
    <div class="content-view">
      <el-upload
        class="upload-demo"
        ref="upload"
        :action="postUrl"
        :on-remove="remove"
        :on-success="success"
        :disabled="disabled"
        :on-error="error"
        :on-progress="progress"
        :on-change="change"
        :before-upload="beforeUpload"
        :accept="accept"
        :show-file-list="false"
        :auto-upload="false"
        :http-request="httpRequest"
        :file-list="fileLists"
        :multiple="multiple"
      >
        <slot name="center">
          <div class="flexRow uploadText">
            <span v-if="textShow">选择文件：</span>
            <el-button slot="trigger" size="small" type="primary" :disabled="disabled">选取文件</el-button>
            <ul v-if="fileLists && fileLists.length > 0 && showRowFileLists" class="flexRow fileLists">
              <li v-for="(uploadItem, uploadIndex) in fileLists" :key="uploadItem.code">
                <span class="name" @click.prevent.stop="() => clickUpload(uploadItem)">{{ uploadItem.fileName }}</span>
                <span
                  class="iconfont icon-shanchu"
                  @click.prevent.stop="() => removeUpload(uploadIndex)"
                  v-if="!disabled"
                ></span>
              </li>
            </ul>
          </div>
        </slot>
      </el-upload>
      <div class="Modeltable" v-if="tableShow">
        <el-table tooltip-effect="light" :data="fileList" stripe class="f-13 mt-10" style="width: 100%" border>
          <el-table-column prop="name" :align="colAlign" label="文件名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="size" :align="colAlign" label="大小" show-overflow-tooltip>
            <template slot-scope="scope"> {{ Math.round((scope.row.size / 1024) * 100) / 100 }}kb </template>
          </el-table-column>
          <el-table-column label="状态" :align="colAlign" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-if="scope.row.status == 'success'">
                <span v-if="scope.row.response.data.success" style="color: #67c23a">上传成功</span>
                <span v-else style="color: red"
                  >上传失败<br /><em class="f-12" style="color: #a5a5a5"
                    >({{ scope.row.response.data.resultMsg }})</em
                  ></span
                >
              </div>

              <span v-if="scope.row.status == 'error'" style="color: red">上传失败</span>
              <span v-if="scope.row.status == 'ready'">准备上传</span>
              <span v-if="scope.row.status == 'uploading'" style="border: 0" class="loading"
                ><em class="iconfont icon-jiazailoading-A mr-5 anim-rotate anim-loop el-anim"></em>上传中...</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="size" label="操作" :width="'100px'">
            <template slot-scope="scope">
              <flex>
                <el-button type="text" size="small" title="删除" @click.prevent.stop="handleDelete(scope)">
                  删除
                </el-button>
              </flex>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import Flex from '@/components/flex';
export default {
  name: 'uploadComponent',
  components: {
    Flex,
  },
  props: {
    // 上传文件类型  .jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF
    accept: {
      type: String,
      default: '',
    },
    // 上传地址
    postUrl: {
      type: String,
      default: '',
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    tableShow: {
      type: Boolean,
      default: true,
    },
    textShow: {
      type: Boolean,
      default: true,
    },
    className: {
      type: String,
      default: '',
    },
    fileLists: {
      type: Array,
      default() {
        return [];
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    showRowFileLists: {
      type: Boolean,
      default: false,
    },
    rowIndex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      fileList: [],
      colAlign: 'center',
    };
  },
  watch: {
    fileLists(newValue, oldValue) {
      this.fileList = newValue;
    },
  },
  methods: {
    submitUpload(index) {
      this.$refs.upload.submit();
      this.$emit('submit', {
        rowIndex: index,
      });
    },
    // 文件列表移除文件时的钩子
    remove(file, fileList) {
      this.$emit('remove', {
        file,
        fileList,
        rowIndex: this.rowIndex,
      });
    },
    // 文件上传成功时的钩子
    success(response, file, fileList) {
      this.$emit('success', {
        response,
        file,
        fileList,
        rowIndex: this.rowIndex,
      });
    },
    // 文件上传失败时的钩子
    error(err, file, fileList) {
      this.$emit('error', {
        err,
        file,
        fileList,
        rowIndex: this.rowIndex,
      });
    },
    // 文件上传时的钩子
    progress(event, file, fileList) {
      this.$emit('progress', {
        event,
        file,
        fileList,
        rowIndex: this.rowIndex,
      });
    },
    beforeUpload(file) {
      this.$emit('beforeUpload', {
        file,
        rowIndex: this.rowIndex,
      });
    },
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    change(file, fileList) {
      this.fileList = fileList;
      this.$emit('change', {
        file,
        fileList,
        rowIndex: this.rowIndex,
      });
    },
    removeUpload(index) {
      this.$emit('remove', index);
    },
    clickUpload(item) {
      this.$emit('click', item);
    },
    httpRequest() {
      this.$emit('httpRequest');
    },
    handleDelete(scope) {
      console.log(scope);
      this.$emit('change', {
        file: this.fileList[scope.index],
        fileList: this.fileList,
        rowIndex: this.rowIndex,
      });
      this.fileList.splice(scope.index, 1);
    },
  },
};
</script>

<style lang="less">
.content-view {
  margin-bottom: 0;
  .uploadText {
    align-items: center;
    .fileLists {
      li {
        margin-right: 15px;
        .name {
          margin-right: 20px;
        }
        .iconfont {
          font-size: 12px;
          cursor: pointer;
        }
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
