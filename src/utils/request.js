import wepy from '@wepy/core'
import store from '@/store'

const host = 'http://larabbs.test/api/v1/'

// 普通请求
const request = async (url, options = {}, showLoading = true) => {
  if (showLoading) {
    wx.showLoading({title: '加载中'})
  }

  options.url = host + url

  let response = await wepy.wx.request(options)

  if (showLoading) {
    wx.hideLoading()
  }

  if (response.statusCode >= 200 && response.statusCode < 300) {
    return response
  }

  if (response.statusCode === 429) {
    wx.showModal({
      title: '提示',
      content: '请求太频繁，请稍后再试'
    })
  }

  if (response.statusCode === 500) {
    wx.showModal({
      title: '提示',
      content: '服务器错误，请联系管理员或重试'
    })
  }

  const error = new Error(response.data.message)
  error.response = response

  return Promise.reject(error)
}

const checkToken = async () => {
  const accessToken = store.getters.accessToken
  const expiredAt = store.getters.accessTokenExpiredAt

  if (accessToken && new Date().getTime() > expiredAt) {
    try {
      return store.dispatch('refresh')
    } catch (e) {
      return store.dispatch('login')
    }
  }
}

const authRequest = async (url, options = {}, showLoading = true) => {
  await checkToken()

  options.header = {
    Authorization: 'Bearer ' + store.getters.accessToken
  }

  return await request(url, options, showLoading)
}

const uploadFile = async (url, options = {}, showLoading = true) => {
  if (showLoading) {
    wx.showLoading({title: '上传中'})
  }

  options.url = host + url

  await checkToken()

  options.header = {
    Authorization: 'Bearer ' + store.getters.accessToken
  }

  const response = await wepy.wx.uploadFile(options)

  if (showLoading) {
    wx.hideLoading()
  }

  if (response.statusCode >= 200 && response.statusCode < 300) {
    return response
  }

  wx.showModal({
    title: '提示',
    content: '服务器错误，请联系管理员或重试'
  })

  const error = new Error(response.data.message)
  error.response = response

  return Promise.reject(error)
}

export {
  request,
  authRequest,
  uploadFile
}
