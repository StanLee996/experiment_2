// 音乐播放器功能实现

// 歌曲列表数据
const playlist = [
  {
    title: '25216950513歌曲1',
    author: '梁卓荣',
    image: './img/record0.jpg',
    bg: './img/bg0.png',
    audio: './mp3/music0.mp3',
    video: './mp4/video0.mp4'
  },
  {
    title: '25216950513歌曲2',
    author: '梁卓荣',
    image: './img/record1.jpg',
    bg: './img/bg1.png',
    audio: './mp3/music1.mp3',
    video: './mp4/video1.mp4'
  },
  {
    title: '25216950513歌曲3',
    author: '梁卓荣',
    image: './img/record2.jpg',
    bg: './img/bg2.png',
    audio: './mp3/music2.mp3',
    video: './mp4/video2.mp4'
  },
  {
    title: '25216950513歌曲4',
    author: '梁卓荣',
    image: './img/record3.jpg',
    bg: './img/bg3.png',
    audio: './mp3/music3.mp3',
    video: './mp4/video3.mp4'
  }
];

// 播放器状态
let currentIndex = 0;
let isPlaying = false;
let isMuted = false;
let previousVolume = 0.7; // 保存静音前的音量
let playMode = 0; // 0: 顺序播放, 1: 循环播放, 2: 随机播放
let currentSpeed = 1.0;

// DOM元素
const audio = document.getElementById('audio');
const playPauseBtn = document.querySelector('.playPause');
const beforeMusicBtn = document.querySelector('.beforeMusic');
const nextMusicBtn = document.querySelector('.nextMusic');
const playModeBtn = document.querySelector('.playMode');
const volumnBtn = document.querySelector('.volumn');
const volumnTogger = document.getElementById('volumn-togger');
const speedBtn = document.getElementById('speed');
const speedMenu = document.getElementById('speed-menu');
const listBtn = document.getElementById('list');
const playlistElement = document.getElementById('playlist');
const closePlaylistBtn = document.getElementById('close-playlist');
const progressBar = document.querySelector('.progress');
const playedTime = document.querySelector('.played-time');
const audioTime = document.querySelector('.audio-time');
const musicTitle = document.querySelector('.music-title');
const authorName = document.querySelector('.author-name');
const recordImg = document.getElementById('record-img');
const body = document.body;

// 初始化播放器
function initPlayer() {
  // 设置初始音量
  audio.volume = 0.7;
  // 加载当前歌曲信息
  loadCurrentSong();
  // 生成播放列表
  generatePlaylist();
  // 绑定事件
  bindEvents();
}

// 加载当前歌曲信息
function loadCurrentSong() {
  const song = playlist[currentIndex];
  musicTitle.textContent = song.title;
  authorName.textContent = song.author;
  recordImg.style.backgroundImage = `url(${song.image})`;
  body.style.backgroundImage = `url(${song.bg})`;
  body.style.backgroundSize = 'cover';
  body.style.backgroundPosition = 'center';

  // 设置音频源
  audio.src = song.audio;

  // 加载音频文件以获取真实时长
  audio.addEventListener('loadedmetadata', () => {
    audioTime.textContent = formatTime(audio.duration);
  });

  // 更新播放列表选中状态
  updatePlaylistSelection();
}

// 生成播放列表
function generatePlaylist() {
  const playlistContent = playlistElement.querySelector('.playlist-content');
  playlistContent.innerHTML = '';

  playlist.forEach((song, index) => {
    const item = document.createElement('div');
    item.className = 'playlist-item';
    item.innerHTML = `
      <div class="music-title">${song.title}</div>
      <div class="author-name">${song.author}</div>
    `;
    item.addEventListener('click', () => {
      currentIndex = index;
      loadCurrentSong();
      playMusic();
    });
    playlistContent.appendChild(item);
  });
}

