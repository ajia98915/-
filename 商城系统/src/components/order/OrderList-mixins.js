import cityData from '../../assets/city_data2017_element.js'

export default {
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 总数据条数
      total: 0,
      // 订单列表
      orderList: [],
      // 控制物流对话框的显示与隐藏
      dialogVisible: false,
      // 物流进度
      wlInfo: [],
      // 控制 修改物流地址对话框的显示与隐藏
      addressDialogVisible: false,
      // 信息地址对象
      addressForm: {
        address2: '',
        city: []
      },
      // 信息地址对象的校验规则
      addressFormRules: {
        address1: [{ required: true, message: '请选择省份', trigger: 'blur' }],
        address2: [{ required: true, message: '请填写详细的物流地址', trigger: 'blur' }]
      },
      // 城市数据
      cityData: cityData
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    // 获取订单列表
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取订单列表失败！')
      this.total = res.data.total
      this.orderList = res.data.goods
    },
    // 每当 pagesize 变化，会触发 这个函数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    // 每当 页码值发生变化，会触发这个函数
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 展示物流对话框
    async showWLDialog() {
      // 手动写死 运单号 1106975712662
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) return this.$message.error('查询物流进度失败！')
      this.wlInfo = res.data

      this.dialogVisible = true
    },
    // 修改物流地址对话框关闭的事件
    addressDialogClosed() {
      // 重置物流信息表单
      this.$refs.addressFormRef.resetFields()
      this.addressForm.city = []
    }
  }
}
