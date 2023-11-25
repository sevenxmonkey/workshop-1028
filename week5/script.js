console.log("Script is working...");

// 创建一个新的音频对象
const audio = new Audio();

// 当点击'start-btn'按钮时，开始加载并播放音频
document.getElementById('start-btn').addEventListener('click', () => {
  console.log("Loading audio file");
  startLoadResource(); // 调用startLoadResource函数开始加载资源
})

// 当点击'stop-btn'按钮时，暂停音频播放
document.getElementById('stop-btn').addEventListener('click', () => {
  console.log("Pause audio");
  audio.pause();
})

const BIN = 64;

// 定义startLoadResource函数来加载音频资源
function startLoadResource() {
  // 从本地路径获取音频文件
  fetch('assets/city.txt')
    .then(response => response.text()) // 将响应转换为字符串
    .then(text => {
      audio.src = `data:audio/x-wav;base64,${text}`; // 设置音频的源为base64编码的字符串
      audio.play(); // 播放音频

      // 创建一个新的AudioContext实例
      const audioContext = new window.AudioContext();
      // 创建一个音频源
      const soruce = audioContext.createMediaElementSource(audio);
      // 创建一个分析器
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = BIN * 2; // 设置FFT大小
      soruce.connect(analyser); // 将源连接到分析器
      analyser.connect(audioContext.destination); // 将分析器连接到AudioContext的目标

      // 创建用来储存频率和振幅的数组
      const freqArray = new Uint8Array(BIN);
      const amptArray = new Uint8Array(BIN);

      // 定义一个递归函数来实时分析音频数据
      function recursion() {
        // 如果音频结束或暂停，则停止分析
        if (soruce.mediaElement.ended || soruce.mediaElement.paused) return;
        analyser.getByteFrequencyData(freqArray); // 获取频率数据
        analyser.getByteTimeDomainData(amptArray); // 获取振幅数据
        // console.log(freqArray); // 打印频率数据
        // console.log(amptArray); // 打印振幅数据

        /**
         * 开始自定义部分
         */
        // draw1(freqArray);
        // draw2(freqArray);
        // draw3(freqArray);
        // draw4(freqArray);

        requestAnimationFrame(recursion); // 递归调用以持续分析
      }
      recursion();
    }).catch(error => {
      console.log('Error loading audio', error); // 如果出现错误，打印错误信息
    })
}
// 设置画布的宽度和高度
const WIDTH = 800;
const HEIGHT = 800;

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
canvas.width = WIDTH;
canvas.height = HEIGHT;

// 定义一个Particle类来表示单个粒子
class Particle {
  // 构造函数，用于初始化粒子属性
  constructor(x, y, vx, vy, size, color) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.size = size;
    this.color = color;
    this.moveStep = 0;
  }
  // 绘制粒子
  draw() {
    context.beginPath();
    context.fillStyle = this.color;
    context.rect(this.x, this.y, this.size, this.size);
    context.fill();
  }
  // 更新粒子位置的方法
  update(freq) {
    this._resetPosition();

    this.moveStep++;
    // 每20帧更新归零一次，并且随机改变粒子运动方向
    if (this.moveStep >= 20) {
      this.moveStep = 0;
      this.vx = (Math.random() < 0.5 ? 1 : -1) * this.vx;
      this.vy = (Math.random() < 0.5 ? 1 : -1) * this.vy;
    }

    // 频率改变运动速度
    this.size = 20 + freq * 0.5;
    this.x += this.vx * (freq * 0.03);
    this.y += this.vy * (freq * 0.03);

    // this.draw();
  }

  // _resetPosition方法用于调整粒子位置，确保它不会离开画布
  _resetPosition() {
    if (this.x < 0) this.x = WIDTH;
    if (this.x > WIDTH) this.x = 0;
    if (this.y < 0) this.y = HEIGHT;
    if (this.y > HEIGHT) this.y = 0;
  }
}

