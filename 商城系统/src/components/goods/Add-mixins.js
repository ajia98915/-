import config from '../../config.json'
import _ from 'lodash'

export default {
  data() {
    return {
      // 默认被激活的Tab栏和被选中的步骤条
      activeName: '0',
      // 添加商品的表单对象
      addForm: {
        // 商品名称
        goods_name: '',
        // 商品所属的分类
        goods_cat: [],
        // 商品价格
        goods_price: '',
        // 商品数量
        goods_number: '',
        // 商品重量
        goods_weight: '',
        // 商品介绍
        goods_introduce: '',
        // 商品的图片
        pics: [],
        // 商品的参数信息
        attrs: []
      },
      // 添加商品的表单验证规则
      addFormRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' }]
      },
      // 所有商品分类的列表
      cateList: [],
      // 指定 级联选择框中数据项的对应关系
      cascaderProp: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 分类下所有动态参数的数据
      manyTableData: [],
      // 分类下所有静态属性数据
      onlyTableData: [],
      // 图片上传的URL地址
      uploadURL: config.baseURL + 'upload',
      // 图片上传时候手动指定token
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 控制预览窗口的显示与隐藏
      previewVisible: false,
      // 预览图片的URL地址
      previewImgPath: ''
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取所有商品的分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories', { params: { type: 3 } })
      if (res.meta.status !== 200) return this.$message.error('获取商品分类失败！')
      this.cateList = res.data
    },
    // 级联选择框的选中项发生改变，触发这个函数
    handleChange() {
      console.log(this.addForm.goods_cat)
      if (this.addForm.goods_cat.length === 3) {
        console.log(this.addForm)
      } else {
        this.addForm.goods_cat = []
      }
    },
    // 在离开 Tab 页签之前触发
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.cateId === null) {
        this.$message.error('请先选择商品分类！')
        // 阻止 页签 切换
        return false
      }
    },
    // tab 栏被点击的事件
    async tabClicked() {
      if (this.activeName === '1') {
        // 证明进入的是 动态参数 面板
        // 获取当前 三级分类下，所有动态参数的数据
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'many' }
        })

        if (res.meta.status !== 200) return this.$message.error('获取动态参数失败！')
        // 把每一个动态参数的 attr_vals 属性，都是用 ' ' 做分割
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        })
        this.manyTableData = res.data
      } else if (this.activeName === '2') {
        // 证明进入了静态属性面板， 获取分类下所有的静态属性数据
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'only' }
        })

        if (res.meta.status !== 200) return this.$message.error('获取静态属性失败！')

        this.onlyTableData = res.data
        console.log(res)
      }
    },
    // 点击预览图片
    handlePreview(result) {
      this.previewImgPath = result.response.data.url
      this.previewVisible = true
    },
    // 点击移除图片
    handleRemove(result) {
      // 1. 获取即将要删除的图片的地址
      const picPath = result.response.data.tmp_path
      // 2. 根据 picPath,从 addForm.pics 数组中，找到要删除哪一项的索引
      const i = this.addForm.pics.findIndex(x => x.pic === picPath)
      this.addForm.pics.splice(i, 1)
    },
    // 上传图片成功，会触发这个函数
    handleSuccess(result) {
      if (result.meta.status === 200) {
        const o = { pic: result.data.tmp_path }
        this.addForm.pics.push(o)
      }
    },
    // 添加商品
    addGoods() {
      // 表单验证
      this.$refs.addFormRef.validate(async valid => {
        // 表单验证失败
        if (!valid) return this.$message.error('请完善表单数据后再添加！')

        // 处理和组织表单数据
        // 通过 lodash 把 addForm 做一下深拷贝
        const form = _.cloneDeep(this.addForm)
        // 处理 goods_cat，把 数组性质的 goods_cat 转为 字符串
        form.goods_cat = form.goods_cat.join(',')
        // TODO：处理 attrs 属性
        // 循环 manyTableData，拼接出新对象，保存到 form.attrs 中
        this.manyTableData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals.join(' ') }
          form.attrs.push(newInfo)
        })
        // 循环 onlyTableData，拼接出新对象，保存到 form.attrs 中
        this.onlyTableData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          form.attrs.push(newInfo)
        })

        // 发起Ajax请求，添加新商品
        // 注意：商品名称是唯一的，不能重复
        const { data: res } = await this.$http.post('goods', form).catch(err => err)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success('添加商品成功！')
        // 通过编程式导航，跳转到 商品列表页面
        this.$router.push('/goods/list')
      })
    }
  },
  computed: {
    // 选中的三级分类的Id
    cateId: function() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
