// 1.render songs
// 2.Scroll,
// 3.Play/pause/seek
// 4.CD rotate 
// 5. Next / Prev
// 6. Random
// 7. Next / Repeat when end
// 8. Acitive Song
// 9. Scroll song when in to view
// 10. Play song when click
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const playlist = $('.playlist');
const cd = $('.cd');

const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('audio');
const playbtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random')
const RepeatBtn =$('.btn-repeat');

const app = {
    // lấy ra chỉ mục đầu tiên của mảng
    currenindex : 0,
    isPlay : false,
    isRandom : false,
    isRepeat : false,
    isAdd : false,
    isHeart : false,
    defiProperties : function(){
        Object.defineProperty(this,'currentSong',{
            get : function(){
                return this.songs[this.currenindex];
            }
        });
        Object.defineProperty(this,'songlist',{
          get : function(){
            return $$('.song');
          }
      })
    },
    //hàm render song
    render : function(){
            const html = this.songs.map((song,index)=>{
            return ` 
            <div class="song">
            <div class="thumb" style="background-image: url(${song.image})">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option num${index}">
              <i class="far fa-heart"></i>
            </div>
          </div>`
        });
        playlist.innerHTML = html.join('');
    },
   
    handlseaddActice : function (){
      const songlist = $$('.song');
        if(this.isAdd){
          this.isAdd = false;
          $('.song.active').classList.remove('active')
        }else{
          this.isAdd = true
          songlist[app.currenindex].classList.add('active');
        }
     },
    handlerevents: function(){
        const currentWidth = cd.offsetWidth;
        const songlist = $$('.song')
        const optionBtn = $('.option')
        // Xử lý cho đĩa quay

     const cdThumbanimation = cdThumb.animate([
      {transform : 'rotate(360deg)'},
    ],{
      duration : 10000,
      iterations: Infinity
    })
    cdThumbanimation.pause();

// xử lý add class active vào song
  
    
    // xử lý khi scroll

        document.onscroll = function(){
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const newWidth = currentWidth - scrollTop;
        cd.style.width = newWidth > 0 ?  newWidth + 'px' : 0 ;  
        cd.style.opacity = newWidth / currentWidth;
        }

    //Xử lý khi click play 
        playbtn.onclick = function(){
            if(app.isPlay === true){
              audio.pause();

            }else{
              audio.play();
            }
        }
        //khi song được play
          audio.onplay = function(){
            app.isPlay = true;
            player.classList.add('playing');
            cdThumbanimation.play()

         }

         //khi song bị pause
         audio.onpause = function(){
          app.isPlay = false;
          player.classList.remove('playing');
          cdThumbanimation.pause()
       }
       //khi song bị thay đổi 
       audio.ontimeupdate = function(){
         if(audio.duration){
           const progressCurrent = Math.floor(audio.currentTime / audio.duration * 100);
           progress.value = progressCurrent;
         }
       }

       //  xử lý Tua song 
       progress.onchange = function(){
           const seekTime = ( audio.duration / 100) * progress.value;   
           console.log(seekTime)
           audio.currentTime = seekTime;
       }
       //xử lý next bài hát
       nextBtn.onclick = function(){
         if(app.isRandom === true){
           app.playRandom();
         }else{
          app.NextSong();
        }
        audio.play()
        app.handlseaddActice();
        app.scroolToActiveSong();

      }
      
      //  Xử lý lùi bài hát 
       prevBtn.onclick = function(){
         if(app.isRandom === true){
           app.playRandom();
         }else{
        app.PrevSong();
         }
        audio.play();
        app.handlseaddActice();
        app.scroolToActiveSong();


      }
      // xử lý bật tắt ngẫu nhiên
      randomBtn.onclick = function(){
          if(app.isRandom === true){
              app.isRandom = false;
              randomBtn.classList.remove('active');
          }else{
              app.isRandom = true;
              randomBtn.classList.add('active')
          } 
      }
      //xử lý khi bài hát kết thúc 
        audio.onended = function(){
          if(app.isRepeat === true){
             audio.play();
          }else{
            nextBtn.click();
          }
        }
        // xử lý khi bật lặp lại 
        RepeatBtn.onclick = function(){
            if(app.isRepeat === true){
              app.isRepeat =false;
              RepeatBtn.classList.remove('active');
            }else{
              app.isRepeat = true ;
              RepeatBtn.classList.add('active');
            }
        }

        //Xử lý khi nhấn vào song 
        this.songlist.forEach((song,index)=> {
            song.onclick = function(e){
             const songNode = e.target.closest('.song:not(.active)');
             const optionNode = e.target.closest('.option');
                if(songNode && !optionNode){
                  if(songNode){
                    $('.song.active').classList.remove('active');
                    song.classList.add('active')
                    app.currenindex = index;
                    heading.textContent = app.currentSong.name ;
                    cdThumb.style.backgroundImage =`url('${app.currentSong.image}')`;
                    audio.src = app.currentSong.path;
                    audio.play() 
                  }
                }
                 if(optionNode){
                    if(app.isHeart){
                      app.isHeart = false;
                      $('.option.num'+index+ ' i').style.color = "#999";
                    }else{
                      app.isHeart = true;
                      console.log(app.isHeart)
                      $('.option.num'+index+ ' i').style.color = "#dd869d";
                    }

                }
            }
        });
    },
    scroolToActiveSong : function(){
       setTimeout(() => {
        $('.song.active').scrollIntoView(
          {
            behavior : "smooth",
            block : "center",
            inline : "center"
          }
        )
       }, 200);
    }, 
      // load trang hiện tại 
      loadCurrentSong : function(){
        heading.textContent = this.currentSong.name ;
        cdThumb.style.backgroundImage =`url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
        app.handlseaddActice();
      },

      // next Bài hát
      NextSong : function(){
        this.currenindex++;
        if(this.currenindex >= this.songs.length){
        this.currenindex = 0;
        }
        this.loadCurrentSong()
        // app.scrollToActiveSong();
      },
      //lùi bài hát
      PrevSong : function(){
        this.currenindex--;
        if(this.currenindex < 0){
        this.currenindex = this.songs.length -1 ;
        }
        this.loadCurrentSong()
        // app.scrollToActiveSong();

      },
      //khi bật random
      playRandom : function(){

          let newIndex ;
          do{
            newIndex =Math.floor(Math.random() * this.songs.length)
          }while(newIndex === this.currenindex);
          this.currenindex = newIndex;
          this.loadCurrentSong();
      },
    songs: [
        {
          name: "Nevada",
          singer: "Vicetone; Cozi Zuehlsdorff",
          path: "./Music/Nevada\ -\ Vicetone_\ Cozi\ Zuehlsdorff.mp3",
          image: "data:image/jpeg;base64,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"
        },
        {
          name: "Lạc",
          singer: "Lạc - Rhymastic",
          path: "./Music/Lac-Rhymastic-2729471.mp3",
          image:
            "data:image/jpeg;base64,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"
        },
        {
          name: "Tu Phir Se Aana",
          singer: "Raftaar x Salim Merchant x Karma",
          path: "./Music/Tu\ Phir\ Se\ Aana\ -\ Raftaar.mp3",
          image:
            "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"
        },
        {
          name: "Naachne Ka Shaunq",
          singer: "Raftaar x Brobha V",
          path:
            "./Music/Naachne\ Ka\ Shaunq-Brodha\ V-VlcMusic.CoM.mp3",
          image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg"
        },
        {
          name: "Mantoiyat",
          singer: "Raftaar x Nawazuddin Siddiqui",
          path: "./Music/Mantoiyat\ Mp3\ Song\ From\ Manto\ Movie\ By\ Raftaar.mp3",
          image:
            "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg"
        },
        {
          name: "Aage Chal",
          singer: "Raftaar",
          path: "./Music/Aage\ Chal\ -\ Raftaar\ 320\ Kbps.mp3",
          image:
            "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg"
        },
        {
          name: "Damn",
          singer: "Raftaar x kr$na",
          path:
            "./Music/Damn-UKISS-4863700.mp3",
          image:
            "data:image/jpeg;base64,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"
        },
        {
          name: "Feeling You",
          singer: "Raftaar x Harjas",
          path: "./Music/Feelingyou-Tiffany_mns8.mp3",
          image:
            "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp"
        }
      ],
    start : function(){
        // Định nghĩa các thuộc tính trong Object
        this.defiProperties();
        // gọi hàm render
       this.render();
       //Tải bài hát hiện tại vào Ui khi chạy ứng dụng 
       this.loadCurrentSong()
       //xử lý Event
       this.handlerevents();
    }
}
    app.start()