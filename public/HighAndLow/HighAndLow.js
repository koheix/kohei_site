//connect to server
const socket = io.connect();

//listen "connect"
socket.on(
    "connect", ()=>{
        console.log("connect");
    }
);

function okay_clicked(){
    socket.emit("socketID", "hihi");
    return 5;
}

function ready_clicked(){
    //プレイヤーの名前をinputから取得
    var player_name = $("#player_name").val();
    //プレイヤーの名前をサーバーに送信
    socket.emit("HAL_name", player_name);
    $("#play_page").show();
    $("#ready_page").hide();
    return 5;
}

//highボタンがクリックされると次に表示されるトランプの数字と比較して、その前のトランプの数字より大きければ正解、小さければ不正解とする
//正解の場合は正解と画面に表示し、不正解の場合は不正解と画面に表示する
//その後、次のトランプを表示する
function high_clicked(){
    //サーバにhighが押されたことを送信
    socket.emit("HAL_pushed", "high");
}

//lowボタンについてもhighボタンと同様であるが、サーバにlowが押されたことを送信する
function low_clicked(){
    //サーバにlowが押されたことを送信
    socket.emit("HAL_pushed", "low");
}

//HAL_current_card_nameを受信したときの処理
//カードを表示する
socket.on(
    "HAL_current_card_name", (current_card_name)=>{
        //HTML上のid = current_cardの画像を変更する
        let current_card = document.getElementById("current_card");
        current_card.src = "cards/" + current_card_name;
    }
);

//HAL_turn_changeを受信したときの処理
//ターンをお知らせするテキストをボタンの上に表示する
socket.on(
    "HAL_turn_change", (your_turn)=>{
        //ターンをお知らせするテキストをボタンの上に表示するため、opacityを1にする
        if(your_turn){
            $("#turn_text").css("opacity", 1);
        }
        else{
            $("#turn_text").css("opacity", 0);
        }
    }
);
//HAL_not_your_turnを受信したときの処理
//ターンでないことをアラートでお知らせする
socket.on(
    "HAL_not_your_turn", (not_your_turn)=>{
        alert(not_your_turn);
    }
);

//HAL_iscorrectを受信したときの処理
//正解であれば正解であることをアラートでお知らせする
socket.on(
    "HAL_iscorrect", (is_correct, player_name)=>{
        if (is_correct){
            alert(player_name + "さん　正解!");
        }
        else{
            alert(player_name + "さん　不正解!");
        }
    }
);

//HAL_not_enough_playerを受信したときの処理
//プレイヤーが足りないことをアラートでお知らせする
socket.on(
    "HAL_not_enough_player", (not_enough_players)=>{
        alert(not_enough_players);
    }
);