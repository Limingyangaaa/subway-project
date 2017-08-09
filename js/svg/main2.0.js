/**
 * Created by tuki on 2016/10/22.
 */
function initSVG() {
    //判断浏览器是否支持HTML5
    try {
        document.createElement("canvas").getContext("2d");
    }
    catch (e) {
        document.getElementById("support").innerHTML = "<h3>你的浏览器不支持HTML5,请安装现代化的浏览器。我们推荐使用最新版的Chrome、 FireFox</h3>";
    }
    //初始化svg放大缩小平移插件
    var eventsHandler;
    eventsHandler = {
        haltEventListeners: ['touchstart', 'touchend', 'touchmove', 'touchleave', 'touchcancel']
        , init: function (options) {
            var instance = options.instance
                , initialScale = 1
                , pannedX = 0
                , pannedY = 0;
            // Init Hammer
            // Listen only for pointer and touch events
            this.hammer = Hammer(options.svgElement, {
                inputClass: Hammer.SUPPORT_POINTER_EVENTS ? Hammer.PointerEventInput : Hammer.TouchInput
            });
            // Enable pinch
            this.hammer.get('pinch').set({enable: true});
            // Handle double tap
            this.hammer.on('doubletap', function (ev) {
                instance.zoomIn();
            });
            // Handle pan
            this.hammer.on('panstart panmove', function (ev) {
                // On pan start reset panned variables
                if (ev.type === 'panstart') {
                    pannedX = 0;
                    pannedY = 0;
                }
                // Pan only the difference
                instance.panBy({x: ev.deltaX - pannedX, y: ev.deltaY - pannedY})
                pannedX = ev.deltaX;
                pannedY = ev.deltaY;
            });
            // Handle pinch
            this.hammer.on('pinchstart pinchmove', function (ev) {
                // On pinch start remember initial zoom
                if (ev.type === 'pinchstart') {
                    initialScale = instance.getZoom();
                    instance.zoom(initialScale * ev.scale)
                }

                instance.zoom(initialScale * ev.scale)

            });
            // Prevent moving the page on some devices when panning over SVG
            options.svgElement.addEventListener('touchmove', function (e) {
                e.preventDefault();
            });
        }
        , destroy: function () {
            this.hammer.destroy()
        }
    };
    // Expose to window namespace for testing purposes
    window.panZoom = svgPanZoom('#demo-tiger', {
        zoomEnabled: true
        , controlIconsEnabled: true
        , fit: 1
        , center: 1
        , customEventsHandler: eventsHandler
    });
    //svg操作
    var svgDocument = document.getElementById("demo-tiger").getSVGDocument();
    //svgDocument.querySelector(".main-viewport").addEventListener('click', function (e) {
    //    console.log(e.target)
    //});
    var sectionColors = ["#20ad70", "#fea50c", "#de0302", "#868686"];
    var stationColors = ["#868686", "#ffffff", "#fea50c", "#de0302"];
    //初始化标记，初始化线路和站点颜色（区间默认初始化为绿色，站点初始化为白色）
    var initFlag = true;
    //区间当前客流数据
    var SectionFlowData = {};
    //站点当前客流数据
    var StationFlowData = {};
    bindClickListener(svgDocument, svgDocument);
    bindDirectionAnimation(svgDocument);

    //绑定图层选择控件
    $(".line-radio").change(function () {
        var lineNo = $(this).val();
        highLightLine(svgDocument, lineNo);
        Gudazi.changeLine(lineNo);
    });
    //绑定公告栏事件
    $("#messageOpenBtn").click(function(){
        $(this).hide().next().show().animate({marginLeft:'20%'},500);
        //$(this).hide().next().show().css({margin:'auto'});
    });
    $("#messageCloseBtn").click(function(){
        var $messageBox = $(this).parent();
        $messageBox.animate({marginLeft:'100%'},500,function(){
            $messageBox.hide();
            $("#messageOpenBtn").show();
        })
    });
    var SectionUpdateSeries = 0;//区间已更新序列号
    var SectionRequireSeries = 1;//区间发起的更新序列号

    var StationUpdateSeries = 0;//站点已更新序列号
    var StationRequireSeries = 1;//站点发起的更新序列号
    //加载区间客流
    loadSectionFlow(SectionRequireSeries);
    setInterval(function () {
        SectionRequireSeries++;
        loadSectionFlow(SectionRequireSeries);
    }, 60000);
    //加载站点客流
    loadStationFlow(StationRequireSeries);
    setInterval(function () {
        StationRequireSeries++;
        loadStationFlow(StationRequireSeries);
    }, 60000);
    //加载公告信息
    loadMessage();
    setInterval(function () {
        loadMessage();
    }, 60000);

    function bindClickListener(document, svgDocument) {
        var line_1 = document.getElementsByClassName("section-line");
        for (var i = 0; i < line_1.length; i++) {
            initFlag && line_1[i].setAttribute("stroke", sectionColors[0]);
            line_1[i].addEventListener('click', function (e) {
                var targetEl = e.target;
                //targetEl.setAttribute("stroke", "#333333");
                //targetEl.setAttribute("stroke-width", "10");
                var sectionId = targetEl.getAttribute("id");
                var flow = 0;
                var lineNo = "";
                var crowd = 0;
                var startStation = "未知站点";
                var endStation = "未知站点";
                if (SectionFlowData[sectionId]) {
                    var section = SectionFlowData[sectionId];
                    flow = section.flow || 0;
                    lineNo = section.line || "";
                    crowd = getSectionCrowd(lineNo, flow);
                    startStation = section.start || "未知站点";
                    endStation = section.end || "未知站点";
                    svgDocument.querySelector("#info_section_name").innerHTML = startStation + "-" + endStation;
                }else{
                    svgDocument.querySelector("#info_section_name").innerHTML = targetEl.getAttribute("name") || startStation + "-" + endStation;
                }
                svgDocument.querySelector("#info_section_sectionFlow").innerHTML = "断面客流量:  " + flow;
                svgDocument.querySelector("#info_section_sectionCdeg").innerHTML = "断面拥挤度:  " + crowd;
                if (targetEl.localName == "line") {
                    var x1 = parseFloat(targetEl.getAttribute("x1"));
                    var y1 = parseFloat(targetEl.getAttribute("y1"));
                    var x2 = parseFloat(targetEl.getAttribute("x2"));
                    var y2 = parseFloat(targetEl.getAttribute("y2"));
                    showInfoWindow(svgDocument.querySelector("#section_window"), (x1 + x2) / 2, (y1 + y2) / 2);
                } else if (targetEl.localName == "path") {
                    var len = targetEl.getTotalLength();
                    var point = targetEl.getPointAtLength(len / 2.5);
                    showInfoWindow(svgDocument.querySelector("#section_window"), point.x, point.y);
                }
            });
        }
        var station_1 = document.getElementsByClassName("station-line");
        for (var j = 0; j < station_1.length; j++) {
            initFlag && station_1[j].setAttribute("stroke", stationColors[1]);
            initFlag && station_1[j].setAttribute("fill", stationColors[1]);
            station_1[j].addEventListener('click', function (e) {
                var targetEl = e.target;
                var stationId = targetEl.getAttribute("id");
                var _stationName = targetEl.getAttribute("name");
                var inFlow = 0;
                var outFlow = 0;
                var exFlow = 0;
                var stationName = "未知站点";
                if (StationFlowData[stationId]) {
                    var station = StationFlowData[stationId];
                    inFlow = station.in || 0;
                    outFlow = station.out || 0;
                    stationName = station.station;
                    exFlow = station.trans;
                }else{
                    stationName = _stationName || "未知站点";
                }
                svgDocument.querySelector("#info_station_name").innerHTML = stationName;
                var inFlowEl = svgDocument.querySelector("#info_station_inFlow");
                var outFlowEl = svgDocument.querySelector("#info_station_outFlow");
                var exFlowEl = svgDocument.querySelector("#info_station_exFlow");
                inFlowEl.innerHTML = "进站量:  " + inFlow;
                outFlowEl.innerHTML = "出站量:  " + outFlow;
                exFlowEl.innerHTML = "换乘量:  " + exFlow;
                inFlowEl.setAttribute("y","110");
                outFlowEl.setAttribute("y","150");
                exFlowEl.style.display = "none";
                var cx = targetEl.getAttribute("cx");
                var cy = targetEl.getAttribute("cy");
                showInfoWindow(svgDocument.querySelector("#station_window"), cx, cy);
            });
        }
        var exchangeStations = document.getElementsByClassName("exchange-station");
        $.each(exchangeStations, function (i, el) {
            el.addEventListener('click', function (e) {
                var targetEl = e.target;
                var stationId = targetEl.parentElement.id;
                var _stationName = targetEl.parentElement.getAttribute("name");
                var inFlow = 0;
                var outFlow = 0;
                var exFlow = 0;
                var stationName = "未知站点";
                if (StationFlowData[stationId]) {
                    var station = StationFlowData[stationId];
                    inFlow = station.in || 0;
                    outFlow = station.out || 0;
                    stationName = station.station;
                    exFlow = station.trans;
                }else{
                    stationName = _stationName || "未知站点";
                }
                svgDocument.querySelector("#info_station_name").innerHTML = stationName;
                var inFlowEl = svgDocument.querySelector("#info_station_inFlow");
                var outFlowEl = svgDocument.querySelector("#info_station_outFlow");
                var exFlowEl = svgDocument.querySelector("#info_station_exFlow");
                inFlowEl.innerHTML = "进站量:  " + inFlow;
                outFlowEl.innerHTML = "出站量:  " + outFlow;
                exFlowEl.innerHTML = "换乘量:  " + exFlow;
                inFlowEl.setAttribute("y","100");
                outFlowEl.setAttribute("y","130");
                exFlowEl.style.display = "";
                if (targetEl.previousElementSibling) {
                    targetEl = targetEl.previousElementSibling;
                }
                initFlag && targetEl.setAttribute("stroke", stationColors[1]);
                var len = targetEl.getTotalLength();
                var point = targetEl.getPointAtLength(len / 2.5);
                showInfoWindow(svgDocument.querySelector("#station_window"), point.x, point.y);
            });
        });
        if (initFlag) {
            initFlag = false;
        }
    }

    function bindDirectionAnimation(svgDocument) {
        var lineDirections = svgDocument.getElementsByClassName("line-direction");
        $.each(lineDirections, function (i, el) {
            var polygons = el.querySelectorAll("polygon");
            polygons[2] && polygons[2].setAttribute("class", "direction-animation1");
            polygons[1] && polygons[1].setAttribute("class", "direction-animation2");
            polygons[0] && polygons[0].setAttribute("class", "direction-animation3");
        });
    }

    function showInfoWindow(infoWindow, x, y) {
        infoWindow.setAttribute("transform", "translate(" + x + " " + y + ")");
        infoWindow.style.display = "";
        var _infoWindow = infoWindow.cloneNode(true);
        infoWindow.parentNode.appendChild(_infoWindow);
        infoWindow.parentNode.removeChild(infoWindow);
        //绑定信息窗口关闭事件
        _infoWindow.getElementsByClassName("close-window")[0].addEventListener('click', function (e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            var parent = e.target;
            while (parent.getAttribute("class") != "info-window") {
                parent = parent.parentElement;
            }
            parent.style.display = "none";
        });
    }

    function loadSectionFlow(requireSeries) {
        var url = Global.IP + "/subway/api/stationflow";
        $.get(url, function (data) {
            if (data) {
                if (requireSeries > SectionRequireSeries) {
                    //该次更新无效
                    return
                }
                if (requireSeries > SectionUpdateSeries || requireSeries == 1) {
                    SectionUpdateSeries = requireSeries;
                    sectionFlowRed = "";
                    sectionFlowYellow = "";
                    $.each(data, function (i, section) {
                        if (!section) {
                            return true
                        }
                        var sectionLine = svgDocument.querySelectorAll("#L" + section.flowno);
                        if (sectionLine.length) {
                            var color = getSectionColor(section.line, section.flow,section.start,section.end);
                            for (var j = 0; j < sectionLine.length; j++) {
                                sectionLine[j].setAttribute("stroke", color);
                            }
                        }
                        //更新区间数据
                        SectionFlowData["L" + section.flowno] = section;
                    });
                    console.log("section flow update successfully by the No." + requireSeries + " request!");
                    if (requireSeries > 1000000) {
                        SectionUpdateSeries = 0;
                        SectionRequireSeries = 0;
                    }
                } else {
                    console.log("No." + requireSeries + " request section flow data is old,drop it!");
                }
            }
        });
    }

    var sectionFlowRed = "",sectionFlowYellow = "";
    function getSectionColor(lineNo, flow,start,end) {
        var color = sectionColors[0];
        switch (lineNo) {
            case "2611":
                if(flow >= 1469){
                    color = sectionColors[2];
                    if(sectionFlowRed){
                        sectionFlowRed += "," + start + "-" + end;
                    }else{
                        sectionFlowRed += "拥挤的区间有：" + start + "-" + end;
                    }
                }else if(flow >= 979){
                    color = sectionColors[1];
                    if(sectionFlowYellow){
                        sectionFlowYellow += "," + start + "-" + end;
                    }else{
                        sectionFlowYellow += "客流较多的区间有：" + start + "-" + end;
                    }
                }else{
                    color = sectionColors[0];
                }
                break;
            case "2411":
                if(flow >= 2134){
                    color = sectionColors[2];
                    if(sectionFlowRed){
                        sectionFlowRed += "," + start + "-" + end;
                    }else{
                        sectionFlowRed += "拥挤的区间有：" + start + "-" + end;
                    }
                }else if(flow >= 1422){
                    color = sectionColors[1];
                    if(sectionFlowYellow){
                        sectionFlowYellow += "," + start + "-" + end;
                    }else{
                        sectionFlowYellow += "客流较多的区间有：" + start + "-" + end;
                    }
                }else{
                    color = sectionColors[0];
                }
                break;
            case "2610":
                if(flow >= 1469){
                    color = sectionColors[2];
                    if(sectionFlowRed){
                        sectionFlowRed += "," + start + "-" + end;
                    }else{
                        sectionFlowRed += "拥挤的区间有：" + start + "-" + end;
                    }
                }else if(flow >= 979){
                    color = sectionColors[1];
                    if(sectionFlowYellow){
                        sectionFlowYellow += "," + start + "-" + end;
                    }else{
                        sectionFlowYellow += "客流较多的区间有：" + start + "-" + end;
                    }
                }else{
                    color = sectionColors[0];
                }
                break;
            case "2410":
                if(flow >= 2134){
                    color = sectionColors[2];
                    if(sectionFlowRed){
                        sectionFlowRed += "," + start + "-" + end;
                    }else{
                        sectionFlowRed += "拥挤的区间有：" + start + "-" + end;
                    }
                }else if(flow >= 1422){
                    color = sectionColors[1];
                    if(sectionFlowYellow){
                        sectionFlowYellow += "," + start + "-" + end;
                    }else{
                        sectionFlowYellow += "客流较多的区间有：" + start + "-" + end;
                    }
                }else{
                    color = sectionColors[0];
                }
                break;
            default :
                if(flow >= 1930){
                    color = sectionColors[2];
                    if(sectionFlowRed){
                        sectionFlowRed += "," + start + "-" + end;
                    }else{
                        sectionFlowRed += "拥挤的区间有：" + start + "-" + end;
                    }
                }else if(flow >= 1286){
                    color = sectionColors[1];
                    if(sectionFlowYellow){
                        sectionFlowYellow += "," + start + "-" + end;
                    }else{
                        sectionFlowYellow += "客流较多的区间有：" + start + "-" + end;
                    }
                }else{
                    color = sectionColors[0];
                }
                break;
        }
        if (flow < 0) {
            color = sectionColors[3];//未开通，灰色
        }
        return color;
    }

    function getSectionCrowd(lineNo, flow) {
        flow = parseFloat(flow);
        flow = isNaN(flow) ? 0 : flow;
        var crowd = 0;
        switch (lineNo) {
            case "2611":
                crowd = flow / 1224;
                break;
            case "2411":
                crowd = flow / 1778;
                break;
            case "2610":
                crowd = flow / 1224;
                break;
            case "2410":
                crowd = flow / 1778;
                break;
            default :
                crowd = flow / 1608;
                break;
        }
        return crowd.toFixed(2);
    }
    var stationFlowRed = "",stationFlowYellow = "";
    function getStationColor(status,flowIn,flowOut,stationName) {
        if(status == -1){
            return stationColors[0];
        }
        var flow = flowIn + flowOut;
        if(flow >= 5000){
            if(stationFlowRed){
                stationFlowRed += "," + stationName
            }else{
                stationFlowRed += "拥挤的站点有：" + stationName
            }
            return stationColors[3];
        }else if(flow >= 3000){
            if(stationFlowYellow){
                stationFlowYellow += "," + stationName
            }else{
                stationFlowYellow += "客流较多的站点有：" + stationName
            }
            return stationColors[2];
        }else{
            return stationColors[1];
        }
    }

    function loadStationFlow(requireSeries) {
        var url = Global.IP + "/subway/api/station";
        $.get(url, function (data) {
            if (data) {
                if (requireSeries > StationRequireSeries) {
                    //该次更新无效
                    return
                }
                if (requireSeries > StationUpdateSeries || requireSeries == 1) {
                    StationUpdateSeries = requireSeries;
                    stationFlowRed = "";
                    stationFlowYellow="";
                    $.each(data, function (i, station) {
                        if (!station) {
                            return true
                        }
                        var stationEls = svgDocument.querySelectorAll("#S" + station.stationid);
                        if (stationEls.length) {
                            var color = getStationColor(station.status,station.in,station.out,station.station);
                            for (var j = 0; j < stationEls.length; j++) {
                                //站点分为普通站，终点站，换乘站
                                //特殊处理换乘站
                                if (stationEls[j].localName == "g") {
                                    var firstChild = stationEls[j].children[0];
                                    firstChild.setAttribute("stroke", color);
                                    firstChild.setAttribute("fill", color);
                                } else {
                                    stationEls[j].setAttribute("stroke", color);
                                    stationEls[j].setAttribute("fill", color);
                                }
                            }
                        }
                        //更新站点客流数据
                        StationFlowData["S" + station.stationid] = station;
                    });
                    console.log("station in out flow update successfully by the No." + requireSeries + " request!");
                    if (requireSeries > 1000000) {
                        StationUpdateSeries = 0;
                        StationRequireSeries = 0;
                    }
                } else {
                    console.log("No." + requireSeries + " request station in out flow data is old,drop it!");
                }
            }
        });
    }

    function loadMessage(){
        var url = Global.IP + "/subway/api/getnotify";
        $.get(url,function(result){
            if(result && result.status == "200"){
                var msg = result.data ? (result.data.content || ""):"";
                if(stationFlowYellow && stationFlowRed){
                    if(msg){
                        msg += "；目前" + stationFlowYellow + "；" + stationFlowRed + "。";
                    }else{
                        msg += "目前" + stationFlowYellow + "；" + stationFlowRed + "。";
                    }
                }else if(stationFlowYellow){
                    if(msg){
                        msg += "；目前" + stationFlowYellow + "。";
                    }else{
                        msg += "目前" + stationFlowYellow + "。";
                    }
                }else if(stationFlowRed){
                    if(msg){
                        msg += "；目前" + stationFlowRed + "。";
                    }else{
                        msg += "目前" + stationFlowRed + "。";
                    }
                }
                if(sectionFlowYellow && sectionFlowRed){
                    if(msg){
                        msg += "；目前" + sectionFlowYellow + "；" + sectionFlowRed + "。";
                    }else{
                        msg += "目前" + sectionFlowYellow + "；" + sectionFlowRed + "。";
                    }
                }else if(sectionFlowYellow){
                    if(msg){
                        msg += "；目前" + sectionFlowYellow + "。";
                    }else{
                        msg += "目前" + sectionFlowYellow + "。";
                    }
                }else if(sectionFlowRed){
                    if(msg){
                        msg += "；目前" + sectionFlowRed + "。";
                    }else{
                        msg += "目前" + sectionFlowRed + "。";
                    }
                }
                if(msg){
                    $("#warningTips").html(msg);
                }else{
                    $("#warningTips").html("暂无更多公告");
                }
            }else{
                console.log("get notify error!");
            }
        });
    }

    function highLightLine(svgDocument, lineNo) {
        if (!lineNo) {
            return
        }
        //高亮选中线路
        $.each(svgDocument.querySelectorAll(".line-layer-group"), function (i, el){
            if(lineNo == "0")
            {
                //显示全网
                el.setAttribute("opacity","1");
            }else{
                //选中某条线路
                var id = el.getAttribute("id");
                if(id == ("lineGroup" + lineNo) || id == ("lineNameGroup" + lineNo)){
                    el.setAttribute("opacity","1");
                }else{
                    el.setAttribute("opacity","0.1");
                }
            }
        });
        //隐藏两个信息窗口
        svgDocument.querySelector("#station_window").style.display = "none";
        svgDocument.querySelector("#section_window").style.display = "none";
    }
}