// 更新播放列表选中状态
function updatePlaylistSelection() {
  const playlistItems = document.querySelectorAll('.playlist-item');
  playlistItems.forEach((item, index) => {
    if (index === currentIndex) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

// 播放音乐
function playMusic() {
  isPlaying = true;
  playPauseBtn.style.backgroundImage = 'url(./img/暂停.png)';
  // 开始唱片旋转
  recordImg.style.animation = 'rotate 3s linear infinite';
  recordImg.style.animationPlayState = 'running';

  // 播放真实音频
  audio.play().catch(error => {
    console.error('播放失败:', error);
    // 如果自动播放失败，可能是浏览器策略限制，提示用户手动点击
    isPlaying = false;
    playPauseBtn.style.backgroundImage = 'url(./img/继续播放.png)';
  });

  // 设置进度更新
  setupProgressUpdate();
}

// 暂停音乐
function pauseMusic() {
  isPlaying = false;
  playPauseBtn.style.backgroundImage = 'url(./img/继续播放.png)';
  // 暂停唱片旋转
  recordImg.style.animationPlayState = 'paused';

  // 暂停真实音频
  audio.pause();
}

// 切换播放/暂停
function togglePlayPause() {
  if (isPlaying) {
    pauseMusic();
  } else {
    playMusic();
  }
}

// 上一首
function playPrevious() {
  if (playMode === 2) { // 随机播放
    // 随机选择一个不同的索引
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * playlist.length);
    } while (newIndex === currentIndex && playlist.length > 1);
    currentIndex = newIndex;
  } else {
    // 顺序播放和循环播放都按正常顺序
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
  }
  loadCurrentSong();
  if (isPlaying) {
    playMusic();
  }
}

// 下一首
function playNext() {
  console.log('playNext函数被调用，当前播放模式:', playMode); // 调试信息
  console.log('当前索引:', currentIndex); // 调试信息

  if (playMode === 2) { // 随机播放
    // 随机选择一个不同的索引
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * playlist.length);
      console.log('随机生成的索引:', newIndex); // 调试信息
    } while (newIndex === currentIndex && playlist.length > 1);
    currentIndex = newIndex;
    console.log('选择的新索引:', currentIndex); // 调试信息
  } else {
    // 顺序播放和循环播放都按正常顺序
    currentIndex = (currentIndex + 1) % playlist.length;
    console.log('新索引:', currentIndex); // 调试信息
  }
  loadCurrentSong();
  if (isPlaying) {
    playMusic();
  }
}

// 切换播放模式
function togglePlayMode() {
  playMode = (playMode + 1) % 3;
  updatePlayModeIcon();
  console.log('播放模式已切换为:', playMode); // 调试信息
  console.log('当前播放模式名称:', ['顺序播放', '循环播放', '随机播放'][playMode]); // 调试信息
}

// 更新播放模式图标
function updatePlayModeIcon() {
  const icons = [
    './img/mode1.png', // 顺序播放
    './img/mode2.png', // 循环播放
    './img/mode3.png'  // 随机播放
  ];
  playModeBtn.style.backgroundImage = `url(${icons[playMode]})`;
  console.log('更新播放模式图标为:', icons[playMode]); // 调试信息
}

// 切换音量
function toggleVolume() {
  isMuted = !isMuted;
  if (isMuted) {
    // 静音前保存当前音量
    previousVolume = audio.volume;
    audio.volume = 0;
    volumnTogger.value = 0;
    volumnBtn.style.backgroundImage = 'url(./img/静音.png)';
  } else {
    // 恢复静音前的音量
    audio.volume = previousVolume;
    volumnTogger.value = Math.round(previousVolume * 100);
    volumnBtn.style.backgroundImage = 'url(./img/音量.png)';
  }
}

// 调整音量
function adjustVolume() {
  const volume = volumnTogger.value / 100;
  isMuted = volume === 0;
  volumnBtn.style.backgroundImage = isMuted ? 'url(./img/静音.png)' : 'url(./img/音量.png)';
  audio.volume = volume; // 实际设置音频音量
}

// 切换倍速菜单
function toggleSpeedMenu() {
  speedMenu.classList.toggle('active');
}

// 设置播放速度
function setPlaybackSpeed(speed) {
  currentSpeed = parseFloat(speed);
  speedBtn.textContent = `${currentSpeed}X`;
  speedMenu.classList.remove('active');

  // 设置音频播放速度
  audio.playbackRate = currentSpeed;

  // 更新倍速菜单选中状态
  const speedOptions = document.querySelectorAll('.speed-option');
  speedOptions.forEach(option => {
    option.classList.toggle('active', parseFloat(option.dataset.speed) === currentSpeed);
  });
}

// 切换播放列表
function togglePlaylist() {
  playlistElement.classList.toggle('active');
}

// 关闭播放列表
function closePlaylist() {
  playlistElement.classList.remove('active');
}

