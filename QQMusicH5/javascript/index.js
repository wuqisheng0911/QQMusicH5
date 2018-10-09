$(function(){
	$(".songlist_content").mCustomScrollbar({
		callbacks:{
			whileScrolling:function() {
				$(".mCSB_dragger_bar").css({"background": "rgba(0,0,0,.3)"});
			}
		}
	});
	getSong(showSong);
	var $audio = $("audio");
	var player = new Player($audio);
	// 获取歌单数据
	function getSong(handler) {
		$.get("./../json/song.json",function(data) {
			player.musicList = data;
			if(handler){
				handler(data);
			}
		});
	}
	// 将歌曲展示
	function showSong(data){
		var num = data.length;
		data.forEach(function(item,index) {
			var $li = $("ul.songlist_content-in li:nth-child(2)").clone();
			$li.children("i.song-index").text(index+1);
			$li.children("div.song-name").text(item.song_Name);
			$li.find("span.song-singer a").text(item.singer);
			$li.children("span.song-time").text(item.song_time);
			// 将音乐与li绑定
			$li.get(0).music= item;
			$li.get(0).index= index;
			$("ul.songlist_content-in").append($li);
		});
	}
	// 点击播放按钮事件
	$("ul.songlist_content-in").delegate("a.play-btn","click",function() {
		// 播放按钮状态切换
		$(this).toggleClass("play-song").parents("li").siblings().find("a.play-btn").removeClass("play-song");
		// 播放时动图
		$(this).parents("li").siblings().children("i.song-index").removeClass("current_play");
		// 点击同一播放按钮时
		if($(this).attr("class").indexOf("play-song")!=-1) {
			$(this).parents("li").children("i.song-index").addClass("current_play");
			$(this).parents("li").children("i.song-index,div.song-name").css({opacity:"1"});
			$(this).parents("li").children("span.song-singer").find("a").css({opacity:"1"});
			$(this).parents("li").siblings().children("i.song-index,div.song-name").removeAttr("style");
			$(this).parents("li").siblings().children("span.song-singer").find("a").removeAttr("style");
			$(".play-left-2").addClass("player");
		}else{
			$(this).parents("li").children("i.song-index").removeClass("current_play");
			$(this).parents("li").children("i.song-index,div.song-name").removeAttr("style");
			$(this).parents("li").children("span.song-singer").find("a").removeAttr("style");
			$(".play-left-2").removeClass("player");
		}
		// 点击播放按钮时显示歌曲信息
		var index = $(this).parents("li").get(0).index;
		var music = $(this).parents("li").get(0).music;
		var musicNmae = music.song_Name;
		var musicSinger = music.singer;
		var musicAlbum = music.song_album;
		var musicPhoto = music.song_photo;
		var musicTime = music.song_time;
		$("a.singer-photo img").attr({"src":musicPhoto});
		$(".song_info_name a").text(musicNmae);
		$(".song_info_singer a").text(musicSinger);
		$(".song_info_ablum a").text(musicAlbum);
		$(".player-bar-top a.player-bar-top-song").text(musicNmae);
		$(".player-bar-top i").text("-");
		$(".player-bar-top a.player-bar-top-singer").text(musicSinger);
		$(".player-bar-top span.dru-time").text(musicTime);
		$(".player-bar-top span.partition").text("/");
		$(".player-bar-top span.cur-time").text("00:00");
		$(".bg-main").css({
			"background-image":"url("+musicPhoto+")",
			"filter": "blur(65px)",
		});
		// 点击播放按钮时播放音乐
		player.playMusic(index,music);
		// 底部控件设置
		player.audio.onloadeddata=function() {
			var index = -1;
			Lyr_change();
			// 声音进度条初始
			var vol = player.audio.volume;
			var value = vol / 1 * 100;
			$("div.vol-pro").css("width",value+"%");
			$("span.vol-pro-dot").css("left",value+"%");
			$(".player-bar-top span.dru-time").text(player.musicDuration());
			player.audio.ontimeupdate = function() {
				$(".player-bar-top span.cur-time").text(player.musicCurrentTime());
				// 音乐进度条同步
				$("div.progress").css("width",player.musicProgress()+"%");
				$("span.progress-dot").css("left",player.musicProgress()+"%");
				if (player.audio.currentTime >= player.musicLry_time[0]){
					index ++;
					player.musicLry_time.shift();
					move(index);
				}
			}
		}

		// 歌词处理
		function music_Lyr(handler) {
			var musicLyr = music.song_ly;
			$.get(musicLyr,function(data) {
				if (handler) {
					handler(data);
				}
			},"text");
		}
		function deal(data) {
			var arr = data.split("\n");
			var reg = /^\[(\d*:\d*\.*\d*)\]/;
			var arrTime = [];
			var arrLyr = [];
			arr.forEach(function(item,index){
				var str = item.split("]")[1];
				if (str.length == 1) return true;
				arrLyr.push(str);
				var strT = reg.exec(item);
				if (strT == null) return true;
				var res = strT[1].split(":");
				var min = parseInt(res[0])*60;
				var sec = parseFloat(res[1]);
				var time = parseFloat(Number(min + sec).toFixed(2));
				arrTime.push(time);
				player.musicLry = arrLyr;
				player.musicLry_time = arrTime;
			});
		}
		music_Lyr(deal);
		function Lyr_change(handler) {
			$("ul.lry-in").empty();
			$.each(player.musicLry,function(index,item) {
				$("ul.lry-in").append("<li><span>"+item+"</span></li>");
			})
		}
		function move(index) {
			// if (index<=2) return;
			$(".lry-in").css("margin-top",(-index)*34);
			$(".lry-in li").eq(index).attr({"class":"on"}).siblings().removeClass("on");
		}
	});
	// 底部播放控件事件
	$("a.prev").click(function() {
		$(".songlist_content-in li:gt(1)").eq(player.preIndex()).find("a.play-btn").trigger("click");
	});
	$("a.play-left-2").click(function(){
		if (player.currentIndex == -1) {
			$(".songlist_content-in li:gt(1)").eq(0).find("a.play-btn").trigger("click");
		}else{
			$(".songlist_content-in li:gt(1)").eq(player.currentIndex).find("a.play-btn").trigger("click");
		}
	});
	$("a.next").click(function() {
		$(".songlist_content-in li:gt(1)").eq(player.nextIndex()).find("a.play-btn").trigger("click");
	});
	// 音乐进度点击事件
	$(".player-bar-bottom").click(function(event) {
		var left = $(this).offset().left;
		var value = (event.pageX - left) / $(this).width() * 100;
		$("div.progress").css("width",value+"%");
		$("span.progress-dot").css("left",value+"%");
	});
	// 音乐进度拖拽事件
	$(".player-bar-bottom").mousedown(function() {
		var width = $(this).width();
		var left = $(this).offset().left;
		$(document).mousemove(function(event) {
			var move = event.pageX;
			if (move - left < 0) {
				value = 0;
			}else if (move-left >= width) {
				value = 100; 
			}else{
				value = (move - left) / width * 100;
			}
			$("div.progress").css("width",value+"%");
			$("span.progress-dot").css("left",value+"%");
		});
		$(document).mouseup(function() {
			$(this).off("mousemove");
		});
	});
	// 声音调节点击
	$(".vol-control").click(function(event) {
		var left = $(this).offset().left;
		var value = (event.pageX - left) / $(this).width() * 100;
		$("div.vol-pro").css("width",value+"%");
		$("span.vol-pro-dot").css("left",value+"%");
		// 修改音量
		player.audio.volume = value/100;
	});
	// 声音调节拖拽
	$(".vol-control").mousedown(function() {
		var width = $(this).width();
		var left = $(this).offset().left;
		$(document).mousemove(function(event) {
			var move = event.pageX;
			if (move - left < 0) {
				value = 0;
			}else if (move-left >= width) {
				value = 100; 
			}else{
				value = (move - left) / width * 100;
			}
			$("div.vol-pro").css("width",value+"%");
			$("span.vol-pro-dot").css("left",value+"%");
			// 修改音量
			player.audio.volume = value/100;
		});
		$(document).mouseup(function() {
			$(this).off("mousemove");
		});
	});
	// 选择框
	$("ul.songlist_content-in").delegate("span.check","click",function() {
		$(this).toggleClass("checked");
	});
});