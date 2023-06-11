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
    "card_joker.png"
]

//connection
io.on(
    "connection", (socket) =>{
        console.log("connection");

        //disconnection
        socket.on(
            'disconnect', () =>{
                console.log( 'disconnect' );
            } 
        );

        socket.on(
            "HAL_name", (player_name)=>{
                //名前を記録
                player[socket.id] = player_name;
                console.log(player[socket.id]);
                //ターンを決める
                if(cnt == 0){
                    isTurn[socket.id] = 1;
                    cnt++;
                }
                else{
                    isTurn[socket.id] = 0;
                }
            }
        );
        
        //socket.idのプレイヤーのターンかどうかを確認し、そうであれば以下を実行する
        //highボタンがクリックされると次に表示されるトランプの数字と比較して、その前のトランプの数字より大きければ正解、小さければ不正解とする
        //正解の場合は正解と画面に表示し、不正解の場合は不正解と画面に表示する
        //その後、次のトランプを表示する
        

    }
);