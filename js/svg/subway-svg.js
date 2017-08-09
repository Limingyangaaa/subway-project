/**
 * Created by tuki on 2016/11/18.
 */
(function($,svgPanZoom,Hammer){
	var ip = 'http://192.168.40.130:9999'
	var url = document.location.href
	if(url.indexOf('http://10.204.113.243')!=-1){
		ip = 'http://10.204.113.243:8080'
	}
    var SubwaySVG = function(el,option){
        this.el = el;
        this.svgDocument = el.getSVGDocument();
        this.initFlag = false;
        //区间当前客流数据
        this.SectionFlowData = {};
        //站点当前客流数据
        this.StationFlowData = {};
        this.SectionUpdateSeries = 0;//区间已更新序列号
        this.SectionRequireSeries = 1;//区间发起的更新序列号

        this.StationUpdateSeries = 0;//站点已更新序列号
        this.StationRequireSeries = 1;//站点发起的更新序列号
        this.settings = $.extend({
            'flowModel': true,
            'sectionColors': ["#20ad70", "#fea50c", "#de0302", "#868686"],
            'stationColors': ["#868686", "#ffffff", "#fea50c", "#de0302"],
            'stationFlowUrl': ip + '/subway/api/station',  //公司测试使用IP：http://192.168.40.130:9999    公安内网使用IP：http://10.204.113.243:8080
            'sectionFlowUrl': ip + '/subway/api/stationflow',
            'controlIconsEnabled':true
        },this,option);
        this.init();
    };
    SubwaySVG.prototype = {
        init:function(){
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
            var self = this;
            self.panZoomTiger = svgPanZoom(self.el, {
                zoomEnabled: true
                , controlIconsEnabled: self.settings.controlIconsEnabled
                , fit: 1
                , center: 1
                ,minZoom: 0.8
                , customEventsHandler: eventsHandler
            });
            self.panZoomTiger.zoom(1.1);
            //绑定方向动画
            self.bindDirectionAnimation(self.svgDocument);
            if(self.settings.flowModel)
            {
                console.log("flow model start!");
                //绑定站点和区间点击事件
                self.bindClickListener(self.svgDocument, self.svgDocument);
                //加载区间客流
                self.loadSectionFlow(self.SectionRequireSeries);
                setInterval(function () {
                    self.SectionRequireSeries++;
                    self.loadSectionFlow(self.SectionRequireSeries);
                }, 60000);
                //加载站点客流
                self.loadStationFlow(self.StationRequireSeries);
                setInterval(function () {
                    self.StationRequireSeries++;
                    self.loadStationFlow(self.StationRequireSeries);
                }, 60000);
            }
            //test
            //self.createImportantFocusTips(["1263021000","1263022000","1262015000","1268003000","1267025000"]);
        },
        panAndZoomToPoint:function(_x,_y,zoom){
            //x,y为svg元素相对根元素svg标签的坐标
            this.panZoomTiger.zoom(zoom);
            var size = this.panZoomTiger.getSizes();
            var panPoint = {x:size.width/2 - _x*size.realZoom,y:size.height/2 - _y*size.realZoom};
            this.panZoomTiger.pan(panPoint);
        },
        bindClickListener: function(document, svgDocument){
            var self = this;
            var line_1 = document.getElementsByClassName("section-line");
            for (var i = 0; i < line_1.length; i++) {
                self.initFlag && line_1[i].setAttribute("stroke", self.settings.sectionColors[0]);
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
                    if (self.SectionFlowData[sectionId]) {
                        var section = self.SectionFlowData[sectionId];
                        flow = section.flow || 0;
                        lineNo = section.line || "";
                        crowd = self.getSectionCrowd(lineNo, flow);
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
                        self.showInfoWindow(svgDocument.querySelector("#section_window"), (x1 + x2) / 2, (y1 + y2) / 2);
                    } else if (targetEl.localName == "path") {
                        var len = targetEl.getTotalLength();
                        var point = targetEl.getPointAtLength(len / 2.5);
                        self.showInfoWindow(svgDocument.querySelector("#section_window"), point.x, point.y);
                    }
                });
            }
            var station_1 = document.getElementsByClassName("station-line");
            for (var j = 0; j < station_1.length; j++) {
                self.initFlag && station_1[j].setAttribute("stroke", "#dddddd");
                self.initFlag && station_1[j].setAttribute("fill", self.settings.stationColors[1]);
                station_1[j].addEventListener('click', function (e) {
                    var targetEl = e.target;
                    var stationId = targetEl.getAttribute("id");
                    var _stationName = targetEl.getAttribute("name");
                    var inFlow = 0;
                    var outFlow = 0;
                    var exFlow = 0;
                    var stationName = "未知站点";
                    if (self.StationFlowData[stationId]) {
                        var station = self.StationFlowData[stationId];
                        inFlow = station.in || 0;
                        outFlow = station.out || 0;
                        stationName = station.station;
                        exFlow = station.trans;
                    }else{
                        stationName = _stationName || "未知站点";
                    }
                    svgDocument.querySelector("#info_station_name").innerHTML = stationName;
                    svgDocument.querySelector("#info_station_id").innerHTML = stationId;
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
                    self.showInfoWindow(svgDocument.querySelector("#station_window"), cx, cy);
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
                    if (self.StationFlowData[stationId]) {
                        var station = self.StationFlowData[stationId];
                        inFlow = station.in || 0;
                        outFlow = station.out || 0;
                        stationName = station.station;
                        exFlow = station.trans;
                    }else{
                        stationName = _stationName || "未知站点";
                    }
                    svgDocument.querySelector("#info_station_name").innerHTML = stationName;
                    svgDocument.querySelector("#info_station_id").innerHTML = stationId;
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
                    self.initFlag && targetEl.setAttribute("stroke", self.settings.stationColors[1]);
                    var len = targetEl.getTotalLength();
                    var point = targetEl.getPointAtLength(len / 2.5);
                    self.showInfoWindow(svgDocument.querySelector("#station_window"), point.x, point.y);
                });
            });
            if (self.initFlag) {
                self.initFlag = false;
            }
        },
        bindDirectionAnimation : function(svgDocument){
            var lineDirections = svgDocument.getElementsByClassName("line-direction");
            $.each(lineDirections, function (i, el) {
                var polygons = el.querySelectorAll("polygon");
                polygons[2] && polygons[2].setAttribute("class", "direction-animation1");
                polygons[1] && polygons[1].setAttribute("class", "direction-animation2");
                polygons[0] && polygons[0].setAttribute("class", "direction-animation3");
            });
        },
        showInfoWindow:function(infoWindow, x, y){
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
                var flag = 5;
                while (parent.getAttribute("class") != "info-window" && flag) {
                    parent = parent.parentElement;
                    flag--;
                }
                parent.style.display = "none";
            });
            //绑定信息窗口进入站点详情事件
            _infoWindow.getElementsByClassName("enter-station")[0].addEventListener('click', function (e) {
                e.stopPropagation();
                e.stopImmediatePropagation();
                var parent = e.target;
                var flag = 5;
                while (parent.getAttribute("class") != "info-window" && flag) {
                    parent = parent.parentElement;
                    flag--;
                }
                var stationId = parent.querySelector("#info_station_id").innerHTML;
                var stationName = parent.querySelector("#info_station_name").innerHTML;
                showStationDetail(stationId.substring(1),stationName);
            });
        },
        loadSectionFlow:function(requireSeries){
            var self = this;
            //var url = SERVER_IP + "/subway/api/stationflow";
            var url = self.settings.sectionFlowUrl;
            $.get(url, function (data) {
                if (data) {
                    if (requireSeries > self.SectionRequireSeries) {
                        //该次更新无效
                        return
                    }
                    if (requireSeries > self.SectionUpdateSeries || requireSeries == 1) {
                        self.SectionUpdateSeries = requireSeries;
                        $.each(data, function (i, section) {
                            if (!section) {
                                return true
                            }
                            var sectionLine = self.svgDocument.querySelectorAll("#L" + section.flowno);
                            if (sectionLine.length) {
                                var color = self.getSectionColor(section.line, section.flow);
                                for (var j = 0; j < sectionLine.length; j++) {
                                    sectionLine[j].setAttribute("stroke", color);
                                }
                            }
                            //更新区间数据
                            self.SectionFlowData["L" + section.flowno] = section;
                        });
                        console.log("section flow update successfully by the No." + requireSeries + " request!");
                        if (requireSeries > 1000000) {
                            self.SectionUpdateSeries = 0;
                            self.SectionRequireSeries = 0;
                        }
                    } else {
                        console.log("No." + requireSeries + " request section flow data is old,drop it!");
                    }
                }
            });
        },
        getSectionColor:function(lineNo, flow){
            var self = this;
            var color = self.settings.sectionColors[0];
            switch (lineNo) {
                case "2611":
                    color = flow >= 1469 ? self.settings.sectionColors[2] : (flow >= 979 ? self.settings.sectionColors[1] : self.settings.sectionColors[0]);
                    break;
                case "2411":
                    color = flow >= 2134 ? self.settings.sectionColors[2] : (flow >= 1422 ? self.settings.sectionColors[1] : self.settings.sectionColors[0]);
                    break;
                case "2610":
                    color = flow >= 1469 ? self.settings.sectionColors[2] : (flow >= 979 ? self.settings.sectionColors[1] : self.settings.sectionColors[0]);
                    break;
                case "2410":
                    color = flow >= 2134 ? self.settings.sectionColors[2] : (flow >= 1422 ? self.settings.sectionColors[1] : self.settings.sectionColors[0]);
                    break;
                default :
                    color = flow >= 1930 ? self.settings.sectionColors[2] : (flow >= 1286 ? self.settings.sectionColors[1] : self.settings.sectionColors[0]);
                    break;
            }
            if (flow < 0) {
                color = self.sectionColors[3];//未开通，灰色
            }
            return color;
        },
        getSectionCrowd:function(lineNo, flow){
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
        },
        getStationColor:function(flowIn,flowOut){
            if(flowIn < 0)
            {
                return this.settings.stationColors[0];
            }
            var flow = flowIn + flowOut;
            return flow >= 5000 ? this.settings.stationColors[3] : (flow < 3000 ? this.settings.stationColors[1] : this.settings.stationColors[2]);
        },
        loadStationFlow:function(requireSeries){
            var self = this;
            //var url = SERVER_IP + "/subway/api/station";
            var url = self.settings.stationFlowUrl;
            $.get(url, function (data) {
                if (data) {
                    if (requireSeries > self.StationRequireSeries) {
                        //该次更新无效
                        return
                    }
                    if (requireSeries > self.StationUpdateSeries || requireSeries == 1) {
                        self.StationUpdateSeries = requireSeries;
                        $.each(data, function (i, station) {
                            if (!station) {
                                return true
                            }
                            var stationEls = self.svgDocument.querySelectorAll("#S" + station.stationid);
                            if (stationEls.length) {
                                var color = self.getStationColor(station.in,station.out);
                                for (var j = 0; j < stationEls.length; j++) {
                                    //站点分为普通站，终点站，换乘站
                                    //特殊处理换乘站
                                    if (stationEls[j].localName == "g") {
                                        var firstChild = stationEls[j].children[0];
                                        firstChild.setAttribute("stroke", "#dddddd");
                                        firstChild.setAttribute("fill", color);
                                    } else {
                                        stationEls[j].setAttribute("stroke", "#dddddd");
                                        stationEls[j].setAttribute("fill", color);
                                    }
                                }
                            }
                            //更新站点客流数据
                            self.StationFlowData["S" + station.stationid] = station;
                        });
                        console.log("station in out flow update successfully by the No." + requireSeries + " request!");
                        if (requireSeries > 1000000) {
                            self.StationUpdateSeries = 0;
                            self.StationRequireSeries = 0;
                        }
                    } else {
                        console.log("No." + requireSeries + " request station in out flow data is old,drop it!");
                    }
                }
            });
        },
        highLightLine:function(lineNo){
            var self = this;
            var svgDocument = self.svgDocument;
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
        },
        highLightOrg:function(orgName){
            var self = this;
            var svgDocument = self.svgDocument;
            if (!orgName) {
                return
            }
            if (orgName == "0") {
                //显示全网
                //svgDocument.getElementById("cover_layer").style.display = "none";
                return
            }
        },
        isArray:function(obj){
            return Object.prototype.toString.call(obj) === '[object Array]';
        },
        //创建客流预警提示框
        createFlowWarningTips:function(stationId,stationInfo){
            var self = this;
            var svgDocument = self.svgDocument;
            if(!stationId)
            {
                return
            }
            var _warningTips = svgDocument.getElementById("warningTipsTemp").cloneNode(true);
            var bbox = Snap.path.getBBox(_warningTips.firstElementChild.firstElementChild.getAttribute("d"));
            var tipsContent = svgDocument.getElementById("tipsContent");
            var tipsPoint;
            var station;
            station = svgDocument.getElementById("S" + stationId);
            if(station)
            {
                tipsPoint = self.getTipsPoint(svgDocument,stationId,bbox,29,15);
                _warningTips = _warningTips.cloneNode(true);
                _warningTips.id = "flowWarning_" + stationId;
                _warningTips.setAttribute("transform", "translate(" + tipsPoint[0] + " " + tipsPoint[1] + ")");
                _warningTips.setAttribute("data-stationInfo",JSON.stringify(stationInfo));
                _warningTips.addEventListener("click",function(e){
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    var target = e.target;
                    var tryCount = 4;//防无限循环
                    while(tryCount && (!target.getAttribute("id") || target.getAttribute("id").indexOf("flowWarning") < 0))
                    {
                        target = target.parentElement;
                        tryCount--;
                    }
                    if(target.getAttribute("id").indexOf("flowWarning") >= 0)
                    {
                        //客流预警点击事件
                        //todo
                        var stationInfo = target.getAttribute("data-stationInfo");
                        showStationDetail(stationInfo);
                    }else{
                        console.log("Can't found parent");
                    }
                });
                tipsContent.appendChild(_warningTips);
            }
        },
        getTipsPoint:function(svgDocument,stationId,tipsBBox,fw,fh){
            var station = svgDocument.getElementById("S" + stationId);
            var point;
            var len;
            var x;
            var y;
            var tx,ty;
            if(station) {
                if (station.localName == "path") {
                    len = station.getTotalLength();
                    point = station.getPointAtLength(len / 2);
                    x = point.x;
                    y = point.y;
                    tx = x - tipsBBox.width / 2 - 18 + fw;
                    ty = y - tipsBBox.height - 33 + fh;//手动修正
                } else if (station.localName == "circle") {
                    x = station.getAttribute("cx");
                    y = station.getAttribute("cy");
                    tx = x - tipsBBox.width / 2 - 29 + fw;
                    ty = y - tipsBBox.height - 25 + fh;//手动修正
                } else if (station.localName == "g") {
                    station = station.firstElementChild;
                    len = station.getTotalLength();
                    point = station.getPointAtLength(len / 2);
                    x = point.x;
                    y = point.y;
                    if (stationId == "1268030000" || stationId == "1268003000" || stationId == "1241013000") {
                        //宝安中心、老街、红树湾南特殊处理
                        tx = x - tipsBBox.width / 2 - 5 + fw;
                        ty = y - tipsBBox.height - 60 + fh;//手动修正
                    } else {
                        tx = x - tipsBBox.width / 2 - 38 + fw;
                        ty = y - tipsBBox.height - 35 + fh;//手动修正
                    }
                }
            }else{
                return [0,0];
            }
            return [tx,ty];
        },
        //创建普通关注人员提示框
        createNormalFocusTips:function(stationId,focusList){
            var self = this;
            var svgDocument = self.svgDocument;
            if(!stationId)
            {
                return
            }
            var _normalTips = svgDocument.getElementById("normalFocusTipsTemp").cloneNode(true);
            var bbox = Snap.path.getBBox(_normalTips.firstElementChild.firstElementChild.getAttribute("d"));
            var tipsContent = svgDocument.getElementById("tipsContent");
            var tipsPoint;
            var station;
            station = svgDocument.getElementById("S" + stationId);
            if(station)
            {
                tipsPoint = self.getTipsPoint(svgDocument,stationId,bbox,27,20);
                _normalTips = _normalTips.cloneNode(true);
                _normalTips.id = "normalFocus_" + stationId;
                _normalTips.setAttribute("transform", "translate(" + tipsPoint[0] + " " + tipsPoint[1] + ")");
                _normalTips.setAttribute("data-point",tipsPoint);
                _normalTips.setAttribute("data-focusList",JSON.stringify(focusList));
                _normalTips.lastElementChild.firstElementChild.innerHTML = focusList.length;
                _normalTips.addEventListener("click",function(e){
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    var target = e.target;
                    var tryCount = 4;//防无限循环
                    while(tryCount && (!target.getAttribute("id") || target.getAttribute("id").indexOf("normalFocus") < 0))
                    {
                        target = target.parentElement;
                        tryCount--;
                    }
                    if(target.getAttribute("id").indexOf("normalFocus") >= 0)
                    {
                        self.createList(svgDocument,target.getAttribute("id"),"normalListTemp",JSON.parse(target.getAttribute("data-focusList")),"focus",0,0);
                    }else{
                        console.log("Can't found parent");
                    }
                });
                tipsContent.appendChild(_normalTips);
            }
        },
        //创建重点关注人员提示框
        createImportantFocusTips:function(stationId,focusList){
            var self = this;
            var svgDocument = self.svgDocument;
            if(!stationId)
            {
                return
            }
            var _importantTips = svgDocument.getElementById("importantFocusTipsTemp").cloneNode(true);
            var bbox = Snap.path.getBBox(_importantTips.firstElementChild.firstElementChild.getAttribute("d"));
            var tipsContent = svgDocument.getElementById("tipsContent");
            var tipsPoint;
            var station;
            station = svgDocument.getElementById("S" + stationId);
            if(station)
            {
                tipsPoint = self.getTipsPoint(svgDocument,stationId,bbox,28,20);
                _importantTips = _importantTips.cloneNode(true);
                _importantTips.id = "importantFocus_" + stationId;
                _importantTips.setAttribute("transform", "translate(" + tipsPoint[0] + " " + tipsPoint[1] + ")");
                _importantTips.setAttribute("data-point",tipsPoint);
                _importantTips.setAttribute("data-focusList",JSON.stringify(focusList));
                _importantTips.lastElementChild.firstElementChild.innerHTML = focusList.length;
                _importantTips.addEventListener("click",function(e){
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    var target = e.target;
                    var tryCount = 4;//防无限循环
                    while(tryCount && (!target.getAttribute("id") || target.getAttribute("id").indexOf("importantFocus") < 0))
                    {
                        target = target.parentElement;
                        tryCount--;
                    }
                    if(target.getAttribute("id").indexOf("importantFocus") >= 0)
                    {
                        self.createList(svgDocument,target.getAttribute("id"),"importantListTemp",JSON.parse(target.getAttribute("data-focusList")),"focus",0,0);
                    }else{
                        console.log("Can't found parent");
                    }
                });
                tipsContent.appendChild(_importantTips);
            }
        },
        //创建警员提示框
        createPoliceTips:function(stationId,policeList){
            var self = this;
            var svgDocument = self.svgDocument;
            if(!stationId)
            {
                return
            }
            var _policeTips = svgDocument.getElementById("policeTipsTemp").cloneNode(true);
            var bbox = Snap.path.getBBox(_policeTips.firstElementChild.firstElementChild.getAttribute("d"));
            var tipsContent = svgDocument.getElementById("tipsContent");
            var tipsPoint;
            var station;
            station = svgDocument.getElementById("S" + stationId);
            if(station)
            {
                tipsPoint = self.getTipsPoint(svgDocument,stationId,bbox,28,20);
                _policeTips = _policeTips.cloneNode(true);
                _policeTips.id = "polices_" + stationId;
                _policeTips.setAttribute("transform", "translate(" + tipsPoint[0] + " " + tipsPoint[1] + ")");
                _policeTips.setAttribute("data-point",tipsPoint);
                _policeTips.setAttribute("data-policeList",JSON.stringify(policeList));
                _policeTips.lastElementChild.firstElementChild.innerHTML = policeList.length;
                _policeTips.addEventListener("click",function(e){
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    var target = e.target;
                    var tryCount = 4;//防无限循环
                    while(tryCount && (!target.getAttribute("id") || target.getAttribute("id").indexOf("polices") < 0))
                    {
                        target = target.parentElement;
                        tryCount--;
                    }
                    if(target.getAttribute("id").indexOf("polices") >= 0)
                    {
                        self.createList(svgDocument,target.getAttribute("id"),"policeListTemp",JSON.parse(target.getAttribute("data-policeList")),"police",0,0);
                    }else{
                        console.log("Can't found parent");
                    }
                });
                tipsContent.appendChild(_policeTips);
            }
        },
        //创建头像marker
        createImageMark:function(stationId,markUrl){
            var self = this;
            var svgDocument = self.svgDocument;
            if(!stationId)
            {
                return
            }
            var _imgMark = svgDocument.getElementById("policeImgTemp").cloneNode(true);
            if(markUrl)
            {
                _imgMark.lastElementChild.setAttribute("xlink:href",markUrl);
            }
            var bbox = Snap.path.getBBox(_imgMark.firstElementChild.firstElementChild.getAttribute("d"));
            var tipsContent = svgDocument.getElementById("tipsContent");
            var tipsPoint;
            var station;
            if(self.isArray(stationId))
            {
                $.each(stationId,function(i,item){
                    if(!item)
                    {
                        return true
                    }
                    station = svgDocument.getElementById("S" + item);
                    if(station)
                    {
                        tipsPoint = self.getTipsPoint(svgDocument,item,bbox,28,15);
                        _imgMark = _imgMark.cloneNode(true);
                        _imgMark.id = "imgMark_" + item;
                        _imgMark.setAttribute("transform", "translate(" + tipsPoint[0] + " " + tipsPoint[1] + ")");
                        tipsContent.appendChild(_imgMark);
                    }
                });
            }else{
                station = svgDocument.getElementById("S" + stationId);
                if(station)
                {
                    tipsPoint = self.getTipsPoint(svgDocument,stationId,bbox,28,15);
                    _imgMark = _imgMark.cloneNode(true);
                    _imgMark.id = "imgMark_" + stationId;
                    _imgMark.setAttribute("transform", "translate(" + tipsPoint[0] + " " + tipsPoint[1] + ")");
                    tipsContent.appendChild(_imgMark);
                }
            }
            console.log(tipsPoint);
            self.panAndZoomToPoint(tipsPoint[0],tipsPoint[1],4);
        },
        getListPoint:function(svgDocument,tipsId,fw,fh){
            var _tips = svgDocument.getElementById(tipsId);
            if(!_tips)
            {
                return [0,0];
            }
            var tipsPoint = _tips.getAttribute("data-point").split(",");
            var bbox = Snap.path.getBBox(_tips.firstElementChild.firstElementChild.getAttribute("d"));
            return [parseFloat(tipsPoint[0]) + bbox.width + 20 + fw,parseFloat(tipsPoint[1]) + fh];
        },
        createList:function(svgDocument,tipsId,listTempId,listData,listType,fw,fh){
            var self = this;
            var _list = svgDocument.getElementById(listTempId).cloneNode(true);
            _list.id = "list_" + tipsId;
            var listPoint = self.getListPoint(svgDocument,tipsId,fw,fh);
            _list.setAttribute("transform", "translate(" + listPoint[0] + " " + listPoint[1] + ")");
            var _ul = _list.lastElementChild;
            var li = svgDocument.createElementNS("http://www.w3.org/2000/svg","text");
            li.setAttribute("class","list-li");
            li.setAttribute("x","0");
            li.setAttribute("y","0");
            li.setAttribute("font-size","18");
            li.setAttribute("fill",_list.firstElementChild.getAttribute("stroke"));
            var _li;
            for(var i = 0;i < listData.length;i++)
            {
                _li = li.cloneNode(true);
                _li.setAttribute("x","20");
                _li.setAttribute("y","" + (i * 30 + 25));
                _li.setAttribute("data-userinfo",JSON.stringify(listData[i]));
                _li.setAttribute("data-usertype",listType);
                _li.setAttribute("data-url",listData[i].url || "");
                _li.innerHTML = listData[i].username || listData[i].realname || listData[i].name || "未知姓名";
                _ul.appendChild(_li);
            }
            //绑定li点击事件
            _ul.addEventListener("click",function(e){
                e.stopPropagation();
                e.stopImmediatePropagation();
                var target = e.target;
                if(target.getAttribute("class") == "list-li")
                {
                    var userInfo = target.getAttribute("data-userinfo");
                    var userType = target.getAttribute("data-usertype");
                    var url = target.getAttribute("data-url");
                    //列表项li点击,显示站内轨迹
                    //todo
                    showPersonDetail(userInfo,userType,url);
                }
            });
            //动态计算外框高度
            var height = listData.length * 30 + 10;
            height = height > 30 ? height : 30;
            _list.firstElementChild.setAttribute("height","" + height);
            var listsContent = svgDocument.getElementById("listsContent");
            //listsContent.appendChild(_list); //预留可多个
            listsContent.innerHTML = "";
            listsContent.appendChild(_list);
        },
        clearTips:function(){
            this.svgDocument.getElementById("tipsContent").innerHTML = "";
            this.clearList();
        },
        clearList:function(){
            this.svgDocument.getElementById("listsContent").innerHTML = "";
        },
        //画轨迹
        drawTrack:function(trackArray){

        }
    };
    window.SubwaySVG = SubwaySVG;
})(jQuery,svgPanZoom,Hammer);