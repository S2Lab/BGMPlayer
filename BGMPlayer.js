"use strict";
var BGMPlayer={}; // 所有的接口都通过这个调用
(function(){
    // 信息
    BGMPlayer.infos={};
        BGMPlayer.infos.full_name="BGM Player";
        BGMPlayer.infos.version="0.2.1";
        BGMPlayer.infos.author="Firok";
        BGMPlayer.infos.link="https://github.com/S2Lab/BGMPlayer/";
        
    // 各种常量的初始化
    BGMPlayer.consts={};
        // 播放模式
        BGMPlayer.consts.MODE_SIG=1;
        BGMPlayer.consts.MODE_SIG_LOOP=2;
        BGMPlayer.consts.MODE_LIST=3;
        BGMPlayer.consts.MODE_LIST_LOOP=4;

    // 变量域
    BGMPlayer.vars={};
        // 播放模式的初始化
        BGMPlayer.vars.mode=BGMPlayer.consts.MODE_SIG;
        // 播放指针的初始化
        BGMPlayer.vars.pin=new Audio(""); // 播放器指针 指向一个Audio对象
        BGMPlayer.vars.pin.setAttribute("onended","BGMPlayer.funs.Song_AutoNext()");
        // 当前播放的是列表中的第几首
        BGMPlayer.vars.pin_num=-1;
    // 缓冲域
    BGMPlayer.cache={};
        // 当前列表
        BGMPlayer.cache.list=[];
        BGMPlayer.cache.addr_list="";
        BGMPlayer.cache.addr_resource="";

    // 功能域
    BGMPlayer.funs={};
        // 播放相关功能
        BGMPlayer.funs.Song_Play=function(){ // 播放
            if(BGMPlayer.vars.pin_num==-1){ // 尝试播放音乐
                if(BGMPlayer.cache.list.length>0)
                {
                    BGMPlayer.vars.pin_num=0;
                    BGMPlayer.vars.pin.src=BGMPlayer.funs._getSrcLink(0);
                    BGMPlayer.vars.pin.play();
                }
            }
            else
                BGMPlayer.vars.pin.play();
        };
        BGMPlayer.funs.Song_Play_in_list=function(idIn){ // 播放列表中的某个曲目
            if(BGMPlayer.cache.list.length>0 && idIn>=0 && idIn<BGMPlayer.cache.list.length)
            {
                BGMPlayer.vars.pin_num=idIn;
                BGMPlayer.vars.pin.src=BGMPlayer.funs._getSrcLink(idIn);
                BGMPlayer.funs.Song_Play();
            }
        };
        BGMPlayer.funs.Song_Reload=function(){ // 一般不用这个方法
            BGMPlayer.vars.pin.load();
        };
        BGMPlayer.funs.Song_Play_time=function(timeIn){ // 播放选定的时间点
            if(BGMPlayer.vars.pin.duration>0 && timeIn>=0 && timeIn<BGMPlayer.vars.pin.duration)
            {
                BGMPlayer.vars.pin.currentTime=timeIn;
                BGMPlayer.vars.pin.play();
            }
        };
        BGMPlayer.funs.Song_Pause=function(){ // 暂停
            BGMPlayer.vars.pin.pause();
        };
        BGMPlayer.funs.Song_Durration=function(){ // 获取当前曲目的长度
            return BGMPlayer.vars.pin.duration;
        }
        BGMPlayer.funs.Song_AutoNext=function(){ // 根据播放模式选择下一曲
            // 先获取当前播放的是列表中的第几个
            // if(BGMPlayer.vars.pin_num=-1) BGMPlayer.vars.pin_num=0;
            let index=BGMPlayer.vars.pin_num;

            if(index==-1) return;
            if(BGMPlayer.cache.list.length<=0)
                return;

            switch(BGMPlayer.vars.mode){
            case BGMPlayer.consts.MODE_SIG_LOOP: // 单曲循环
                break;

            case BGMPlayer.consts.MODE_LIST:
                if(index>=BGMPlayer.cache.list.length-1)
                    index=-1; // 播放完所有歌曲了 那就不管了
                else if(index>=0 && index<BGMPlayer.cache.list.length-1){
                    index++;
                }
                break;

            case BGMPlayer.consts.MODE_LIST_LOOP:
                if(index>=BGMPlayer.cache.list.length-1)
                    index=0; // 已经播放完所有歌曲 从头开始重播
                else if(index>=0 && index<BGMPlayer.cache.list.length-1){
                    index++;
                }
                break;

            case BGMPlayer.consts.MODE_SIG: // 单曲模式 播放完了就不管了
            default:
                index=-1;
                break;
            }

            if(index>=0){
                BGMPlayer.vars.pin.src=BGMPlayer.funs._getSrcLink(index);
                BGMPlayer.funs.Song_Play(); // 播放下一首音乐
            }

            BGMPlayer.vars.pin_num=index;
        };
        BGMPlayer.funs.Change_Mode=function(){ // 切换到下一个播放模式
            switch(BGMPlayer.vars.mode){
            case BGMPlayer.consts.MODE_SIG:
                BGMPlayer.vars.mode=BGMPlayer.consts.MODE_SIG_LOOP;
                break;
            case BGMPlayer.consts.MODE_SIG_LOOP:
                BGMPlayer.vars.mode=BGMPlayer.consts.MODE_LIST;
                break;
            case BGMPlayer.consts.MODE_LIST:
                BGMPlayer.vars.mode=BGMPlayer.consts.MODE_LIST_LOOP;
                break;
            case BGMPlayer.consts.MODE_LIST_LOOP:
                BGMPlayer.vars.mode=BGMPlayer.consts.MODE_SIG;
                break;
            default:
                BGMPlayer.vars.mode=BGMPlayer.consts.MODE_SIG;
                break;
            }
        };
        BGMPlayer.funs.Set_Vol=function(volIn){ // 设定播放音量
            if(volIn<0 && volIn>1)
                return;
            BGMPlayer.vars.pin.volume=volIn;
        }
        BGMPlayer.funs.Status=function(){ // 播放器状态
            return "位置 : "+(BGMPlayer.vars.pin_num+1)+" / "+BGMPlayer.cache.list.length+
            "\n曲名 : "+BGMPlayer.vars.pin.src+
            "\n时长 : "+BGMPlayer.vars.pin.currentTime+" / "+BGMPlayer.vars.pin.duration+
            "\n模式 : "+BGMPlayer.funs._getModeName(BGMPlayer.vars.mode);
        };
        BGMPlayer.funs.Info=function(){ // 播放器信息
            return "BGMPlayer 0.1.0\nauthor: Firok";
        };

        BGMPlayer.funs._getModeName=function(mode){
            switch(mode){
            case BGMPlayer.consts.MODE_SIG:
                return "单曲";
            case BGMPlayer.consts.MODE_SIG_LOOP:
                return "单曲循环";
            case BGMPlayer.consts.MODE_LIST:
                return "列表";
            case BGMPlayer.consts.MODE_LIST_LOOP:
                return "列表循环";
            default:
                return "错误的播放模式";
            }
        }
        BGMPlayer.funs._getSrcLink=function(idIn){
            if(BGMPlayer.cache.list.length>0 && idIn>=0 && idIn<BGMPlayer.cache.list.length){
                return BGMPlayer.cache.addr_resource+BGMPlayer.cache.list[idIn];
            }
            else
                return "";
        }
        BGMPlayer.funs._setCookie=function(cname,cvalue,exdays){
            var d = new Date();
            d.setTime(d.getTime()+(exdays*24*60*60*1000));
            var expires = "expires="+d.toGMTString();
            document.cookie = cname+"="+cvalue+"; "+expires;
        }
        BGMPlayer.funs._setCookie=function(cname,cvalue){
            document.cookie = cname+"="+cvalue+";";
        }
        BGMPlayer.funs._delCookie=function(cname){
            ;
            document.cookie=cname+"= ;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
        BGMPlayer.funs._getCookie=function(cname){
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i=0; i<ca.length; i++) {
                var c = ca[i].trim();
                if (c.indexOf(name)==0) { return c.substring(name.length,c.length); }
            }
            return "";
        }

        // 数据
        BGMPlayer.funs.Init=function(){ // 清空缓冲区所有内容 初始化所有状态
            BGMPlayer.funs.Song_Pause(); // 如果有正在播放的音乐 停止
            BGMPlayer.vars.pin.src="";
            BGMPlayer.vars.pin_num=-1;
            BGMPlayer.cache.list=[];
            BGMPlayer.cache.addr_list="";
            BGMPlayer.cache.addr_resource="";

            BGMPlayer.vars.mode=BGMPlayer.consts.MODE_SIG;
        };
        BGMPlayer.funs.Init_from_network=function(addr_listIn,addr_resourceIn){ // 从网络初始化
            BGMPlayer.funs.Init();
            if(addr_listIn==null||addr_resourceIn==null) return; // 检查可用性
            BGMPlayer.cache.addr_list=addr_listIn;
            BGMPlayer.cache.addr_resource=addr_resourceIn;
            // 开始读取列表信息
            let list_get=$.get(addr_listIn,"",function(){
                list_get=list_get.responseText;

                BGMPlayer.cache.list=list_get.split(" "); // 读取到的列表信息整理为str数组
            });
            if(BGMPlayer.cache.list.length>0){
                BGMPlayer.vars.pin.src=BGMPlayer.cache.addr_resource+BGMPlayer.cache.list[0];
            }
        };
        BGMPlayer.funs.Init_from_cookie=function(){ // 从cookie初始化
            BGMPlayer.funs.Init();
            BGMPlayer.funs.Data_read_cookie();
        };
        BGMPlayer.funs.Data_write_cookie=function(){ // 写入cookie
            let data_list=JSON.stringify(BGMPlayer.cache.list);
            let data_pin_src=BGMPlayer.vars.pin.src;
            let data_pin_num=BGMPlayer.vars.pin_num;
            let data_currentTime=BGMPlayer.vars.pin.currentTime;
            let data_addr_list=BGMPlayer.cache.addr_list;
            let data_addr_resource=BGMPlayer.cache.addr_resource;

            BGMPlayer.funs._setCookie("data_list",data_list);
            BGMPlayer.funs._setCookie("data_pin_src",data_pin_src);
            BGMPlayer.funs._setCookie("data_pin_num",data_pin_num);
            BGMPlayer.funs._setCookie("data_currentTime",data_currentTime);

            BGMPlayer.funs._setCookie("data_addr_list",data_addr_list);
            BGMPlayer.funs._setCookie("data_addr_resource",data_addr_resource);
            
        };
        BGMPlayer.funs.Data_read_cookie=function(){ // 读取cookie
            let data_list=JSON.parse(BGMPlayer.funs._getCookie("data_list"));
            let data_pin_src=BGMPlayer.funs._getCookie("data_pin_src");
            let data_pin_num=BGMPlayer.funs._getCookie("data_pin_num");
            let data_currentTime=BGMPlayer.funs._getCookie("data_currentTime");
            let data_addr_list=BGMPlayer.funs._getCookie("data_addr_list");
            let data_addr_resource=BGMPlayer.funs._getCookie("data_addr_resource");

            BGMPlayer.cache.list=data_list;
            BGMPlayer.vars.pin.src=data_pin_src;
            BGMPlayer.vars.pin_num=data_pin_num;
            BGMPlayer.vars.pin.currentTime=data_currentTime;
            BGMPlayer.cache.addr_list=data_addr_list;
            BGMPlayer.cache.addr_resource=data_addr_resource;
        };
        BGMPlayer.funs._clearCookies=function(){
            BGMPlayer.funs._delCookie("data_list");
            BGMPlayer.funs._delCookie("data_pin_src");
            BGMPlayer.funs._delCookie("data_pin_num");
            BGMPlayer.funs._setCookie("data_currentTime");

            BGMPlayer.funs._delCookie("data_addr_list");
            BGMPlayer.funs._delCookie("data_addr_resource");
        }
        BGMPlayer.funs.Data_Get_List=function(addrIn){ // 从指定地址 获取播放列表内容 并且保存到缓冲区
            ;
        };

        BGMPlayer.funs.AutoInit=function(){
            let autoloadcookie=BGMPlayer.funs._getCookie("autoloadcookie")==1;
            if(autoloadcookie==true){
                BGMPlayer.funs.Data_read_cookie();
                BGMPlayer.settings._ifAutoLoadCookie=true;

                BGMPlayer.settings._ifAutoSaveCookie=BGMPlayer.funs._getCookie("autosavecookie")==1;

                window.onbeforeunload=
                "if(BGMPlayer.settings._ifAutoSaveCookie){ BGMPlayer.funs.Data_write_cookie();}";

            }
            else{
                BGMPlayer.funs.Init();
            }
        }

    // 设置相关
    BGMPlayer.settings={};
        BGMPlayer.settings._ifAutoSaveCookie=false;
        BGMPlayer.settings._ifAutoLoadCookie=false;

    // GUI相关
    BGMPlayer.guis={};

    BGMPlayer.DO=function(cmdIn){ // 对外接口
        let cmd=cmdIn.trim().split(" ");
        switch(cmd[0].toLocaleLowerCase()){
        case "play": // 播放
            BGMPlayer.funs.Song_Play();
            break;
        case "pause": // 暂停
            BGMPlayer.funs.Song_Pause();
            break;
        case "jump": // 跳转到时间点
            BGMPlayer.funs.Song_Play_time(cmd[1]);
            break;
        case "durration": // 获取总长度
            return BGMPlayer.vars.pin.duration;
        case "list": // 获取播放列表
            return BGMPlayer.cache.list;
        case "song": // 设定当前播放的音乐
            BGMPlayer.funs.Song_Play_in_list(cmd[1]);
            break;
        case "mode": // 切换下一个播放模式
            BGMPlayer.funs.Change_Mode();
            break;
        case "vol":
            BGMPlayer.funs.Set_Vol(parseFloat(cmd[1]) / 100);
            break;

        case "set": // 设置各种属性
            switch(cmd[1])
            {
            case "autosavecookie":
                let _autosave=cmd[2]==1?1:0;
                BGMPlayer.settings._ifAutoSaveCookie=_autosave;
        
                break;
            case "autoloadcookie":
                let _autoload=cmd[2]==1?1:0;
                BGMPlayer.settings._ifAutoLoadCookie=_autoload;
                break;

            case "save":
                BGMPlayer.funs.Data_write_cookie();
                break;
            case "load":
                BGMPlayer.funs.Data_read_cookie();
                break;

            case "init":
                BGMPlayer.funs.Init();
                break;
            case "init_net":
                BGMPlayer.funs.Init_from_network(cmd[2],cmd[3]);
                break;

            default:
                break;
            }
            break;

        case "status": // 获取播放器当前状态
            return BGMPlayer.funs.Status();

        case "info": // 获取播放器的信息
            return BGMPlayer.funs.Info();

        default: // 错误的指令
            return "错误的指令! ("+cmdIn+")";
        }
        return "完成!";
    }



    BGMPlayer.funs.Init();
})();
