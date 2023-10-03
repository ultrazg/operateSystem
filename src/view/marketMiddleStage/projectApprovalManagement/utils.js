export const statusOptions = {
  待审核: 0,
  已发布: 1,
};

// 对比两个时间
export const comparison = (oldDate, newDate) => {
  const oDate1 = new Date(oldDate);

  const oDate2 = new Date(newDate);

  // 当前时间是否大于旧时间
  if (oDate2.getTime() > oDate1.getTime()) {
    return true;
  }

  return false;
};
// 计算审减率
export const reductionRate = (formParames, constructionTotal, materialTotal) => {
  const form = { ...formParames };
  // 审增减率

  let { submitMoney, other } = form;
  // 送审金额

  submitMoney = parseFloat(submitMoney || 0);
  // 其他

  other = parseFloat(other || 0);
  // 审定金额
  const verdictAmount = parseFloat(constructionTotal + materialTotal + other || 0);

  submitMoney = parseFloat(submitMoney || 0);
  // (送审金额-审定金额)/送审金额
  if (submitMoney === 0) {
    form.reductionRate = undefined;
  } else {
    form.reductionRate = `${(((submitMoney - verdictAmount) / submitMoney) * 100).toFixed(2)}%`;
  }
  console.log('form', form);

  return {
    ...formParames,
    ...form,
  };
};
// 计算审定金额
export const handleVerdictAmount = (formParames, constructionTotal, materialTotal) => {
  const form = { ...formParames };

  let { other } = form;

  other = parseFloat(other || 0);
  // 定案总额
  form.verdictAmount = parseFloat(constructionTotal + materialTotal + other || 0);

  return form;
};
// 计算结算金额
export const authorizeAmount = (formParames) => {
  const form = { ...formParames };

  let { verdictAmount, auditFee } = form;

  verdictAmount = parseFloat(verdictAmount || 0);
  auditFee = parseFloat(auditFee || 0);
  // 结算金额=定案金额-审计费
  form.authorizeAmount = (verdictAmount - auditFee).toFixed(2);

  return form;
};
