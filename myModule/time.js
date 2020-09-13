function getNowDateTime() {
  let dateTime = new Date();
  let formStrTime = `${dateTime.getFullYear()}-${dateTime.getMonth() + 1}-${dateTime.getDate()} ${dateTime.getHours()}:${dateTime.getMinutes()}`;
  return formStrTime;
}



module.exports = {getNowDateTime};