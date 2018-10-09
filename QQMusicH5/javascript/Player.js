(function(window){
	function Player($audio){
		return new Player.prototype.init($audio);
	}
	Player.prototype = {
		constructor:Player,
		musicList:[],
		init:function($audio) {
			this.$audio = $audio;
			this.audio = $audio.get(0);
		},
		currentIndex:-1,
		playMusic:function(index,music) {
			if (this.currentIndex == index) {
				if (this.audio.paused) {
					this.audio.play();
				}else{
					this.audio.pause();
				}
			}else{
				this.$audio.attr("src",music.song_url);
				this.audio.play();
				this.currentIndex = index;
			}
		},
		preIndex:function() {
			var index = this.currentIndex - 1;
			if (index < 0) {
				index = this.musicList.length - 1;
			}
			return index;
		},
		nextIndex:function() {
			var index = this.currentIndex + 1;
			if (index >= this.musicList.length) {
				index = 0;
			}
			return index;
		},
		musicDuration:function() {
			var time = this.audio.duration;
			var minu = parseInt(time / 60);
			if (minu < 10) {
				minu = "0" + minu;
			}
			var sec = parseInt(time % 60);
			if (sec < 10) {
				sec = "0" + sec;
			}
			return (minu+":"+sec);
		},
		musicCurrentTime:function() {
			var time = this.audio.currentTime;
			var minu = parseInt(time / 60);
			if (minu < 10) {
				minu = "0" + minu;
			}
			var sec = parseInt(time % 60);
			if (sec < 10) {
				sec = "0" + sec;
			}
			return (minu+":"+sec);
		},
		musicProgress:function(duration,currentTime) {
			var value = this.audio.currentTime / this.audio.duration * 100;
			return value;
		},
		musicLry:[],
		musicLry_time:[],
	}
	Player.prototype.init.prototype = Player.prototype;
	window.Player = Player;
})(window);