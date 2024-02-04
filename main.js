const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $('header h2');
const thumbnail = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const cdThumb = $('.cd-thumb');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');
const volume = $('#volumeSlider');
const download = $('#download');
var volumeIcon = document.querySelector(".volume-control i");
const startTime = $('.current-time');
const endTime = $('.end-time');


// console.log(e);

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    
    const formattedTime = `${minutes}:${remainderSeconds.toString().padStart(2, '0')}`;
    return formattedTime;
}

const app = {
    isPLaying: false,
    isRandom: false,
    isRepeat: false,
    currentIndex: 0,

    songs: [
        {
            name: "Jonathan Joestar Theme Song ",
            singer: "DIOOOOOO",
            path: "./assets/music/jonathan.mp3",
            img: "./assets/img/jonathan.jpg"
        },
        {
            name: "Joseph Joestar Theme Song ",
            singer: "Caesar Zeppeli",
            path: "./assets/music/joseph.mp3",
            img: "./assets/img/joseph.jpg"
        },
        {
            name: "Pillar Man Theme Song ",
            singer: "Lisa Lisa",
            path: "./assets/music/pillar_man.mp3",
            img: "./assets/img/pillar_man.jpg"
        },
        {
            name: "Kujo Jotaro Theme Song ",
            singer: "Star Platinum",
            path: "./assets/music/jotaro.mp3",
            img: "./assets/img/jotaro.jpg"
        },
        {
            name: "Josuke Higashikata Theme Song ",
            singer: "Crazy Diamond",
            path: "./assets/music/josuke.mp3",
            img: "./assets/img/josuke.jpg"
        },
        {
            name: "Yoshikage Kira Theme Song ",
            singer: "Killer Queen",
            path: "./assets/music/kira.mp3",
            img: "./assets/img/kira.jpg"
        },
        {
            name: "Giorno Giovanna Theme Song ",
            singer: "Gold Experience",
            path: "./assets/music/giorno.mp3",
            img: "./assets/img/giorno.jpg"
        },
        {
            name: "Torture Dance Song",
            singer: "Huda - Đậm tình miền Trung",
            path: "./assets/music/gang.mp3",
            img: "./assets/img/gang.jpg"
        },
        {
            name: "Jolyne Cujoh Theme Song ",
            singer: "Stone Free",
            path: "./assets/music/jolyne.mp3",
            img: "./assets/img/jolyne.jpg"
        },
        {
            name: "Enrico Pucci Theme Song ",
            singer: "Made in Heaven",
            path: "./assets/music/pucci.mp3",
            img: "./assets/img/pucci.jpg"
        },
    ],

    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index=${index}>
                <div class="thumb"
                    style="background-image: url('${song.img}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                <i class="fa fa-download" aria-hidden="true"></i>
                    <a class= "download" href = "" download = "" data-index = ${index}>  
                        <i class="fa-light fa-arrow-down-to-line"></i>
                    </a>
                </div>
            </div>
            `;
        });

        playlist.innerHTML = htmls.join('');
        
       
    },

    handleEvent: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;
        

        // CUỘN 
        document.onscroll = () => {
            const scrollTop = document.documentElement.scrollTop;
            const newcdWidth = cdWidth - scrollTop;

            if (newcdWidth < 0) {
                cd.style.width = 0 + 'px';
            } else {
                cd.style.width = newcdWidth + 'px';
            }

            // cd.style.opacity = (cdWidth / scrollTop) ;

        }

        // PLAY
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        // Phát
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
            myCD.play();
        }

        // Dừng
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
            myCD.pause();
            
        }

        // Thanh trạng thái
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const duration = Math.floor(audio.currentTime / audio.duration * 100);
                // console.log(duration);
                progress.value = duration;

                startTime.textContent = formatTime( Math.floor(audio.currentTime) );
                endTime.textContent = formatTime( Math.floor(audio.duration) );
            }
        }

        //Tua
        progress.oninput = function () {
            audio.currentTime = progress.value / 100 * audio.duration;
        }

        // PREV
        const prevBtn = $('.btn-prev');
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandom();
            } else {
                _this.currentIndex--;
                // Nếu tại vị trí đầu tiên bấm prev sẽ đến bài cuối
                if (_this.currentIndex < 0) {
                    _this.currentIndex = _this.songs.length - 1;
                }
                _this.loadSong();
                audio.play();
            }
            _this.render();
            _this.scrollToActiveSong();

        }

        // NEXT
        const nextBtn = $('.btn-next');
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandom();
            } else {
                _this.currentIndex++;
                //Nếu tại vị trí cuối bấm next sẽ đến bài đầu tiên
                if (_this.currentIndex >= _this.songs.length) {
                    _this.currentIndex = 0;
                }
                _this.loadSong();
                audio.play();
            }
            _this.render();
            _this.scrollToActiveSong();

        }

        // Quay đĩa
        const myCD = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 20000,
            iterations: Infinity,
        });
        myCD.pause();

        // Random
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        // Repeat
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        // Tự động chuyển bài khi hết
        audio.onended = function () {
            if (_this.isRepeat) {
                _this.loadSong();
                audio.play();
            } else {
                nextBtn.click();
            }
        }

        // Chọn bài
        playlist.onclick = function (e) {
            const mySong = e.target.closest('.song:not(.active)');
            const optionIcon = e.target.closest('.option');
        
            if (mySong || optionIcon) {
                if (mySong) {
                    _this.currentIndex = Number(mySong.dataset.index);
                    _this.loadSong();
                    _this.render();
                    audio.play();
                }
        
                if (optionIcon) {
                    const songIndex = optionIcon.parentElement.dataset.index;
                    const song = _this.songs[songIndex];
                    const link = document.createElement('a');
                    link.href = song.path;
                    link.download = `${song.name}.mp3`;
                    link.click();
                }
            }
        }
        

        // Điều chỉnh volume
        volume.oninput = function () {
            var currentVolume = volume.value / 100;
            
            // Điều chỉnh âm lượng của audio
            audio.volume = currentVolume;
        
            // Kiểm tra nếu âm lượng là 0, thay đổi biểu tượng volume
            if (currentVolume === 0) {
                volumeIcon.classList.remove("fa-volume-down");
                volumeIcon.classList.remove("fa-volume-up");

                volumeIcon.classList.add("fa-volume-off");
            } else if (currentVolume >0 && currentVolume <= 0.5){
                volumeIcon.classList.remove("fa-volume-off");
                volumeIcon.classList.remove("fa-volume-up");
                volumeIcon.classList.add("fa-volume-down");
            } else {
                volumeIcon.classList.remove("fa-volume-down");
                volumeIcon.classList.remove("fa-volume-off");

                volumeIcon.classList.add("fa-volume-up");
            }
        };

        // Hiện thời gian đang phát
     


    },

    scrollToActiveSong: function () {
        setTimeout(function () {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: (this.currentSong > 3) ? 'nearest' : 'center',
            });

        }, 300);
    },

    loadSong: function () {
        heading.textContent = this.currentSong.name;
        thumbnail.style.backgroundImage = `url(${this.currentSong.img})`;
        audio.src = this.currentSong.path;
       
        //  console.log(heading, thumbnail, audio);

    },


    playRandom: function () {
        const randomIndex = Math.floor(Math.random() * this.songs.length);
        this.currentIndex = randomIndex;
        this.loadSong();
        audio.play();
    },

    defineproperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
    },


    

    start: function () {
        // Định nghĩa các thuộc tính cho object ( song )
        this.defineproperties();

        // Thực hiện các hành động
        this.handleEvent();

        // Load bài hát vào UI
        this.loadSong();

        // Load lại danh sánh playlist
        this.render();
    }
}

app.start();

