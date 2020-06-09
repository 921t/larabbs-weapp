export default {
  data: {
    page: 1,
    resourceData: [],
    noMoreData: false,
    isLoading: false
  },
  async onPullDownRefresh() {
    this.page = 1
    this.noMoreData = false

    await this.loadData(true)

    wx.stopPullDownRefresh()
  },
  async onReachBottom() {
    if (this.noMoreData || this.isLoading) {
      return
    }

    this.isLoading = true
    this.page += 1

    await this.loadData()

    this.isLoading = false
  },
  methods: {
    async loadData(reset = false) {
      const response = await this.fetchData()

      this.resourceData = reset ? response.data.data : this.resourceData.concat(response.data.data)

      const pagination = response.data.meta

      if (pagination.current_page === pagination.last_page) {
        this.noMoreData = true
      }
    }
  }
}
