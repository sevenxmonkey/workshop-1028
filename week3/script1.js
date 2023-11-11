class Student {
  constructor(fn, ln, age){
    this.firstName = fn;
    this.lastName = ln;
    this.age = age;

    this.fullName = fn + ' ' + ln;
  }

  getFullName(){
    return this.firstName + ' ' + this.lastName;
  }

  doHomeWork() {
    console.log(`${this.fullName} is doing homework...`)
  }
}

const personA = new Student('Sijia', 'Li', 800);
personA.doHomeWork();

const personB = new Student('Xiaowen', '8', 8);
personB.doHomeWork();
