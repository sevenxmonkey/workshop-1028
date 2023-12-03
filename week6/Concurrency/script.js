let audioContext; // 定义音频上下文
const BIN = 64; // 定义频率数组的大小

// 初始化音频上下文的函数
function initAudioContext() {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
}

class AudioPath {
  constructor(id, path, draw) {
    this.hasLoaded = false; // 是否已加载
    this.isPlaying = false; // 是否正在播放
    this.audio = new Audio(); // 创建一个新的音频对象
    this.source; // 音频源

    this.id = id; // 音频ID
    this.path = path; // 音频路径
    this.draw = draw;

    this.audio.loop = true; // 设置音频循环播放
  }

  // 加载音频
  loadAudio() {
    fetch(this.path)
      .then(response => response.text())
      .then(text => {
        this.audio.src = `data:audio/x-wav;base64,${text}`; // 设置音频源
        this.hasLoaded = true; // 标记为已加载
        this.play(); // 播放音频
      })
  }

  // 播放音频
  play() {
    this.isPlaying = true;

    if (!this.hasLoaded) {
      this.loadAudio(); // 如果未加载，则先加载音频
    } else {
      this.audio.play(); // 播放音频
      this.setUpAudioContext(); // 设置音频上下文
    }
  }

  // 暂停音频
  pause() {
    this.audio.pause(); // 暂停音频
    this.isPlaying = false; // 标记为不在播放
  }

  // 切换播放/暂停状态
  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  // 设置音频上下文
  setUpAudioContext() {
    initAudioContext(); // 初始化音频上下文
    if (!this.source) {
      this.source = audioContext.createMediaElementSource(this.audio);
    }
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 64;
    this.source.connect(analyser);
    analyser.connect(audioContext.destination);
    const freqArray = new Uint8Array(BIN);

    function recursion(audio, draw) {
      if (audio.paused || audio.ended) {
        return;
      }
      analyser.getByteFrequencyData(freqArray);
      draw(freqArray);
      requestAnimationFrame(() => recursion(audio, draw))
    }
    recursion(this.audio, this.draw);
  }
}
// Visualizaiton
const WIDTH = 800;
const HEIGHT = 800;

const canvas1 = document.getElementById('canvas-1');
const context1 = canvas1.getContext('2d');
canvas1.width = WIDTH;
canvas1.height = HEIGHT;

const canvas2 = document.getElementById('canvas-2');
const context2 = canvas2.getContext('2d');
canvas2.width = WIDTH;
canvas2.height = HEIGHT;

const audio1 = new AudioPath('a1', 'raw1.txt', (freqs) => {
  draw1(freqs, context1);
});
const audio2 = new AudioPath('a2', 'env1.txt', (freqs) => {
  draw1(freqs, context2);
});

document.getElementById('btn-1').addEventListener('click', function () {
  audio1.toggle();
})
document.getElementById('btn-2').addEventListener('click', function () {
  audio2.toggle();
});

/**
 * Visualization code, same as week4/5
 */

function draw1(freqs, context){
  context.clearRect(0, 0, WIDTH, HEIGHT);
  context.beginPath();
  context.fillStyle='rgba(100, 200, 100, 0.5)';
  
  context.arc(WIDTH/2, HEIGHT/2, freqs[0], 0, Math.PI * 2);
  context.fill();
}
