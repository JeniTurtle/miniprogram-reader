const DATA_SOURCE_STORAGE_KEY = "dataSource";

const getStorage = (key) => {
  try {
    return wx.getStorageSync(key) || null;
  } catch (e) {
    return null;
  }
}

const setStorage = (key, data) => {
  wx.setStorageSync(key, data)
}

const getDataSource = () => {
  let dataSource = getStorage(DATA_SOURCE_STORAGE_KEY) || 'man';
  return dataSource == "man" ? "man" : 'lady';
}

const setDataSource = (val) => {
  return setStorage(DATA_SOURCE_STORAGE_KEY, val)
}

module.exports = {
  getStorage: getStorage,
  setStorage: setStorage,
  getDataSource: getDataSource,
  setDataSource: setDataSource
}