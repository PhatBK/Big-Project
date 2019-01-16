
(function() {
    var isPlOpen = true;
    var arrowBtn = document.getElementById("arrowBtn");
    var prevBtn = document.getElementById("prevBtn");
    var nextBtn = document.getElementById("nextBtn");
    var saveBtn = document.getElementById("saveBtn");
    var shareBtn = document.getElementById("shareBtn");
    var vjsPlaylist = document.getElementById("vjsPlaylist");



    arrowBtn.addEventListener("click", function(){
        if(isPlOpen == true){
            isPlOpen = false;
            vjsPlaylist.style.display = "none";
            arrowBtn.classList.remove("rotate180");
            $("#video-content").show();
	    $(".dp-sub").hide();

        }else {
            isPlOpen = true;
            vjsPlaylist.style.display = "block";
	    arrowBtn.classList.add("rotate180");
            $("#video-content").hide();
	    $(".dp-sub").show();
        }
    });

    prevBtn.addEventListener("click", function(){
        player_playlist.playlist.previous();
    });

    nextBtn.addEventListener("click", function(){
        player_playlist.playlist.next();
    });



})();