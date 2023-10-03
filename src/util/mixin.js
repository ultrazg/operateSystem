import store from '@/store';
import { mapGetters } from 'vuex';
// const mapOperation = store.state.meanOperation;

export default {
  beforeRouteUpdate(to, from, next) {
    this.getDataAllList && this.getDataAllList(); // tab刷新页面数据
    next();
  },
  computed: {
    ...mapGetters(['loadingCont']),
    routerCode() {
      return this.$route.meta.code
    },
    $_loading() {
      return this.loadingCont;
    },
  },
  methods: {
    // 验证规则 - 判断是否为空
    $_checkValidate(rule, value, callBack) {
      if (!value || !value.length) {
        this.$set(this.rulesTips, rule.fullField, true);

        return callBack(new Error(' '));
      }
      this.$set(this.rulesTips, rule.fullField, false);
      callBack();
    },
    // 重置表单数据
    $_resetForm() {
      this.$refs.searchModel && this.$refs.searchModel.resetFields(); // 搜索

      if (this.$refs.formData) {
        this.$refs.formData.resetFields(); // 内部表单
        this.$refs.formData.clearValidate(); //  内部表单重置验证信息
        // this.resetRulesTips() // 内部表单重置验证信息
      }
    },
    // 权限限制
    $_hasOperation(name, operation) {
      const mapOperation = store.state.meanOperation;
      const list = mapOperation[name];
      if (!list) {
        return false;
      }
      if (list.some((i) => i === operation)) {
        return true;
      }

      return false;
    },
    $_useTypes(values) {
      const labels = {};
      const types = {};
      const options = Object.keys(values).map((key) => {
        types[values[key]] = key;

        return {
          name: key,
          id: values[key],
          label: labels[key],
        };
      });

      return {
        values,
        labels,
        types,
        options,
      };
    },
    $_notifyError(values) {
      const arr = Object.keys(values);

      const errArray = [];

      for (let i = 0; i <= arr.length - 1; i++) {
        const item = arr[i];
        const error = values[item].rule;
        const { message } = values[item];

        if (error) {
          errArray.push(item);
          this.$notify.error({
            title: '失败',
            message: `请${message}!!!`,
            position: 'bottom-right',
          });

          return false;
        }
      }

      return errArray;
    },
  },
};
