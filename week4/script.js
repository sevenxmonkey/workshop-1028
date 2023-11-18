console.log("Script is working...")

let isRecording = false;
document.getElementById('start-btn').addEventListener('click', () => {
  isRecording = true;
  console.log("Start recording...", isRecording);
  //Start mic
  startMic();
})
document.getElementById('stop-btn').addEventListener('click', () => {
  isRecording = false;
  console.log("Stop recording...", isRecording);
})

const binCount = 64; // 设置声音分布分精度
const startMic = () => {
  // 浏览器获取用户recording权限
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
      const audioContext = new window.AudioContext(); // 创建一个新的audiocontext对象
      const source = audioContext.createMediaStreamSource(stream); // 创建source node
      const analyser = audioContext.createAnalyser(); // 创建analyser node

      analyser.fftSize = binCount * 2; // 傅立叶变换指数(连续波形数据转换成概括的数组)
      source.connect(analyser); // 链接source node和analyser node

      // 两个空的数组variable分别用来储存可变的幅度数据&频率数据
      const freqArray = new Uint8Array(binCount);
      const amptArray = new Uint8Array(binCount);

      // 递归函数 - 如果满足条件，就不断执行自己
      const recursion = () => {
        // 修改声音幅度数组数据
        analyser.getByteTimeDomainData(amptArray);
        // 修改声音频率数组数据
        analyser.getByteFrequencyData(freqArray);

        // 打印数据
        // console.log('amptArray', amptArray);
        // console.log('freqArray', freqArray);

        // draw2(freqArray);
        // draw3(freqArray);
        // draw4(freqArray);
        // draw5(freqArray);

        // 满足条件，执行自己
        if (isRecording) {
          requestAnimationFrame(recursion)
          // setTimeout(() => {
          //   requestAnimationFrame(recursion)
          // }, 200)
        }
      }
      recursion(); // 初始化递归函数
    })
}

// canvas的基本设置
const WIDTH = 800;
const HEIGHT = 800;
const canvas = document.getElementById('canvas-1');
const context = canvas.getContext('2d');

canvas.height = HEIGHT;
canvas.width = WIDTH;

const draw1 = (array) => {
  context.beginPath();
  context.fillStyle = 'red';

  const cnt = array.length; // 方块的数量
  const unit = WIDTH / cnt; // 单位方块的尺寸
  for (let i = 0; i < cnt; i++) {
    // 利用幅度/频率数据去控制方块的高度
    context.rect(i * unit, HEIGHT / 2, 5, array[i] * 0.5 + 10);
  }
  context.fill();
}

const draw2 = (freqs) => {
  // 画每一帧之前，先清除上一帧的内容
  context.clearRect(0, 0, WIDTH, HEIGHT);
  const cnt = 30; // 画一个80 * 80的矩阵
  const unit = WIDTH / cnt;

  // 预设4种不同的color code
  const colorCode = [
    "19, 44, 128",
    "48, 19, 128",
    "103, 19, 128",
    "255, 202, 0"
  ]
  // 用helper function调取4种频段的点阵
  const pointSegments = getPointMatrix(cnt, splitAndSumArray(freqs, 4));
  pointSegments.forEach((points, index) => {
    points.forEach((point) => {
      const { row, col, size } = point;
      context.beginPath();
      // 每个频段赋予不同的颜色
      context.fillStyle = `rgb(${colorCode[index]}, ${0.8 + Math.random()})`;
      context.arc(col * unit, row * unit, 5 + row * Math.random(), 0, 2 * Math.PI);
      context.fill();
    })
  })
}

const draw3 = (freqs) => {
  // 先清除所有画面上的内容
  context.clearRect(0, 0, WIDTH, HEIGHT);
  //定义canvas的中心为圆的中心
  const centerX = WIDTH / 2;
  const centerY = HEIGHT / 2;

  const maxR = WIDTH / 2; //canvas的一半尺寸为最大圆心半径
  const cnt = 64; // 圆环的数量
  const unit = maxR / cnt; // 每个圆环的横向尺寸(跨度)

  const colorCode = [
    "23, 32, 42",
    "27, 79, 114",
    "243, 156, 18",
    "231, 76, 60",
  ]

  for (let n = 0; n < cnt; n++) {
    // 随机选择一个断开的节点
    const breakPoint = Math.random() * 2;
    // 每扫掠0.4个pi就更换描边的粗细
    for (let start = 0; start < 2; start += 0.4) {
      context.beginPath();
      context.lineWidth = Math.random() * 8;
      context.strokeStyle = `rgb(${colorCode[getValueIndex(freqs[n], 150, 4)]})`;
      context.arc(
        centerX,
        centerY,
        unit * n,
        (start + breakPoint) * Math.PI,
        (start + breakPoint + 0.4) * Math.PI
      );
      context.stroke();
    }
  }
}