// 实际进度更新（使用真实音频文件）
function setupProgressUpdate() {
  // 清除之前的进度更新
  if (window.progressInterval) {
    clearInterval(window.progressInterval);
  }

  // 移除之前的事件监听器，避免重复添加
  audio.removeEventListener('timeupdate', updateProgress);
  audio.removeEventListener('ended', handleAudioEnded);

  // 定义进度更新函数
  function updateProgress() {
    if (!isPlaying) return;

    // 更新时间显示
    playedTime.textContent = formatTime(audio.currentTime);

    // 更新进度条
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.style.setProperty('--progress', `${progress}%`);
  }

  // 定义音频结束处理函数
  function handleAudioEnded() {
    console.log('音频播放结束，当前播放模式:', playMode); // 调试信息
    console.log('当前歌曲索引:', currentIndex); // 调试信息

    // 确保在操作之前将音频当前时间设置为0
    audio.currentTime = 0;

    if (playMode === 0) { // 顺序播放
      console.log('顺序播放模式'); // 调试信息
      // 如果是最后一首歌，不自动播放下一首
      if (currentIndex < playlist.length - 1) {
        console.log('不是最后一首歌，播放下一首'); // 调试信息
        playNext();
      } else {
        console.log('是最后一首歌，停止播放'); // 调试信息
        isPlaying = false;
        playPauseBtn.style.backgroundImage = 'url(./img/继续播放.png)';
        recordImg.style.animationPlayState = 'paused';
      }
    } else if (playMode === 1) { // 循环播放
      console.log('循环播放模式，重新播放当前歌曲'); // 调试信息
      // 重新播放当前歌曲
      playMusic();
    } else if (playMode === 2) { // 随机播放
      console.log('随机播放模式，播放下一首'); // 调试信息
      // 直接生成随机索引，不依赖playNext函数
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * playlist.length);
      } while (newIndex === currentIndex && playlist.length > 1);
      console.log('随机选择的新索引:', newIndex); // 调试信息
      currentIndex = newIndex;
      loadCurrentSong();
      playMusic();
    }
  }

  // 添加事件监听器
  audio.addEventListener('timeupdate', updateProgress);
  audio.addEventListener('ended', handleAudioEnded);
}

// 格式化时间为 mm:ss
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60); // 确保只显示整数秒
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// 进度条点击跳转和拖动
function seekProgress(e) {
  const rect = progressBar.getBoundingClientRect();
  let x = e.clientX - rect.left;

  // 确保x在有效范围内
  x = Math.max(0, Math.min(x, rect.width));

  const percentage = (x / rect.width) * 100;

  // 更新进度条
  progressBar.style.setProperty('--progress', `${percentage}%`);

  // 更新真实音频的播放位置
  const seekTime = (percentage / 100) * audio.duration;
  audio.currentTime = seekTime;
  playedTime.textContent = formatTime(seekTime);
}

// 进度条拖动功能
function enableProgressDrag() {
  let isDragging = false;

  // 鼠标按下事件
  progressBar.addEventListener('mousedown', (e) => {
    isDragging = true;
    seekProgress(e);
  });

  // 鼠标移动事件
  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      seekProgress(e);
    }
  });

  // 鼠标释放事件
  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
}

// 播放MV
function playMV() {
  // 保存音乐播放状态
  const wasPlaying = isPlaying;

  // 如果音乐正在播放，暂停音乐
  if (wasPlaying) {
    pauseMusic();
  }

  const song = playlist[currentIndex];
  const videoUrl = song.video;

  console.log('播放MV:', videoUrl); // 调试信息

  // 先检查是否已有视频弹窗存在，如果有则移除
  const existingModal = document.querySelector('.mv-modal');
  if (existingModal) {
    existingModal.remove();
  }

  // 创建视频播放弹窗
  const mvModal = document.createElement('div');
  mvModal.className = 'mv-modal';

  // 先添加到DOM，确保能正确计算尺寸
  document.body.appendChild(mvModal);

  // 设置基本样式
  mvModal.style.position = 'fixed';
  mvModal.style.top = '0';
  mvModal.style.left = '0';
  mvModal.style.width = '100%';
  mvModal.style.height = '100%';
  mvModal.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
  mvModal.style.display = 'flex';
  mvModal.style.justifyContent = 'center';
  mvModal.style.alignItems = 'center';
  mvModal.style.zIndex = '3000';
  mvModal.style.overflow = 'hidden';

  // 创建视频容器
  const mvContent = document.createElement('div');
  mvContent.className = 'mv-modal-content';
  mvContent.style.position = 'relative';
  mvContent.style.width = '80%';
  mvContent.style.maxWidth = '900px';
  mvContent.style.maxHeight = '80vh';
  mvModal.appendChild(mvContent);

  // 创建关闭按钮
  const closeBtn = document.createElement('span');
  closeBtn.className = 'close-mv';
  closeBtn.innerHTML = '&times;';
  closeBtn.style.position = 'absolute';
  closeBtn.style.top = '-30px';
  closeBtn.style.right = '0';
  closeBtn.style.color = 'white';
  closeBtn.style.fontSize = '2rem';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.zIndex = '3001';
  closeBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  closeBtn.style.borderRadius = '50%';
  closeBtn.style.width = '40px';
  closeBtn.style.height = '40px';
  closeBtn.style.display = 'flex';
  closeBtn.style.justifyContent = 'center';
  closeBtn.style.alignItems = 'center';
  closeBtn.style.lineHeight = '1';
  mvContent.appendChild(closeBtn);

  // 创建视频元素
  const video = document.createElement('video');
  video.id = 'mv-video';
  video.controls = true;
  video.autoplay = true;
  video.style.width = '100%';
  video.style.height = 'auto';
  video.style.display = 'block';
  video.style.maxHeight = '80vh';
  video.style.objectFit = 'contain'; // 确保视频内容完整显示

  // 创建视频源
  const source = document.createElement('source');
  source.src = videoUrl;
  source.type = 'video/mp4';
  video.appendChild(source);

  // 添加视频元素
  mvContent.appendChild(video);

  // 确保视频加载并播放
  video.addEventListener('loadedmetadata', () => {
    console.log('视频元数据加载完成');
    console.log('视频宽度:', video.videoWidth);
    console.log('视频高度:', video.videoHeight);
  });

  video.addEventListener('playing', () => {
    console.log('视频开始播放');
  });

  video.addEventListener('error', (e) => {
    console.error('视频播放错误:', e);
    // 移除提示框，只在控制台显示错误
  });

  // 直接调用load和play，不使用setTimeout
  try {
    video.load();
    video.play().catch(error => {
      console.error('视频自动播放失败:', error);
      // 自动播放失败时，不阻止用户手动播放
    });
  } catch (error) {
    console.error('视频播放异常:', error);
  }

  // 关闭MV
  closeBtn.addEventListener('click', () => {
    try {
      video.pause();
      video.src = ''; // 清空视频源，释放资源
    } catch (error) {
      console.error('关闭视频时出错:', error);
    }
    mvModal.remove();

    // 恢复音乐播放状态
    if (wasPlaying) {
      playMusic();
    }
  });

  // 点击弹窗外部关闭
  mvModal.addEventListener('click', (e) => {
    if (e.target === mvModal) {
      closeBtn.click();
    }
  });
}