const colors = ["#264653", "#2A9D8F", "#E9C46A", "#F4A261", "#E76F51"]

// 创建多个粒子
const points = [];
for (let i = 0; i < BIN; i++) {
  points.push(new Particle(
    Math.random() * WIDTH,
    Math.random() * HEIGHT,
    2, 2, 20,
    colors[getValueIndex(i, BIN - 1, colors.length)]
  ))
}

function draw1(freqs) {
  context.clearRect(0, 0, WIDTH, HEIGHT);
  // 每个频段的数值去影响这个频段的粒子
  points.forEach((p, index) => {
    p.update(freqs[index]);
  })
}

function draw2(freqs) {
  context.clearRect(0, 0, WIDTH, HEIGHT);
  context.beginPath();

  // 遍历频率数组，每个元素对应一个点
  for (let i = 0; i < freqs.length - 1; i++) {
    const point = points[i];
    point.update(freqs[i]);

    if (freqs[i] > 50) {
      context.lineTo(point.x, point.y);
      context.arc(point.x, point.y, 5, 0, Math.PI * 2);
    }
  }
  context.closePath();
  context.stroke();
}

function draw3(freqs) {
  // 使用filter方法筛选出每十个点中的第一个点，并更新这些点的位置
  const renderPoints = points.filter((point, index) => {
    point.update(freqs[index]);
    return index % 10 === 0;
  });

  context.beginPath();
  context.moveTo(renderPoints[0].x, renderPoints[0].y);

  // 遍历筛选后的点，使用二次贝塞尔曲线连接它们
  for (let i = 1; i < renderPoints.length - 2; i++) {
    const { x, y } = renderPoints[i];
    const { x: nextX, y: nextY } = renderPoints[i + 1]; // 下一个点的坐标

    const cx = (x + nextX) / 2;
    const cy = (y + nextY) / 2;
    context.quadraticCurveTo(x, y, cx, cy);
  }

  context.stroke();
}

// 获取给定值在固定范围内的索引
function getValueIndex(value, max, n) {
  const unit = max / n;
  return Math.min(Math.floor(value / unit), n - 1);
}

let gravity = 1; // 每一帧的加速度(重力加速度)
let friction = 0.9; // 碰撞后的能量损耗值

class Ball {
  constructor(x, y, vx, vy, r, color) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.r = r;
    this.color = color;
  }

  draw() {
    context.beginPath();
    context.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    context.fillStyle = this.color;
    context.fill();
    context.stroke();
    context.closePath();
  }


  update(freq) {
    if (this.x + this.r + this.vx > WIDTH || this.x - this.r < 0) {
      this.vx = -this.vx * friction;
    }
    this.x += this.vx;

    // 根据音频频率计算向上的力
    const upForce = Math.min(freq * 0.02, gravity);
    if (this.y + this.r + this.vy > HEIGHT) {
      // 反转Y轴上的速度并减去向上的力
      this.vy = -this.vy * friction - upForce
    } else if (this.y - this.r < 0) {
      // 确保Y轴上的速度不小于0.1, 避免边界值bug(有可能吸到顶上)
      this.vy = Math.max(-this.vy * friction, 0.1)
    } else {
      // 应用重力加速度并减去向上的力
      this.vy += gravity - upForce
    }
    this.y += this.vy;
    this.draw();
  }
}

const balls = [];
for (let i = 0; i < BIN; i++) {
  const r = randomIntFromRange(8, 30);
  const x = randomIntFromRange(r, WIDTH - r);
  const y = randomIntFromRange(r, HEIGHT - r);
  const vx = randomIntFromRange(-2, 2);
  balls.push(new Ball(x, y, vx, 2, r, colors[getValueIndex(i, BIN - 1, colors.length)]))
}

function draw4(freqs) {
  context.clearRect(0, 0, WIDTH, HEIGHT);
  balls.forEach((ball, index) => {
    ball.update(freqs[index]);
  })
}

// 指定范围内的随机整数
function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

