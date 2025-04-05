document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('mainVideo');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const muteBtn = document.getElementById('muteBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const videoProgress = document.getElementById('videoProgress');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const speedBtn = document.getElementById('speedBtn');
    const qualityBtn = document.getElementById('qualityBtn');
    const playlistItems = document.querySelectorAll('.playlist-item');
    const bufferBar = document.querySelector('.buffer-bar');

    // التشغيل التلقائي مع إعادة المحاولة عند الفشل
    function attemptAutoplay() {
        const promise = video.play();
        
        if (promise !== undefined) {
            promise.catch(error => {
                video.muted = true;
                video.play();
            });
        }
    }

    // تهيئة الفيديو
    function initVideo() {
        video.autoplay = true;
        video.muted = false;
        video.loop = false;
        
        // إعداد مصادر الفيديو من قائمة التشغيل
        const activeItem = document.querySelector('.playlist-item.active');
        if (activeItem) {
            video.src = activeItem.dataset.video;
            video.poster = activeItem.dataset.poster;
        }
        
        attemptAutoplay();
    }

    // تحديث وقت التشغيل والمدة
    function updateTime() {
        currentTimeEl.textContent = formatTime(video.currentTime);
        videoProgress.value = (video.currentTime / video.duration) * 100;
    }

    function updateDuration() {
        durationEl.textContent = formatTime(video.duration);
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // التحكم في التشغيل والإيقاف
    function togglePlayPause() {
        if (video.paused) {
            video.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            video.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    }

    // التحكم في الصوت
    function toggleMute() {
        video.muted = !video.muted;
        muteBtn.innerHTML = video.muted ? 
            '<i class="fas fa-volume-mute"></i>' : 
            '<i class="fas fa-volume-up"></i>';
        volumeSlider.value = video.muted ? 0 : video.volume;
    }

    // تغيير مستوى الصوت
    function setVolume() {
        video.volume = volumeSlider.value;
        video.muted = volumeSlider.value == 0;
        muteBtn.innerHTML = video.muted ? 
            '<i class="fas fa-volume-mute"></i>' : 
            '<i class="fas fa-volume-up"></i>';
    }

    // تغيير مكان التشغيل في الفيديو
    function setVideoProgress() {
        video.currentTime = (videoProgress.value * video.duration) / 100;
    }

    // تحديث شريط التحميل
    function updateBufferBar() {
        if (video.buffered.length > 0) {
            const bufferedEnd = video.buffered.end(video.buffered.length - 1);
            bufferBar.style.width = (bufferedEnd / video.duration) * 100 + '%';
        }
    }

    // ملء الشاشة
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            video.requestFullscreen().catch(err => {
                alert(`خطأ في ملء الشاشة: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }

    // تغيير سرعة التشغيل
    function changeSpeed() {
        let newSpeed = video.playbackRate + 0.25;
        if (newSpeed > 2) newSpeed = 0.5;
        video.playbackRate = newSpeed;
        speedBtn.textContent = newSpeed + 'x';
    }

    // تغيير الفيديو من قائمة التشغيل
    function changeVideo() {
        playlistItems.forEach(item => item.classList.remove('active'));
        this.classList.add('active');
        
        video.src = this.dataset.video;
        video.poster = this.dataset.poster;
        video.load();
        attemptAutoplay();
    }

    // الأحداث
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('progress', updateBufferBar);
    video.addEventListener('ended', () => {
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    });
    video.addEventListener('click', togglePlayPause);
    
    playPauseBtn.addEventListener('click', togglePlayPause);
    muteBtn.addEventListener('click', toggleMute);
    volumeSlider.addEventListener('input', setVolume);
    videoProgress.addEventListener('input', setVideoProgress);
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    speedBtn.addEventListener('click', changeSpeed);
    
    playlistItems.forEach(item => {
        item.addEventListener('click', changeVideo);
    });

    // تهيئة الفيديو عند التحميل
    initVideo();
});