// 绑定事件
function bindEvents() {
  // 播放/暂停按钮
  playPauseBtn.addEventListener('click', togglePlayPause);

  // 上一首按钮
  beforeMusicBtn.addEventListener('click', playPrevious);

  // 下一首按钮
  nextMusicBtn.addEventListener('click', playNext);

  // 播放模式按钮
  playModeBtn.addEventListener('click', togglePlayMode);

  // 音量按钮
  volumnBtn.addEventListener('click', toggleVolume);

  // 音量滑块
  volumnTogger.addEventListener('input', (e) => {
    e.stopPropagation(); // 阻止事件冒泡
    adjustVolume(e);
  });

  // 倍速按钮
  speedBtn.addEventListener('click', toggleSpeedMenu);

  // 倍速选项
  const speedOptions = document.querySelectorAll('.speed-option');
  speedOptions.forEach(option => {
    option.addEventListener('click', () => {
      // 移除所有选项的active类
      speedOptions.forEach(opt => opt.classList.remove('active'));
      // 添加当前选项的active类
      option.classList.add('active');
      // 设置播放速度
      const speed = parseFloat(option.dataset.speed);
      audio.playbackRate = speed;
      currentSpeed = speed;
      // 更新速度按钮显示
      speedBtn.textContent = `${speed}X`;
      // 关闭速度菜单
      speedMenu.classList.remove('active');
      console.log('设置播放速度:', speed);
    });
  });

  // 列表按钮
  listBtn.addEventListener('click', togglePlaylist);

  // 关闭播放列表按钮
  closePlaylistBtn.addEventListener('click', closePlaylist);

  // MV按钮
  const mvBtn = document.getElementById('MV');
  mvBtn.addEventListener('click', playMV);

  // 点击播放列表外部关闭
  document.addEventListener('click', (e) => {
    if (!playlistElement.contains(e.target) && e.target !== listBtn) {
      playlistElement.classList.remove('active');
    }

    if (!speedMenu.contains(e.target) && e.target !== speedBtn) {
      speedMenu.classList.remove('active');
    }
  });

  // 进度条点击
  progressBar.addEventListener('click', seekProgress);

  // 启用进度条拖动功能
  enableProgressDrag();

  // 空格快捷键播放/暂停
  document.addEventListener('keydown', (e) => {
    // 确保不在输入框等元素中按下空格
    if (e.code === 'Space' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
      e.preventDefault(); // 阻止页面滚动
      togglePlayPause();
    }
  });
}

// 添加CSS动画和倍速菜单样式
const style = document.createElement('style');
style.textContent = `
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .progress::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background-color: #1db954;
    width: var(--progress, 0%);
    transition: width 0.1s linear;
  }
  
  .progress::before {
    content: '';
    position: absolute;
    top: 50%;
    left: var(--progress, 0%);
    width: 12px;
    height: 12px;
    background-color: #fff;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: opacity 0.2s, left 0.1s linear;
  }
  
  /* 倍速选择菜单样式 */
  .speed-menu {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 10px;
    border-radius: 5px;
    display: none;
    z-index: 2000;
  }
`;
document.head.appendChild(style);

// 页面加载完成后初始化播放器
document.addEventListener('DOMContentLoaded', initPlayer);