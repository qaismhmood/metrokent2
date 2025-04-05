document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('myVideo');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const muteBtn = document.getElementById('muteBtn');
    
    // محاولة التشغيل التلقائي مع إعادة تفعيل الصوت بعد التفاعل
    function tryAutoplay() {
        // البدء بالموسيقى صامتة (مطلوبة للتشغيل التلقائي)
        video.muted = true;
        
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                playPauseBtn.textContent = '❚❚ إيقاف';
                console.log('التشغيل التلقائي يعمل (بصوت صامت)');
                
                // تفعيل زر الكتم لإعادة الصوت
                muteBtn.style.display = 'block';
            })
            .catch(error => {
                console.log('فشل التشغيل التلقائي:', error);
                showPlayButton();
            });
        }
    }
    
    // عرض زر تشغيل كبير إذا فشل التشغيل التلقائي
    function showPlayButton() {
        const playOverlay = document.createElement('div');
        playOverlay.id = 'playOverlay';
        playOverlay.style.position = 'absolute';
        playOverlay.style.top = '0';
        playOverlay.style.left = '0';
        playOverlay.style.width = '100%';
        playOverlay.style.height = '100%';
        playOverlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
        playOverlay.style.display = 'flex';
        playOverlay.style.justifyContent = 'center';
        playOverlay.style.alignItems = 'center';
        playOverlay.style.cursor = 'pointer';
        playOverlay.innerHTML = `
            <button style="
                background: #ff5722;
                color: white;
                border: none;
                padding: 15px 30px;
                font-size: 18px;
                border-radius: 5px;
                cursor: pointer;
            ">اضغط للتشغيل</button>
        `;
        
        video.parentNode.insertBefore(playOverlay, video.nextSibling);
        
        playOverlay.addEventListener('click', function() {
            video.muted = false; // نفتح الصوت عند التفاعل
            video.play()
                .then(_ => {
                    playPauseBtn.textContent = '❚❚ إيقاف';
                    this.remove();
                })
                .catch(e => console.error('فشل التشغيل:', e));
        });
    }
    
    // بدء المحاولة عند تحميل الصفحة
    tryAutoplay();
    
    // تفعيل الصوت عند أول تفاعل مع الصفحة
    function enableSound() {
        document.removeEventListener('click', enableSound);
        document.removeEventListener('touchstart', enableSound);
        
        if (video.muted) {
            video.muted = false;
            muteBtn.textContent = '🔊 صوت';
            console.log('تم تفعيل الصوت بعد التفاعل مع الصفحة');
        }
    }
    
    // استماع لأي تفاعل مع الصفحة لتفعيل الصوت
    document.addEventListener('click', enableSound);
    document.addEventListener('touchstart', enableSound);
    
    // بقية عناصر التحكم...
    muteBtn.addEventListener('click', function() {
        video.muted = !video.muted;
        this.textContent = video.muted ? '🔇 كتم' : '🔊 صوت';
    });
    
    // ... بقية الأكواد كما هي
});