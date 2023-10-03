/* eslint-disable require-unicode-regexp */

const FormatValidate = () => {
  // console.log()
};

FormatValidate.form = () => ({
  checkIdNum: (rule, value, callback) => {
    if (!value) {
      return callback(new Error('身份证不能为空'));
    }
    // eslint-disable-next-line no-negated-condition, wrap-regex
    if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)) {
      callback(new Error('请输入正确身份证号码'));
    } else {
      callback();
    }
  },
});

export default FormatValidate;
