// 创建一个普通的对象personA
const personA = {
  fn: 'Junjie', // 姓
  ln: 'Lin',    // 名
  age: 44,      // 年龄
}
// 定义一个Person类
class Person {
  // 构造函数，用于初始化新实例
  constructor(fn, ln, age){
    this.fn = fn;   // 设置姓
    this.ln = ln;   // 设置名
    this.age = age; // 设置年龄
  }
  // 定义一个吃饭的方法
  eat(){
    const fullName = `${this.fn} ${this.ln}` // 获取全名
    console.log(`${fullName} is eating`);    // 打印正在吃饭的信息
  }
  // 定义一个工作的方法
  work(){
    const fullName = `${this.fn} ${this.ln}` // 获取全名
    console.log(`${fullName} is working`);   // 打印正在工作的信息
  }
}
// 使用Person类创建一个新的personB对象
const personB = new Person('Jielun', 'Zhou', 33);
personB.eat();  // 调用personB的eat方法
personB.work(); // 调用personB的work方法

