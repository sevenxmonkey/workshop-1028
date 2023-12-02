console.log("The script is working...");
/**
 * Global DOM selectors
 */
const locationBtns = document.querySelectorAll('.location-item');
const canvas = document.getElementById('canvas');
const { width: WIDTH, height: HEIGHT } = canvas.parentElement.getBoundingClientRect();
canvas.width = WIDTH;
canvas.height = HEIGHT;
const context = canvas.getContext('2d');

/**
 * Global states on the top
 */
let selectedLocation;
let selectedFreqRange = 'freqAll';
const BIN = 512;
const colors = ["#004b23", "#006400", "#007200", "#008000", "#38b000", "#70e000", "#9ef01a", "#ccff33"];

const freqBtns = document.querySelectorAll('.freq-btn');
freqBtns.forEach(freqBtn => {
  freqBtn.addEventListener('click', () => {
    selectedFreqRange = freqBtn.id;
    freqBtns.forEach(ele => {
      ele.classList.remove('active')
    })
    freqBtn.classList.add('active')
  })
})

const audio = new Audio();
audio.addEventListener('ended', function () {
  this.currentTime = 0;
  this.play();
})

let audioContext;
let source;

function initAudioContext() {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  if (!source) {
    source = audioContext.createMediaElementSource(audio);
  }
}

function loadAudio(path, locationId) {
  fetch(path)
    .then(response => response.text())
    .then(text => {
      audio.src = `data:audio/x-wav;base64,${text}`;
      audio.play();

      initAudioContext();

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyser.connect(audioContext.destination);

      const freqArray = new Uint8Array(BIN);

      function recursion() {
        if (source.mediaElement.paused || locationId !== selectedLocation) {
          console.log("test111")
          return;
        }
        analyser.getByteFrequencyData(freqArray);
        draw4(freqArray);
        requestAnimationFrame(recursion)
      }
      recursion();
    })
}

class Location {
  constructor(id, x, y, path, name, desc) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.name = name;
    this.desc = desc;
    this.path = path;
  }

  render() {
    const btn = document.getElementById(this.id);
    const legand = document.getElementById('map-legand');
    if (!!btn && !!legand) {
      btn.style.left = `${this.x}px`;
      btn.style.top = `${this.y}px`;

      btn.addEventListener('click', () => {
        if (selectedLocation !== this.id) {
          selectedLocation = this.id;
          loadAudio(this.path, this.id);

          legand.style.display = 'block';
          document.getElementById('map-legand-title').innerHTML = this.name;
          document.getElementById('map-legand-text').innerHTML = this.desc;

          // Selected UI
          if (locationBtns.length > 0) {
            locationBtns.forEach(ele => {
              if (ele.classList.contains('active')) {
                ele.classList.remove('active')
              }
            })
          }
          btn.classList.add('active');
        } else {
          selectedLocation = undefined;
          legand.style.display = 'none';
          audio.pause();

          // Unselected UI
          btn.classList.remove('active');
        }
      })

      btn.addEventListener('mouseenter', () => {
        const tooltip = document.createElement('div');
        tooltip.innerHTML = this.name;
        tooltip.classList.add('tooltip')
        btn.appendChild(tooltip);
      })
      btn.addEventListener('mouseleave', () => {
        btn.innerHTML = '';
      })
    }
  }
}

const locations = [
  new Location('loc1', 200, 200, 'assets/audio/raw1.txt', 'Mission District', '1030 Washington Str, 94404, CA'),
  new Location('loc2', 250, 300, 'assets/audio/raw2.txt', 'Duboce Triange', '1028 Geary Blvd, 95054, CA'),
  new Location('loc3', 123, 567, 'assets/audio/raw3.txt', 'Cole Vallye', '1090 Buena Vista Ave E, 91819, CA')
]

locations.forEach(location => {
  location.render();
});

let gravity = 0.8; // 每一帧的加速度(重力加速度)
let friction = 0.99; // 碰撞后的能量损耗值

function shoudDraw(id) {
  const range = BIN / (freqBtns.length - 1);
  switch (selectedFreqRange) {
    case 'freqAll': return true;
    case 'freq1': return id <= range;
    case 'freq2': return id >= range && id <= range * 2;
    case 'freq3': return id >= range * 2;
  }
}

class Ball {
  constructor(id, x, y, vx, vy, r, color) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.r = r;
    this.color = color;
  }

  draw(freq) {
    if (shoudDraw(this.id)) {
      context.beginPath();
      context.arc(this.x, this.y, 8 + freq * 0.2, 0, Math.PI * 2);
      context.fillStyle = this.color;
      context.fill();
      context.stroke();
      context.closePath();
    }
  }


  update(freq) {
    if (this.x + this.r + this.vx > WIDTH) {
      this.vx = -this.vx * friction;
    } else if (this.x - this.r < 0) {
      this.vx = Math.max(-this.vx * friction, 0.1)
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
    this.draw(freq);
  }
}

const balls = [];
for (let i = 0; i < BIN; i++) {
  const r = randomIntFromRange(8, 30);
  const x = randomIntFromRange(r, WIDTH - r);
  const y = randomIntFromRange(r, HEIGHT - r);
  const vx = randomIntFromRange(-2, 3);
  balls.push(new Ball(i, x, y, vx, 2, r, colors[getValueIndex(i, BIN - 1, colors.length)]))
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

// 获取给定值在固定范围内的索引
function getValueIndex(value, max, n) {
  const unit = max / n;
  return Math.min(Math.floor(value / unit), n - 1);
}