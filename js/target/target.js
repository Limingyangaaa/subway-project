/**
 * Created by tuki on 2016/11/17.
 */
(function($,echarts){
    var chart1,chart2,chart3;
    var SubwayMap;
    var self;
    var $table = $("#targetTable");
    var baseUrl = "http://police.sibat.cn/escopeweb";
    var timespan = 2;
    var mapFocusUrl = "/count/cntservice!getUserbadOnline.action";
    var chartUrl = "/count/cntservice!getUserbadTypeSum.action";
    var focusSummaryUrl = "/count/cntservice!getUserbadSum.action?timespan=" + timespan;
    var focusListUrl = "/count/cntservice!getUserbadList.action?timespan=" + timespan;
    var sendMessageUrl = "http://58.251.157.179:60106/sub-center-control/send_sms";//phoneNum=18825224963&focusName=何海强&stationName=大剧院
    var stationScheduleUrl = "http://ask.sibat.cn/sibat-police/webapi/stationflow/schedule";
    var targetList = [];
    var $focus = $("#targetFocusTable");
    var focusList = [];
    var target = function(){
        self = this;
        self.init();
    };
    target.prototype = {
        init:function(){
            self.drawChart1();
            self.drawChart2();
            self.drawChart3();
            self.getTargetList($table);
            self.getTargetSummary();
            //自动更新数据
            (function(){
                setInterval(function(){
                    self.getTargetList($table);
                    self.drawChart3();
                    self.getTargetSummary();
                },1000 * 60);
            })();
        },
        initSubwayMap:function(subwayMap){
            SubwayMap = subwayMap;
        },
        getTargetSummary:function(){
            var url = baseUrl + focusSummaryUrl;
            $.ajax({
                url:url,
                dataType:"json",
                success:function(data){
                    var result = data;
                    $("#targetTotal").html((result.total/10000).toFixed(2));
                    $("#targetAppear").html(result.sumOfMonth);
                    $("#targetOnline").html(result.sumOnline);
                }
            });
        },
        drawChart1:function(chartData){
            if(!chart1)
            {
                chart1 = echarts.init(document.getElementById("targetChart1"));
                var option = {
                    color: ['#0368B2'],
                    tooltip : {
                        trigger: 'axis'
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        top: '30',
                        containLabel: true
                    },
                    textStyle:{
                        color:"#e8e8e8"
                    },
                    xAxis : {
                        type : 'category',
                        data : ['故意伤害', '抢夺', '抢劫', '盗窃', '扒窃', '涉毒', '其他'],
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLine:{
                            lineStyle:{
                                color:"#0D3241"
                            }
                        }
                    },
                    yAxis : {
                        name:"单位：人",
                        type : 'value',
                        axisLine:{
                            lineStyle:{
                                color:"#0D3241"
                            }
                        },
                        splitLine:{
                            lineStyle:{
                                color:"#0D3241"
                            }
                        }
                    },
                    series : {
                        name:'人数',
                        type:'bar',
                        barWidth: '25px',
                        data:[10, 52, 200, 334, 390, 330, 220]
                    }
                };
                chart1.setOption(option);
            }
            if(chartData){
                if(chartData && chartData.type)
                {
                    var xData = [],sData = [];
                    for(var key in chartData.type)
                    {
                        if(chartData.type.hasOwnProperty(key))
                        {
                            xData.push(key);
                            sData.push(chartData.type[key]);
                        }
                    }
                    var _option = {
                        xAxis : [
                            {
                                type : 'category',
                                data : xData
                            }
                        ],
                        series : [
                            {
                                name:'人数',
                                type:'bar',
                                barWidth: '25px',
                                data:sData
                            }
                        ]
                    };
                    chart1.setOption(_option);
                }
            }
        },
        drawChart2:function(chartData){
            if(!chart2)
            {
                chart2 = echarts.init(document.getElementById("targetChart2"));
                var option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c} ({d}%)"
                    },
                    color:["#9EC3E7","#03B0F1","#E7463B","#DF0302","#93d052"],
                    series: {
                        name:'预警类别',
                        type:'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: true,
                                position: 'right'
                            }
                        },
                        labelLine: {
                            normal: {
                                show: true
                            }
                        },
                        data:[
                            {value:335, name:'A类'},
                            {value:310, name:'B类'},
                            {value:234, name:'C类'},
                            {value:135, name:'布控'}
                        ]
                    }
                };
                chart2.setOption(option);
            }
            if(chartData){
                if(chartData && chartData.level)
                {
                    var sData = [];
                    for(var key in chartData.level)
                    {
                        if(chartData.level.hasOwnProperty(key))
                        {
                            sData.push({value:chartData.level[key] , name:key});
                        }
                    }
                    var _option = {
                        series : {
                            data: sData
                        }
                    };
                    chart2.setOption(_option);
                }
            }
        },
        drawChart3:function(){
            if(!chart3)
            {
                chart3 = echarts.init(document.getElementById("targetChart3"));
                var option = {
                    color: ['#0368B2'],
                    tooltip : {
                        trigger: 'axis'
                    },
                    grid: {
                        left: '3%',
                        right: '65',
                        bottom: '3%',
                        top: '10',
                        containLabel: true
                    },
                    textStyle:{
                        color:"#e8e8e8"
                    },
                    xAxis : {
                        name:"单位：人",
                        type : 'value',
                        boundaryGap: [0, 0.01],
                        axisLine:{
                            lineStyle:{
                                color:"#0D3241"
                            }
                        },
                        splitLine:{
                            lineStyle:{
                                color:"#0D3241"
                            }
                        }
                    },
                    yAxis : {
                        type : 'category',
                        data : ['竹子林', '车公庙', '布吉', '福田', '深大'],
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLine:{
                            lineStyle:{
                                color:"#0D3241"
                            }
                        },
                        splitLine:{
                            lineStyle:{
                                color:"#0D3241"
                            }
                        }
                    },
                    series : {
                        name:'人数',
                        type:'bar',
                        barWidth: '15px',
                        data:[220, 52, 200, 334, 390]
                    }
                };
                chart3.setOption(option);
            }
            var url = baseUrl + chartUrl;
            $.ajax({
                url:url,
                dataType:"json",
                success:function(chartData){
                    self.drawChart1(chartData);
                    self.drawChart2(chartData);
                    if(chartData && chartData.station)
                    {
                        var xData = [],sData = [];
                        var temp = [];
                        for(var key in chartData.station)
                        {
                            if(chartData.station.hasOwnProperty(key))
                            {
                                temp.push({name:key,value:chartData.station[key]});
                            }
                        }
                        temp.sort(function(a,b){
                            return a.value - b.value;
                        });
                        for(var i = 0;i < temp.length;i++ )
                        {
                            xData.push(temp[i].name);
                            sData.push(temp[i].value);
                        }
                        var _option = {
                            yAxis : {
                                data : xData
                            },
                            series : {
                                name:'人数',
                                type:'bar',
                                barWidth: '15px',
                                data:sData
                            }
                        };
                        chart3.setOption(_option);
                    }
                }
            });
        },
        redraw:function(){
            chart1 && chart1.resize();
            chart2 && chart2.resize();
            chart3 && chart3.resize();
        },
        getTargetList:function($table){
            //todo 获取重点人员列表
            var url = baseUrl + focusListUrl;
            $.ajax({
                url:url,
                dataType:"json",
                success:function(data){
                    if(data.rows && $.isArray(data.rows))
                    {
                        targetList = data.rows;
                        self.setTargetTable($table,targetList);
                        $(".target-th-check").prop("checked","checked");
                    }
                }
            });
        },
        setTargetTable:function($table,listData){
            var $tbody = $table.children("tbody");
            $tbody.empty();
            var $tr;
            $.each(listData,function(i,obj){
                if(!obj)
                {
                    return true
                }
                $tr = $("<tr><td class='table-li'>"+ (i + 1) +"</td><td>"+(obj.realname || "未知姓名")+"</td><td>"+(obj.gender == "F" ? "女" : "男")
                    +"</td><td>"+(obj.stime || "")+"</td><td>"+obj.usertypename+"</td><td>"+self.getFocusType(obj.level)+"</td></tr>");
                $tbody.append($tr);
            });
        },
        filterTargetTable:function(tagName1,filters1,tagName2,filters2){
            var filterResult = self.filterList(targetList,tagName1,filters1);
            filterResult = self.filterList(filterResult,tagName2,filters2);
            self.setTargetTable($table,filterResult);
        },
        filterList:function(list,tagName,filters){
            var filterResult = [];
            var filterMap = {};
            if(!filters || filters.length == 0)
            {
                filterResult = list;
                return filterResult;
            }else if($.isArray(filters))
            {
                for(var i = 0;i< filters.length;i++)
                {
                    filterMap[filters[i]] = 1;
                }
            }else{
                filterMap[filters] = 1;
            }
            $.each(list,function(j,obj){
                if(!obj)
                {
                    return true
                }
                if(obj[tagName] && filterMap[obj[tagName]])
                {
                    filterResult.push(obj);
                }
            });
            return filterResult;
        },
        getFocusType:function(focusType){
            if(focusType == "1")
            {
                return "<span class='focus-type1'>A普通关注</span>";
            }else if(focusType == "2")
            {
                return "<span class='focus-type2'>B重点关注</span>";
            }else if(focusType == "4")
            {
                return "<span class='focus-type3'>C重点关注</span>";
            }else if(focusType == "3")
            {
                return "<span class='focus-type4'>*布控</span>";
            }
            return "<span class='focus-type0'>未知类别</span>";
        },
        getTargetFocusList:function(cardNo,markUrl){
            //todo 获取重点人员警情统计
            var url = "http://police.sibat.cn/escopeweb/count/cntservice!getUserbadStationList.action?cardno=" + cardNo;
            $.ajax({
                url:url,
                dataType:"json",
                success:function(data){
                    var targetSummary = data.rows;
                    if(targetSummary && $.isArray(targetSummary))
                    {
                        focusList = [];
                        $.each(targetSummary,function(i,obj){
                            if(!obj)
                            {
                                return true
                            }
                            focusList.push({time:obj.stime,station:obj.buildingname,stayTime:(obj.staytime/60).toFixed(1) + "min"});
                            if(i == 0)
                            {
                                //当前位置mark
                                SubwayMap.clearTips();
                                SubwayMap.createImageMark(obj.bid,markUrl);
                                $("#msgBtn").data("stationId",obj.bid);
                            }
                        });
                        self.setTargetFocusList($focus,focusList);
                    }
                }
            });
        },
        setTargetFocusList:function($table,listData){
            var $tbody = $table.children("tbody");
            $tbody.empty();
            var $tr;
            $.each(listData,function(i,obj){
                if(!obj)
                {
                    return true
                }
                $tr = $("<tr><td class='table-li'>"+ (i + 1) +"</td><td>"+obj.time+"</td><td>"+obj.station
                    +"</td><td>"+obj.stayTime+"</td></tr>");
                $tbody.append($tr);
            });
        },
        showMapTargetTips:function(subwayMap,stationId){
            var url = baseUrl + mapFocusUrl +"?timespan=" + 2;
            if(stationId)
            {
                url = url + "&bid=" + stationId
            }
            $.ajax({
                url:url,
                dataType:"json",
                success:function(data){
                    var policeList = data.stationdata;
                    var targetCount = 0;
                    if(policeList && $.isArray(policeList))
                    {
                        if($("#targetTab").hasClass("tab-active")){
                            subwayMap.clearTips();
                        }
                        $.each(policeList,function(i,obj){
                            if(!obj)
                            {
                                return true
                            }
                            var stationId = obj.bid;
                            if(obj.data && $.isArray(obj.data))
                            {
                                var normalFocus = [];
                                var importantFocus = [];
                                $.each(obj.data,function(j,focus){
                                    if(!focus)
                                    {
                                        return true
                                    }
                                    focus.bid = stationId;
                                    if(focus.level == "布控")
                                    {
                                        importantFocus.push(focus);
                                    }else{
                                        normalFocus.push(focus);
                                    }
                                    targetCount++;
                                });
                                if($("#flowTab").hasClass("tab-active"))
                                {
                                    console.log("now is showing flow tab,update highest level target only at station:" + obj.bidname);
                                    if(importantFocus.length)
                                    {
                                        subwayMap.createImportantFocusTips(stationId,importantFocus)
                                    }
                                }else if($("#targetTab").hasClass("tab-active")){
                                    console.log("now is showing target tab,update all level target at station:" + obj.bidname);
                                    if(normalFocus.length)
                                    {
                                        subwayMap.createNormalFocusTips(stationId,normalFocus)
                                    }
                                    if(importantFocus.length)
                                    {
                                        subwayMap.createImportantFocusTips(stationId,importantFocus)
                                    }
                                    if(targetCount && $("#waringBtn").data("control") == "on")
                                    {
                                        var snd = new Audio("./source/warning.mp3"); // buffers automatically when created
                                        snd.play();
                                    }
                                }
                            }
                        });
                        if($("#flowTab").hasClass("tab-active") || $("#policeTab").hasClass("tab-active"))
                        {
                            console.log("now is showing flow or police tab,update target count only at all station!count:" + targetCount);
                            if(targetCount && $("#waringBtn").data("control") == "on")
                            {
                                $("#targetCountTips").html(targetCount).show();
                                var snd = new Audio("./source/warning.mp3"); // buffers automatically when created
                                snd.play();
                            }else{
                                $("#targetCountTips").hide();
                            }
                        }
                    }
                }
            });
        },
        getTargetDetailInfo:function(cardNo,markUrl){
            var url = "http://police.sibat.cn/escopeweb/count/cntservice!getUserbadInfo.action?cardno=" + cardNo;
            $.ajax({
                url:url,
                dataType:"json",
                success:function(data){
                    var targetInfo = data.data;
                    $("#targetName").html(targetInfo.realname);
                    $("#targetNo").html(targetInfo.cardno);
                    $("#targetSex").html(targetInfo.gender == "F" ? "女" : "男");
                    $("#targetBirth").html(targetInfo.birthday);
                    $("#targetCardType").html(targetInfo.cardtype == "0" ? "身份证" : targetInfo.cardtype);
                    $("#targetCardNo").html(targetInfo.cardnumber || "");
                    $("#targetProvince").html(targetInfo.origin || "");
                    $("#targetAddress").html(targetInfo.address || "");
                    $("#targetWorkintro").html(targetInfo.workintro || "");
                    $("#targetOrigin").html(targetInfo.intro || "");
                    $("#targetIsDrug").html(targetInfo.isdrug == "0" ? "否" : "是");
                    $("#targetSysUserName").html(targetInfo.sysusername);
                    $("#targetSysDepName").html(targetInfo.sysdepname);
                    $("#targetLevelName").html(targetInfo.levelname || "");
                    $("#targetUserTypeName").html(targetInfo.usertypename);
                    $("#targetIsAll").html(targetInfo.isall == "0" ? "否" : "是");
                    $("#targetDataSource").html(targetInfo.datasource);
                    $("#targetStation").html(targetInfo.station);
                }
            });
            self.getTargetFocusList(cardNo,markUrl);
        },
        getStationSchedule:function(focusName,stationId){
            var self = this;
            $.ajax({
                url:stationScheduleUrl + "?stationId=" + stationId,
                dataType:"json",
                success:function(data){
                    var result = data.queryresult[0];
                    var stationName = result.stationName;
                    var sendList = [];
                    if(result.telphone)
                    {
                        sendList.push({name:result.principal,phoneNum:result.telphone});
                    }
                    $.each(result.polices,function(i,police){
                        if(!police)
                        {
                            return true
                        }
                        if(police.phoneNum)
                        {
                            sendList.push({name:police.policeName,phoneNum:police.phoneNum});
                        }
                    });
                    if(sendList.length)
                    {
                        console.log(sendList);
                        $.each(sendList,function(j,person){
                            self.sendTargetMessage(person.name,person.phoneNum,focusName,stationName);
                        });
                    }
                }
            });
        },
        sendTargetMessage:function(person,phoneNum,focusName,stationName){
            $.ajax({
                url:sendMessageUrl + "?phoneNum=" + phoneNum + "&focusName=" + encodeURIComponent(focusName) + "&stationName=" + encodeURIComponent(stationName),
                dataType:"json",
                success:function(data){
                    if(data.status == "200")
                    {
                        Lobibox.notify('success', {
                            size: 'mini',
                            sound: false,
                            msg: "对"+person+"的手机号码：" + phoneNum + "发送短信成功"
                        });
                    }else{
                        Lobibox.notify('error', {
                            size: 'mini',
                            sound: false,
                            msg: "对"+person+"的手机号码：" + phoneNum + "发送短信失败"
                        });
                    }
                }
            });
        }
    };
    $.fn.TargetPerson = function(){
        return new target();
    }
})(jQuery,echarts);