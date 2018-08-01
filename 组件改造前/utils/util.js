const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

var getBiggerzIndex = (function () {
  //定义弹出层ui的最小zIndex
  let index = 2000;
  return function (level = 0) {
    return level + (++index);
  };
})();

module.exports = {
  formatTime: formatTime,
  getBiggerzIndex: getBiggerzIndex
}
