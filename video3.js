document.addEventListener('DOMContentLoaded', function() {
    // عناصر الفيديو والتحكم
    const video = document.getElementById('mainVideo');
    const videoWrapper = document.querySelector('.video-wrapper');
    const initialOverlay = document.querySelector('.initial-overlay');
    const bigPlayBtn = document.querySelector('.big-play-btn');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const progressBar = document.getElementById('progressBar');
    const currentTimeEl = document.getElementById('currentTime');
    const totalTimeEl = document.getElementById('totalTime');
    const muteBtn = document.getElementById('muteBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const speedBtn = document.getElementById('speedBtn');
    const qualityBtn = document.getElementById('qualityBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const qualityMenu = document.getElementById('qualityMenu');
    const speedMenu = document.getElementById('speedMenu');

    // مصادر الفيديو بجودات مختلفة (استبدلها بمصادرك)
    const videoSources = {
        '1080': { src: 'video-1080p.mp4', type: 'video/mp4' },
        '720': { src: 'video-720p.mp4', type: 'video/mp4' },
        '480': { src: 'video-480p.mp4', type: 'video/mp4' },
        'auto': { src: 'video.mp4', type: 'video/mp4' }
    };

    // تهيئة الفيديو
    function initVideo() {
        // تحميل بيانات الفيديو
        video.addEventListener('loadedmetadata', function() {
            totalTimeEl.textContent = formatTime(video.duration);
            progressBar.max = video.duration;
        });

        // تحديث الوقت الحالي
        video.addEventListener('timeupdate', function() {
            currentTimeEl.textContent = formatTime(video.currentTime);
            progressBar.value = video.currentTime;
        });

        // عند انتهاء الفيديو
        video.addEventListener('ended', function() {
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            bigPlayBtn.style.display = 'flex';
        });

        // إمكانية النقر على شريط التقدم
        progressBar.addEventListener('input', function() {
            video.currentTime = progressBar.value;
        });

        // التحكم في الصوت
        volumeSlider.addEventListener('input', function() {
            video.volume = volumeSlider.value;
            video.muted = volumeSlider.value == 0;
            updateMuteButton();
        });

        // تغيير سرعة التشغيل
        speedMenu.querySelectorAll('.speed-option').forEach(option => {
            option.addEventListener('click', function() {
                const speed = this.getAttribute('data-speed');
                video.playbackRate = speed;
                speedBtn.textContent = speed + 'x';
                
                // تحديث الحالة النشطة
                document.querySelector('.speed-option.active').classList.remove('active');
                this.classList.add('active');
                
                speedMenu.classList.remove('active');
            });
        });

        // تغيير جودة الفيديو
        qualityMenu.querySelectorAll('.quality-option').forEach(option => {
            option.addEventListener('click', function() {
                const quality = this.getAttribute('data-quality');
                
                // تحديث الحالة النشطة
                document.querySelector('.quality-option.active').classList.remove('active');
                this.classList.add('active');
                
                // تغيير المصدر إذا لم يكن تلقائي
                if (quality !== 'auto') {
                    changeVideoQuality(quality);
                }
                
                qualityMenu.classList.remove('active');
            });
        });

        // ملء الشاشة
        fullscreenBtn.addEventListener('click', toggleFullscreen);
    }

    // تغيير جودة الفيديو
    function changeVideoQuality(quality) {
        const source = videoSources[quality];
        if (source) {
            const currentTime = video.currentTime;
            const wasPlaying = !video.paused;
            
            video.src = source.src;
            video.load();
            video.currentTime = currentTime;
            
            if (wasPlaying) {
                video.play().catch(e => console.log('خطأ في التشغيل:', e));
            }
        }
    }

    // تبديل التشغيل/الإيقاف
    function togglePlayPause() {
        if (video.paused) {
            video.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            bigPlayBtn.style.display = 'none';
            initialOverlay.classList.add('hidden');
        } else {
            video.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    }

    // تبديل كتم الصوت
    function toggleMute() {
        video.muted = !video.muted;
        updateMuteButton();
    }

    // تحديث زر كتم الصوت
    function updateMuteButton() {
        if (video.muted || video.volume == 0) {
            muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            volumeSlider.value = 0;
        } else {
            muteBtn.innerHTML = '<i class="fas fa-volume-high"></i>';
            volumeSlider.value = video.volume;
        }
    }

    // تبديل ملء الشاشة
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            videoWrapper.requestFullscreen().catch(err => {
                alert(`خطأ في ملء الشاشة: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }

    // تنسيق الوقت
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // أحداث النقر
    bigPlayBtn.addEventListener('click', togglePlayPause);
    playPauseBtn.addEventListener('click', togglePlayPause);
    muteBtn.addEventListener('click', toggleMute);
    qualityBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        qualityMenu.classList.toggle('active');
        speedMenu.classList.remove('active');
    });
    speedBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        speedMenu.classList.toggle('active');
        qualityMenu.classList.remove('active');
    });

    // إغلاق القوائم عند النقر خارجها
    document.addEventListener('click', function(e) {
        if (!qualityBtn.contains(e.target) && !qualityMenu.contains(e.target)) {
            qualityMenu.classList.remove('active');
        }
        
        if (!speedBtn.contains(e.target) && !speedMenu.contains(e.target)) {
            speedMenu.classList.remove('active');
        }
    });

    // تهيئة الفيديو
    initVideo();
});