"use strict";

//modules
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const ip = require("ip");

//objects
const app = express();
const server  = http.Server(app);
const io = socketio(server);

const PORT = 5500;
const HOSTNAME = process.env.HOST

//identify public folder
app.use(express.static(__dirname + "/public"));

//start server
server.listen(
    PORT, HOSTNAME,
    () =>
    {
        const HOST = ip.address();
        console.log("Server on  %s:%d", HOST,PORT);
    }
);

//playerの人数
var cnt = 0;
//player array
//2人まで。キーがsocketID, 要素が名前
var player = {};
//キーがsocketID, 要素がターンか否かのブール
var isTurn = {};

//カードの画像の名前を格納した配列
var cards_pic_name = [
    "card_club_01.png", 
    "card_club_02.png",
    "card_club_03.png",
    "card_club_04.png",
    "card_club_05.png",
    "card_club_06.png",
    "card_club_07.png",
    "card_club_08.png",
    "card_club_09.png",
    "card_club_10.png",
    "card_club_11.png",
    "card_club_12.png",
    "card_club_13.png",
    "card_diamond_01.png",
    "card_diamond_02.png",
    "card_diamond_03.png",
    "card_diamond_04.png",
    "card_diamond_05.png",
    "card_diamond_06.png",
    "card_diamond_07.png",
    "card_diamond_08.png",
    "card_diamond_09.png",
    "card_diamond_10.png",
    "card_diamond_11.png",
    "card_diamond_12.png",
    "card_diamond_13.png",
    "card_heart_01.png",
    "card_heart_02.png",
    "card_heart_03.png",
    "card_heart_04.png",
    "card_heart_05.png",
    "card_heart_06.png",
    "card_heart_07.png",
    "card_heart_08.png",
    "card_heart_09.png",
    "card_heart_10.png",
    "card_heart_11.png",
    "card_heart_12.png",
    "card_heart_13.png",
    "card_spade_01.png",
    "card_spade_02.png",
    "card_spade_03.png",
    "card_spade_04.png",
    "card_spade_05.png",
    "card_spade_06.png",
    "card_spade_07.png",
    "card_spade_08.png",
    "card_spade_09.png",
    "card_spade_10.png",
    "card_spade_11.png",
    "card_spade_12.png",
    "card_spade_13.png",
    "card_joker100.png"
]

// //要素がすべて0のcard_pics_name配列の長さの配列
// //カードが使われたかどうかを判定するために使用
// //使用されると1になる
// var cards = new Array(cards_pic_name.length).fill(0);

//現在のカードの種類の名前を格納する変数
var current_card_name = "";
// 現在のカード番号を格納する変数
var current_number = 0;

