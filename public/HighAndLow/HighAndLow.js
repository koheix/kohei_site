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
    //サーバーにhighが押されたことを送信
    socket.emit("HAL_high", "high");
}