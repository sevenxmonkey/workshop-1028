/**
 * Variable
 */
const num1 = 2;
const num2 = 3;
console.log(num1 + num2);  // 5

const strA = 'abc';
const strB = 'def';
console.log(strA + strB); // 'abcdef'

let numA = 0;
console.log(numA); // 0
for (let i = 0; i < 100; i++) {
  numA = numA + 2;
}
console.log(numA); // 200

const arrayA = ['a', 'b', 'c', 'd', 'e']
console.log(arrayA[0]); // 'a'
console.log(arrayA[3]); // '3'

console.log(arrayA.length); // 5

arrayA.forEach((element) => {
  console.log(element);
});
// a b c d e

const filterResult = arrayA.filter(ele => {
  return ele > 'a';
})
console.log(filterResult);
// ['b', 'c', 'd', 'e']

const MapResult = arrayA.map((ele, index) => {
  return ele + index;
})
console.log(MapResult);
// ['a0', 'b1', 'c2', 'd3', 'e4']

/**
 * For loop
 */
let text = '';
for (let i = 0; i < 5; i++) {
  text += `The number is ${i} \n`;
}
console.log(text);

/**
 * For of
 */

let language = "JavaScript";
for (let x of language) {
  console.log(x.toUpperCase());
}

/**
 * Function
 */

// Declaration
function multiply(x, y) {
  return x * y;
} // No need for semicolon here

// Arrow function
const multiply1 = (x, y) => x * y;

// Method
const obj = {
  multiply2(x, y) {
    return x * y;
  },
};

const personA = {
  firstName: 'Jay',
  secondName: 'Zhou',
  age: 40,
  wechatId: 'zhoujielun'
}

const personB = {
  firstName: 'Jolin',
  secondName: 'Tsai',
  age: 43,
  wechatId: 'caiyilin'
}

const workshop1028 = {
  title: "Front-end City Sound Workshop",
  startTime: new Date('2023-10-28'),
  students: [personA, personB]
}

console.log(workshop1028);

class Student {
  constructor(firstName, secondName, age, wechatId){
    this.firstName = firstName;
    this.secondName = secondName;
    this.age = age;
    this.wechatId = wechatId;
  }

  updateWechatId(newWechatId){
    this.wechatId = newWechatId;
  }
}

const personC = new Student('JJ', 'Lin', 45, 'junjie1029');
personC.updateWechatId('junjie0000');
console.log(personC);

/**
 * If ... else
 */

if (time < 10) {
  greeting = "Good morning";
} else if (time < 20) {
  greeting = "Good day";
} else {
  greeting = "Good evening";
}
