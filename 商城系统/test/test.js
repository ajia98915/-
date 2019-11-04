const role = require('./tree_data')

// node 是一个权限的节点；这个节点 可能是 叶子（三级）节点； 也可能是 非叶子节点
// keyArr 是数组，专门用来存储所有叶子的Id值的
function getLeafId(node, keyArr) {
  // 判断 node 节点，是否为 叶子节点
  if (!node.children) {
    return keyArr.push(node.id)
  }
  // 如果不是叶子节点，则 当前 node 节点，肯定包含 children 属性
  node.children.forEach(item => getLeafId(item, keyArr))
}

const keys = []
getLeafId(role, keys)
console.log(keys)