//connection
io.on(
    "connection", (socket) =>{
        console.log("connection");

        //disconnection
        socket.on(
            'disconnect', () =>{
                console.log( 'disconnect' );
                //playerの人数を減らす
                cnt--;
            } 
        );

        socket.on(
            "HAL_name", (player_name)=>{
                //名前を記録
                player[socket.id] = player_name;
                console.log(player[socket.id]);
                //プレイヤーが二人集まったら何もしない
                if(cnt != 2){
                    //ターンを決める
                    if(cnt == 0){
                        isTurn[socket.id] = 1;
                        cnt++;
                        //一人目の時
                        //現在のカードの種類を決める
                        current_card_name = cards_pic_name[Math.floor(Math.random() * cards_pic_name.length)];
                        // 現在のカードの数字を格納しておく
                        current_number = parseInt(current_card_name.match(/\d+/g)[0], 10);
                        //現在のカードの種類を配列から削除する
                        cards_pic_name.splice(cards_pic_name.indexOf(current_card_name), 1);
                        //ターンであることを知らせる
                        io.to(socket.id).emit("HAL_turn_change", true);
                    }
                    else{
                        cnt++;
                        isTurn[socket.id] = 0;
                    }
                    //HTML上のid = current_cardの画像を変更するため、クライアントに現在のカードの種類を送信する
                    io.to(socket.id).emit("HAL_current_card_name", current_card_name);
                }
            }
        );
        
        //"HAL_pushed"socketが受信されたときの処理
        //まず、プレイヤーが二人集まっているかを確認する
        //そうであれば以下を実行する
        //socket.idのプレイヤーのターンかどうかを確認し、そうであれば以下を実行する
        //current_card_nameを変更する
        //highボタンがクリックされると
        //そのトランプの数字と比較して、その前のトランプの数字より大きければ正解、小さければ不正解とする
        //lowボタンがクリックされると
        //そのトランプの数字と比較して、その前のトランプの数字より小さければ正解、大きければ不正解とする
        //正解の場合は正解と画面に表示し、不正解の場合は不正解と画面に表示する
        //その後、次のトランプを決定する
        //最後にもう一方のプレイヤーのターンにする
        //socket.idのプレイヤーのターンでなければ、その旨を画面に表示する
        socket.on(
            "HAL_pushed", (pushed_button)=>{
                //プレイヤーが二人集まっているかを確認
                if(cnt == 2){
                    //ターンであるかを確認
                    if(isTurn[socket.id] == 1){
                        //正解かどうかを判定するための変数
                        var isCorrect = 0;
                        //next_card_nameを決定する
                        let next_card_name = cards_pic_name[Math.floor(Math.random() * cards_pic_name.length)];
                        //次のカードの種類を配列から削除する
                        cards_pic_name.splice(cards_pic_name.indexOf(next_card_name), 1);
                        //次のカードの数字を、ファイル名から取得する
                        let number = parseInt(next_card_name.match(/\d+/g)[0], 10);
                        //highボタンがクリックされたとき
                        if(pushed_button == "high"){
                            //正解かどうかを判定する
                            if(number >= current_number){
                                isCorrect = 1;
                            }
                        }
                        //lowボタンがクリックされたとき
                        else if(pushed_button == "low"){
                            //正解かどうかを判定する
                            if(number <= current_number){
                                isCorrect = 1;
                            }
                        }
                        //最後に次のカードを現在のカードにする
                        current_card_name = next_card_name;
                        //次のカード番号を現在のカード番号にする
                        current_number = number;
                        //ターンを交代する
                        for (let key in isTurn) {
                            isTurn[key] = 1 - isTurn[key];
                        }                        
                        // //HTML上のid = current_cardの画像を変更するため、全員に現在のカードの種類を送信する
                        // io.sockets.emit("HAL_current_card_name", current_card_name);
                        // // 正解不正解を知らせる
                        // io.sockets.emit("HAL_iscorrect", isCorrect, player[socket.id]);
                        //HAL_current_card_nameが処理された後にHAL_iscorrectが処理されるようにする
                        (async () => {
                            //HTML上のid = current_cardの画像を変更するため、全員に現在のカードの種類を送信する
                            await io.sockets.emit("HAL_current_card_name", current_card_name);
                            // 正解不正解を知らせる
                            await setTimeout(function() {
                                io.sockets.emit("HAL_iscorrect", isCorrect, player[socket.id]);
                            }, 300);
                        })();
                        //HAL_turn_changeを送信する(画面に表示するため)
                        io.sockets.emit("HAL_turn_change", true);
                        io.to(socket.id).emit("HAL_turn_change", false);
                    }
                    //ターンでない場合
                    else{
                        //ターンでないことを知らせる
                        io.to(socket.id).emit("HAL_not_your_turn", "not YOUR turn");
                    }
                }
                //プレイヤーが二人集まっていない場合
                else{
                    console.log("not enough player");
                    //プレイヤーが二人集まっていないことを知らせる
                    io.to(socket.id).emit("HAL_not_enough_player", "not enough player");
                }
            }
        );
    }
);