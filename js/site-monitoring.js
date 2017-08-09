$(function(){
    var stationId = window.top.stationMonitor ? window.top.stationMonitor.stationId : '1268008000';
    var lineSite={};
    lineSite.line1=['罗湖','国贸','老街','大剧院','科学馆','华强路','岗厦','会展中心','购物公园','香蜜湖','车公庙','竹子林','侨城东','华侨城','世界之窗','白石洲','高新园','深大','桃园','大新','鲤鱼门','前海湾','新安','宝安中心','宝体','坪洲','西乡','固戍','后瑞','机场东']
    lineSite.line1s=['1268001000','1268002000','1268003000','1268004000','1268005000','1268006000','1268007000','1268008000','1268009000','1268011000','1268012000','1268013000','1268014000','1268015000','1268016000','1268022000','1268023000','1268024000','1268025000','1268026000','1268027000','1268028000','1268029000','1268030000','1268031000','1268032000','1268033000','1268034000','1268035000','1268036000']
    lineSite.line2=['赤湾','蛇口港','海上世界','水湾','东角头','湾厦','海月','登良','后海','科苑','红树湾','侨城北','深康','安托山','侨香','香蜜','香梅北','景田','莲花西','岗厦北','华强北','燕南','湖贝','新秀']
    lineSite.line2s=['1260011000','1260012000','1260013000','1260014000','1260015000','1260016000','1260017000','1260018000','1260019000','1260020000','1260021000','1260023000','1260024000','1260025000','1260026000','1260027000','1260028000','1260029000','1260030000','1260033000','1260034000','1260035000','1260037000','1260039000']
    lineSite.line3=['益田','石厦','福田','莲花村','华新','通新岭','红岭','晒布','翠竹','田贝','水贝','草埔','布吉','木棉湾','大芬','丹竹头','六约','塘坑','横岗','永湖','荷坳','大运','爱联','吉祥','龙城场','南联','双龙']
    lineSite.line3s=['1261003000','1261004000','1261006000','1261008000','1261009000','1261010000','1261011000','1261013000','1261014000','1261015000','1261016000','1261017000','1261018000','1261019000','1261020000','1261021000','1261022000','1261023000','1261024000','1261025000','1261026000','1261027000','1261028000','1261029000','1261030000','1261031000','1261032000']
    lineSite.line4=['清湖','龙华','龙胜','上塘','红山','深圳北站','白石龙','民乐','上梅林','莲花北','福田口岸','福民','市民中心','少年宫']
    lineSite.line4s=['1262011000','1262012000','1262013000','1262014000','1262015000','1262016000','1262017000','1262018000','1262019000','1262020000']
    lineSite.line5=['临海','宝华','翻身','灵芝','洪浪北','兴东','留仙洞','西丽','大学城','塘朗','长岭陂','民治','五和','坂田','杨美','上水径','下水径','长龙','百鸽笼','布心','太安','怡景','黄贝岭']
    lineSite.line5s=['1263012000','1263013000','1263015000','1263016000','1263017000','1263018000','1263019000','1263020000','1263021000','1263022000','1263023000','1263025000','1263026000','1263027000','1263028000','1263029000','1263030000','1263031000','1263033000','1263034000','1263035000','1263036000','1263037000']
    lineSite.line7=['西丽湖','茶光','珠光','龙井','桃源村','深云','农林','上沙','沙尾','皇岗村','皇岗口岸','赤尾','华强南','黄木岗','八卦岭','红岭北','笋岗','洪湖']
    lineSite.line7s=['1265011000','1265013000','1265014000','1265015000','1265016000','1265017000','1265019000','1265021000','1265022000','1265024000','1265026000','1265028000','1265029000','1265032000','1265033000','1267025000','1265035000','1265036000']
    lineSite.line9=['深湾','深圳湾公园','下沙','香梅','梅景','下梅林','梅村','孖岭','银湖','泥岗','园岭','红岭南','鹿丹村','人民南','向西村','文锦']
    lineSite.line9s=['1267012000','1267013000','1267014000','1267016000','1267018000','1267019000','1267020000','1267022000','1267023000','1267024000','1267026000','1267028000','1267029000','1267030000','1267031000','1267032000']
    lineSite.line11=['红树湾南','南山','宝安','碧海湾','机场','机场北','福永','桥头','塘尾','马安山','沙井','后亭','松岗','碧头']
    lineSite.line11s=['1241013000','1241015000','1241017000','1241018000','1241019000','1241020000','1241021000','1241022000','1241023000','1241024000','1241025000','1241026000','1241027000','1241028000']

    loadBasicInfo(stationId);//加载右侧地铁站信息
    loadline(stationId);//默认选择站点
    getPassenger(stationId,'',0,'passengerChart',serverIP2);//加载右侧站内客流和平均驻留时间图标数据
    getFlow(stationId,'',3,'monitoringChart',serverIP4);//加载右侧进出站数据
    $('#siteRTMap').attr('src',serverIP2+'/escopeweb/content/cn/wifi/heatmapcamera.html?bid=' + stationId);//加载右侧3D图

    $('.line-menu').find('li').on('click',function(){
        $('.site-menu').empty();
        var thisSrc = $(this).find('a').find('img').attr('src');
        $(this).parent('.line-menu').siblings('.btn1').find('img').attr('src',thisSrc);
        var lineCon = thisSrc.split('.png')[0].split('line')[1];
        var lineNum = 'line'+lineCon;
        var lineId = lineNum+'s';
        var siteMenuHtml='';
        for(var i=0;i<lineSite[lineNum].length;i++)
        {
            siteMenuHtml+="<li><a href=\"#\">"+lineSite[lineNum][i]+"</a><span style='display: none'>"+lineSite[lineId][i]+"</span></li>"
        }
        $('.site-menu').append(siteMenuHtml);
        //for(var i=0;i<lineSite.lineCon.length;i++){
        //	console.log(i)
        //siteMenuHtml+="<li><a href=\"#\">"+lineSite.line1[i]+"</a></li>"
        //}
        ////$('.site-menu').html(siteMenuHtml)
        $('.btn2').text('--请选择--');
        $('.site-menu').find('li').on('click',function(){
            var thisTxt = $(this).find('a').text();
            $(this).parent('.site-menu').siblings('.btn2').text(thisTxt);
            var thisId = $(this).find('span').text();
			stationId = thisId;
            loadBasicInfo(thisId);//加载右侧信息
            loadline(thisId);//默认选择站点
            getPassenger(thisId,'',0,'passengerChart',serverIP2);
            getFlow(thisId,'',3,'monitoringChart',serverIP4);
            $('#siteRTMap').attr('src',serverIP2+'/escopeweb/content/cn/wifi/heatmapcamera.html?bid=' + thisId);
            $('.spanActive').removeClass();
            $('.spanNav span').eq(0).addClass('spanActive');
            $('.spanNav span').eq(1).addClass('spanActive');
            $('.spanNav span').eq(3).addClass('spanActive');
        })
    });
    $('.site-menu').find('li').on('click',function(){
        var thisTxt = $(this).find('a').text()
        $(this).parent('.site-menu').siblings('.btn2').text(thisTxt)
        var thisId = $(this).find('span').text()
        stationId = thisId;
        loadBasicInfo(thisId);//加载右侧信息
        loadline(thisId);//默认选择站点
        getPassenger(thisId,'',0,'passengerChart',serverIP2);
        getFlow(thisId,'',3,'monitoringChart',serverIP4);
        $('#siteRTMap').attr('src',serverIP2+'/escopeweb/content/cn/wifi/heatmapcamera.html?bid=' + thisId);
        $('.spanActive').removeClass();
        $('.spanNav span').eq(0).addClass('spanActive');
        $('.spanNav span').eq(1).addClass('spanActive');
        $('.spanNav span').eq(3).addClass('spanActive');
    });

	$('.spanNav').find('span').on('click',function(){//三级导航点击 实现相对信息
		$(this).siblings('span').removeClass('spanActive');
		$(this).addClass('spanActive');
		var navText = $(this).text();
		if(navText=='平均驻留时间'){
			getPassenger(stationId,'',0,'passengerChart',serverIP2)
		}else if(navText=='峰值客流密度'){
			getPassenger(stationId,'',1,'passengerChart',serverIP2)
		}else if(navText=='进站客流'){
			getFlow(stationId,'',3,'monitoringChart',serverIP4)
		}else if(navText=='出站客流'){
			getFlow(stationId,'',4,'monitoringChart',serverIP4)
		}else if(navText=='站内客流'){
			getPassenger(stationId,'',2,'monitoringChart',serverIP2)
		}
	})
//	$('.dropdown-menu').find('li').on('click',function(){//下拉框选择
//		var liTxt=$(this).find('a').text()
//		$(this).parent('.dropdown-menu').parent('.dropdown').siblings('#selectVal').val(liTxt);
//		if(liTxt=='进站客流'){
//			console.log("进站客流");
//		}else if(liTxt=='出站客流'){
//			console.log("出站客流");
//		}
//	})
    function loadBasicInfo (id,date){
        $.ajax({
            type: 'get',
            url: serverIP1 + '/police/api/police/current_station_duty',
            dataType:'json',
            async:true,
            data: {
                station_id: id,
                date: '2017-05-21 16:03:00' //暂时写死时间，公安内网测试日期默认为空
            },
            success: function(res){
                if(res.status == '200'){
                    var police = res.data.police ? res.data.police : '暂无';
                    var station = res.data.station ? res.data.station : '暂无';
                    var policeMan = res.data.policeMan ? res.data.policeMan : '暂无';
                    var phone = res.data.phone ? (res.data.phone.substring(0,3)+"-"+res.data.phone.substring(3,7)+"-"+res.data.phone.substring(7,11)) : '暂无';
                    var html = '';
                    html += '<p>管辖派出所：' + police + '</p>';
                    html += '<p>管所属站区：' + station + '</p>';
                    html += '<p>责任民警：' + policeMan + '</p>';
                    html += '<p>责任民警电话：' + phone + '</p>';
                    $('.p-message').html(html);
                }else{
                    console.log('请求右侧信息失败'+res.msg)
                }
            }
        })
    }

    function loadline(id){
        for(var i=1;i<12;i++){
            var index = 'line'+ i +'s';
            if(lineSite[index]){
                for(var j=0;j<lineSite[index].length;j++){
                    if(lineSite[index][j] == id){
                        var lineNum = 'line'+ i;
                        var lineId = lineNum+'s';
                        var siteMenuHtml='';
                        $('.btn1 img').attr('src','../../img/'+lineNum+'.png');
                        for(var i=0;i<lineSite[lineNum].length;i++)
                        {
                            siteMenuHtml+="<li><a href=\"#\">"+lineSite[lineNum][i]+"</a><span style='display: none'>"+lineSite[lineId][i]+"</span></li>"
                        }
                        $('.site-menu').append(siteMenuHtml);
                        $('.btn2').text(lineSite[lineNum][j]);
                    }
                }
            }
        }
    }

	function getFlow(bid,stime,type,id,serverIP){
		$.ajax({
		type:"get",
		url:serverIP+'/api/traffic_flow_in_out',
		dataType:'json',
		async:true,
		data: {
	           bid: bid,
	           stime: stime
	       },
		success:function(res){
			if(!res.data){
				$("#" + id).empty();
				return
			}else{
			var chartData={};
			chartData.allIn=[];
			chartData.allOut=[];
			var length=res.data.allIn.length;
			var indata=res.data.allIn;
			var  outdata=res.data.allout;
			 chartData.time=[];
			for(var i=length-1;i>=0;i--)
			{
				chartData.allIn.push(indata[i].sumin)
				chartData.allOut.push(outdata[i].sumout)
				chartData.time.push(indata[i].time)
			}
			chartData.x=chartData.time;
			var unit='人'
			if(type==3)
			{
				chartData.y=chartData.allIn
			}
			if(type==4)
			{
				chartData.y=chartData.allOut
			}
			passenger_chart(id,chartData,unit)
			}
		}
	})
	}

	function getPassenger(bid,stime,type,id,serverIP){//type==0  平均驻留时间  type==1  峰值客流密度
		$.ajax({
			type:"get",
			url:serverIP+"/escopeweb/count/cntservice!getStationRealData.action",//原始ip：http://police.sibat.cn
			async:true,
			data: {
	            bid: bid,//
	            stime: stime
	       	},
	       	dataType: 'json',
	       	success:function(res){
					
	       		var chartData={};
	       		chartData.time=[];
	       		chartData.avgstay=[];
	       		chartData.midu=[];
	       		chartData.visits=[];
	       		console.log(res.stationdata);
	       		if(res.stationdata.length){
		       		var stationdata = res.stationdata[0].data;//res.stationdata[0] 会展中心数据
		       		var length = stationdata.length;
		       		for(var i=length-1;i>=0;i--){
		       			chartData.time.push(stationdata[i].time);
		       			chartData.avgstay.push(stationdata[i].avgstay);
		       			chartData.midu.push(stationdata[i].midu);
		       			chartData.visits.push(stationdata[i].visits)
		       		}
		       		$(".congestion").find(".index").html(stationdata[0]? (stationdata[0].visits || '0'):'-');
                    $(".travel").find(".index").html(stationdata[0]? (stationdata[0].avgstay || '0'):'-');
                    $(".onsite").find(".index").html(stationdata[0]? (stationdata[0].midu || '0'):'-');
	       		}
	       		chartData.x = chartData.time;
	       		var unit = '人';
	       		if(type==0){
	       			chartData.y = chartData.avgstay;
	       			unit = '秒';
	       		}else if(type==1){
	       			chartData.y = chartData.midu;
	       			unit = '';
	       		}else if(type==2){
	       			chartData.y = chartData.visits;
	       		}
	       		passenger_chart(id,chartData,unit)
	       	},
	       	error: function () {
	            console.log('获取平均驻留时间、峰值密度数据失败...');
	        }
		});
	}

	function passenger_chart(id,data,unit){
		$("#" + id).empty();
        var myChart = echarts.init(document.getElementById(id));
        var option = {
			color: ['#4095e6'], //设置颜色调色盘
			grid: {
				show: false,
				containLabel: false,
				left: '85',
				right: '60',
				top: '35',
				bottom: '10'
			},
			xAxis: [{
				boundaryGap: false,
				type: 'category',
				data: data.x,
				axisLabel: {
                     formatter: function(value,index){
                     	if(value){
                            var date= new Date(value);
                            var hour=date.getHours();
                            hour=hour>9?hour:'0'+hour;
                            var min=date.getMinutes();
                            min=min>9?min:'0'+min;
                            return hour+":"+min
						}else{
                     		return value
						}
                     }
                },
				splitLine: { //横向分割线不显示
					show: false
				},
				axisLine: {
					show: false
				},
				axisTick: {
					show: false
				}
			}],
			yAxis: [{
				boundaryGap: false,
				axisLabel: {
                     formatter: '{value} ' + unit
                },
				splitLine: { //横向分割线不显示
					show: false
				},
				axisLine: {
					show: false
				},
				axisTick: {
					show: false
				}
			}],
			series: [{
				name: '人数',
				type: 'line',
				showSymbol: false,
				areaStyle: {
					normal: {
						opacity: 0.9
					}
				},
	            markLine : {
	            	itemStyle:{
	            		normal:{
	            			color:'red'
	            		}
	            	},
	                data : [
	                    {type : 'max', name: '最大值'}
	                ]
	            },
				data: data.y,
				smooth: true
			}]
		};
        myChart.setOption(option);
	}
})
