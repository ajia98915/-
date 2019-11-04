// const o1 = {
//   a: 'aaa',
//   b: 'bbb'
// }

// const o2 = {
//   c: 'ccc',
//   // 展开运算符
//   ...o1
// }

// o2.a = o1.a
// o2.b = o1.b

// console.log(o2)

// -----------------------------
const arr1 = [1, 2, 3, 4]
const arr2 = ['a', 'b', 'c', 'd']

// const newArr = [...arr1, ...arr2]
console.log([...arr1, ...arr2].join(','))
