import echarts from 'echarts'
// // 导入 Echarts 基本的包
// import echarts from 'echarts/lib/echarts'
// // 折线图的基本结构
// import 'echarts/lib/chart/line'
// // 鼠标跟随效果
// import 'echarts/lib/component/tooltip'
// // 显示 标题  用户来源
// import 'echarts/lib/component/title'
// // 头部的 图例
// import 'echarts/lib/component/legendScroll'
// 导入 lodash
import _ from 'lodash'

export default {
  data() {
    return {}
  },
  // 此时，页面上的元素，已经被渲染完毕了！
  async mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(this.$refs.main)

    // 获取图表的配置项和数据
    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) return this.$message.error('获取图表数据失败！')

    // 需要被合并的数据对象
    const options = {
      title: {
        text: '用户来源'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#E9EEF3'
          }
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          boundaryGap: false
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ]
    }
    // 使用 lodash 的 merge 合并数据对象
    const result = _.merge(res.data, options)

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(result)
  },
  methods: {}
}