const colorCode = [
  "23, 32, 42",
  "27, 79, 114",
  "243, 156, 18",
  "231, 76, 60",
]
const moveRects = [];
for (let i = 0; i < 64; i++) {
  moveRects.push({
    x: WIDTH * Math.random(),
    y: HEIGHT * Math.random(),
    size: 10 + i * Math.random() * 3,
    color: `rgb(${colorCode[getValueIndex(i, 63, 4)]}, ${0.4 + Math.random() * 0.5})`,
  })
}

const draw4 = (freqs) => {
  // 先清除所有画面上的内容
  context.clearRect(0, 0, WIDTH, HEIGHT);

  moveRects.forEach((rect, index) => {
    context.beginPath();
    resetMoveRect(rect);
    // 创造一个随机运动
    rect.x += (Math.random() <= 0.5 ? 1 : -1) * (freqs[index] * 0.1 + 1);
    rect.y += (Math.random() <= 0.5 ? 1 : -1) * (freqs[index] * 0.1 + 1);
    context.fillStyle = rect.color;

    context.rect(rect.x, rect.y, rect.size, rect.size);
    context.fill();
  })
}

const draw5 = (freqs) => {
  // 先清除所有画面上的内容
  context.clearRect(0, 0, WIDTH, HEIGHT);

  context.beginPath();
  context.moveTo(moveRects[0].x, moveRects[0].y);

  for (let i = 1; i < freqs.length; i++) {
    const rect = moveRects[i];
    resetMoveRect(rect);
    // 创造一个随机运动
    rect.x += (Math.random() <= 0.5 ? 1 : -1) * ((freqs[i] - 10) * 0.1);
    rect.y += (Math.random() <= 0.5 ? 1 : -1) * ((freqs[i] - 10) * 0.1);

    if (freqs[i] > 50) {
      context.lineTo(moveRects[i].x, moveRects[i].y);
      context.arc(moveRects[i].x, moveRects[i].y, 5, 0, 2 * Math.PI);
    }
  }
  context.closePath();
  context.stroke();
}

function resetMoveRect(position) {
  if (position.x < 0) position.x = WIDTH;
  if (position.x > WIDTH) position.x = 0;
  if (position.y < 0) position.y = HEIGHT;
  if (position.y > HEIGHT) position.y = 0;
}

function getValueIndex(value, max, n) {
  const unit = max / n;
  return Math.min(Math.floor(value / unit), n - 1)
}

function getPointMatrix(n, ratio) {
  const points = [];
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      const point = {
        row: row,
        col: col,
        // color: 'blue',
        size: Math.random() * 30
      }
      points.push(point);
    }
  }

  // Shuffle the points array
  for (let i = points.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [points[i], points[j]] = [points[j], points[i]];
  }

  // ratio是一个数组，比如[1,2,3,4]
  const result = []; // result用于存储最终的分段数组
  const sum = ratio.reduce((a, b) => a + b, 0); // 计算ratio数组中所有元素的总和

  // 遍历ratio数组，根据每个比例元素来分割points数组
  let startIndex = 0; // 开始索引，用于标记每个分段的起始位置
  for (let i = 0; i < ratio.length; i++) {
    // 根据比例计算当前段的长度
    // 使用Math.round来确保长度为整数，可能会有轻微的四舍五入误差
    let length = Math.round(points.length * (ratio[i] / sum));

    // 使用slice方法从points数组中截取当前比例所对应的分段
    let part = points.slice(startIndex, startIndex + length);

    // 将截取的分段添加到结果数组中
    result.push(part);

    // 更新startIndex为下一个分段的起始位置
    startIndex += length;
  }

  return result;
}

function splitAndSumArray(array, cnt) {
  // 储存最后的输出结果，即每个分段的累积和
  let result = []; 
  // 计算每个分段的大致长度，使用Math.ceil确保长度为整数并覆盖所有元素
  let partSize = Math.ceil(array.length / cnt); 

  // 循环遍历数组，以partSize为步长
  for (let i = 0; i < array.length; i += partSize) {
    let part = array.slice(i, i + partSize); // 从数组中截取当前分段
    let sum = part.reduce((a, b) => a + b, 0); // 计算当前分段的元素累积和
    result.push(sum); // 将这个累积和添加到结果数组中
  }

  return result; // 返回包含所有分段累积和的数组
}


