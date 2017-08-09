$(function(){
	var subway;
	var stationdata//站点实时客流top5数据
	var stationforcast//站点预测值和警戒值 top5数据
    window.onload = function () {
        subway = new SubwaySVG(document.getElementById("subwayMap"), {'flowModel': true});
    };
    $('#layerToolControl').on('mouseenter',function(){
    	$('#layerToolBody').show()
    })
    $('#layerToolBody').on('mouseleave',function(){
    	$(this).hide()
    })
	var myDate = new Date()
	var years = myDate.getFullYear()
	var month = timeFormat(myDate.getMonth()+1);
	var day = timeFormat(myDate.getDate());
	var hours = timeFormat(myDate.getHours());
	var minutes = timeFormat(myDate.getMinutes());
	function timeFormat(time){//格式化时间
		return time<10?("0"+time):time
	}
	var thisDate=years+'-'+month+'-'+day//当前时间年月日
    getJamIndex(thisDate,serverIP4);
	window.showStationDetail = function(stationId,stationName) {
	    window.top.stationMonitor = {
	        stationId: stationId,
            stationName: stationName
        };
        $('#iframe',parent.document).attr('src','template/traffic-monitoring/site-monitoring.html')
    };
    function getJamIndex(date,severIP){//获取拥堵系数 date是当前日期 格式为2017-05-18
    	var url = document.location.href
		if(url.indexOf('http://10.204.113.243')!=-1){//公安内网测试暂时固定时间2017-05-18
			date = '2017-05-18'
		}
	    $.ajax({//请求获取拥堵指数
			type:"get",
			url: severIP + "/api/traffic_congestion",//http://192.168.40.87:8998/api/traffic_congestion
			async:true,
			dataType: 'json',
			data:{
	            date: date//时间   格式为2017-05-17
	        },
			success:function(res){
				console.log('res',res);
				if(!res.data.current){
					return
				}{
				var index=parseFloat(res.data.current.trafficCongestionIndex).toFixed(2);
				if(index<1){
					$('.line_block').find('span').css('opacity',0.2)
					$('.line_block').find('.span_green').css('opacity',1)
				}else if(index<2){
					$('.line_block').find('span').css('opacity',0.2)
					$('.line_block').find('.span_yellow').css('opacity',1)
				}else{
					$('.line_block').find('span').css('opacity',0.2)
					$('.line_block').find('.span_red').css('opacity',1)
				}
				$('.congestion').find('.index').text(index)
				var history={}
				history.x=[]
				history.y=[]
				var length = res.data.history.length
				for(var i=length-361;i>-1;i--){
					var nhours=(res.data.history[i].time).substring(11,13)
					var nminutes=(res.data.history[i].time).substring(14,17)
					history.x.push(res.data.history[i].time)
					history.y.push(res.data.history[i].trafficCongestionIndex)
					if((nhours==hours)&&(nminutes==minutes)){
						console.log("this return");
						i = -1
					}
				}
				chartIndex('chartIndex',history,'拥堵指数');
				}
			},
			error: function () {
	            console.log('获取拥堵指数失败...');
	        }
		});
    }
    getInOutNum(0,serverIP3)
    function getInOutNum(type,severIP){//获取进出站实时人数     type=0数据为实时进站人数（即：实时出行人数）  type=1数据为实时站内人数 type=2 区间客流系数排行
    	if(severIP=="http://192.168.40.99:8080"){
    		severIP="http://192.168.40.130:9999"
    	}
    	console.log(severIP);
	    $.ajax({
			type:"get",
			url: severIP + "/subway/api/getAllData",//http://192.168.40.130:9999/subway/api/getAllData
			async:true,
			dataType: 'json',
			success:function(res){console.log('re1s',res);
				var chartData={}
				chartData.x=[]
				chartData.y=[]
				var allonloadPlot = res.Plot.allonloadPlot;//实时在网人数
				var allonloadPlotLength = allonloadPlot.length;
				$('.onsite').find('.index').text(((allonloadPlot[allonloadPlotLength-1].load)/10000).toFixed(2))
				var allinPlot = res.Plot.allinPlot;//实时进站人数
				var allinPlotLength = allinPlot.length
				$('.travel').find('.index').text(((allinPlot[allinPlotLength-1].sumin)/10000).toFixed(2))
				if(type==1){
					for(var i=0;i<allonloadPlotLength;i++){
						chartData.x.push(allonloadPlot[i].time)
						chartData.y.push(allonloadPlot[i].load)
					}
					category('chartPeopleNum',chartData);
				}else if(type==0){
					for(var i=0;i<allinPlotLength;i++){
						chartData.x.push(allinPlot[i].time)
						chartData.y.push(allinPlot[i].sumin)
					}
					category('chartPeopleNum',chartData);
				}else if(type==2){
					var section = res.section
					var sectionLength = section.length
					chartData.x1=[]
					chartData.x2=[]
					for(var i=0;i<sectionLength;i++){
						chartData.x1.push(section[i].flow)
						chartData.y.push(section[i].start+'-'+section[i].end);
						if(section[i].flow>0.8){
							chartData.x2.push(section[i].flow-0.8)
						}else{
							chartData.x2.push(0)
						}
					}
					var title = {x1:'满载率',x2:'满债率超出阈值'}
				    drawBar('chart_ranking1', chartData, title);
				}
			},
			error: function () {
	            console.log('获取实时进出站人数数据失败...');
	        }
		});
    }
    $.ajax({//请求获取站点实时客流top5
		type:"get",
		url: serverIP2+"/escopeweb/count/cntservice!getStationTopData.action",//http://police.sibat.cn/escopeweb/count/cntservice!getStationTopData.action
		async:true,
		dataType: 'json',
		success:function(res){console.log('re2s',res);
			//$('.onsite').find('.index').text(((res.allstationcount)/10000).toFixed(2))
			stationdata=res.stationdata//站点实时客流top5   类型：数组对象
			stationdata.y=[]
			stationdata.x1=[]
			stationdata.x2=[]
			for(var i=0;i<stationdata.length;i++){
				stationdata.y.push(stationdata[i].bidname)
				stationdata.x1.push(stationdata[i].visits)
				if(stationdata[i].visits>10000){
					stationdata.x2.push(stationdata[i].visits-10000)
				}else{
					stationdata.x2.push(0)
				}
			}
			console.log(stationdata);
			var title = {x1:'当前客流',x2:'超出阈值'}
    		drawBar('chart_ranking1', stationdata, title);
//			stationforcast=res.stationforcast//站点预测值和警戒值 top5  类型：数组对象
//			stationforcast.bidname=[]
//			stationforcast.visits=[]
		},
		error: function () {
            console.log('获取实时客流top5数据失败...');
        }
	});
	$('.spanNav').find('span').on('click',function(){//三级导航点击 实现相对应得图表信息
		$(this).siblings('span').removeClass('spanActive');
		$(this).addClass('spanActive');
		var navText = $(this).text();
		if(navText=='拥堵指数'){
			$('.chartTravel1').show();
			$('.chartTravel2').hide();
			getJamIndex(thisDate,serverIP4)
		}else if(navText=='出行人数'){
			$('.chartTravel1').hide();
			$('.chartTravel2').show();
			getInOutNum(0,serverIP3)
		}else if(navText=='站内人数'){
			$('.chartTravel1').hide();
			$('.chartTravel2').show();
			getInOutNum(1,serverIP3)
		}else if(navText=='实时客流排行'){
			$('.rankingChart1').show()
			$('.rankingChart2').hide()
			var title = {x1:'当前客流',x2:'超出阈值'}
    		drawBar('chart_ranking1', stationdata, title);
		}else if(navText=='预测客流排行'){
			$('.rankingChart1').hide()
			$('.rankingChart2').show()
            getPredictStationFlow();
			//var chartData = {x1: [5.5, 6, 6.1, 7.5, 8],x2: [0.3, 0.4, 0.5, 1.7, 2] ,y: ['深大','白石龙','侨城东','车公庙','大学城']};
			//var title = {x1:'预测站点客流',x2:'预测还能容纳'};
		   // drawBar('chart_ranking2', chartData, title);
		}
	})
	$('.dropdown-menu').find('li').on('click',function(){//客流排行下拉  显示相对应的数据
		var liTxt=$(this).find('a').text()
		$(this).parent('.dropdown-menu').parent('.dropdown').siblings('.selectVal').val(liTxt);
		if(liTxt=='站点客流排行'){
			if($(this).attr('index')=='menu1'){
				console.log("1-1");
				var title = {x1:'当前客流',x2:'超出阈值'}
				drawBar('chart_ranking1', stationdata, title);
			}else if($(this).attr('index')=='menu2'){
				console.log("2-1");
                getPredictStationFlow();
				//var chartData = {x1: [5.5, 6, 6.1, 7.5, 8],x2: [0.3, 0.4, 0.5, 1.7, 2] ,y: ['深大','白石龙','侨城东','车公庙','大学城']};
				//var title = {x1:'预测站点客流',x2:'预测还能容纳'};
	            //drawBar('chart_ranking2', chartData, title);
			}
		}else if(liTxt=='区间客流排行'){
			if($(this).attr('index')=='menu1'){
				console.log("1-2");
				getInOutNum(2,serverIP3)
			}else if($(this).attr('index')=='menu2'){
				console.log("2-2");
				getPredictSectionFlow();
			}
		}
	})
	function chartIndex(id, data, title){//绘制拥堵指数图表
		$("#" + id).empty();
		var myChart = echarts.init(document.getElementById(id));
		var option = {
		    tooltip: {
		        trigger: 'axis'
		    },
		    grid: {
				show: false,
				containLabel: false,
				left: '30',
				right: '20',
				top: '30',
				bottom: '30'
			},
		    xAxis: {
		        type: 'category',
		        boundaryGap: false,
		        data: data.x,
		        axisTick: {
	                show: false
	            },
		        axisLine: {
                    show: false,
	                lineStyle: {
	                    color: '#333'
	                }
	            },
	            splitLine: {
	                lineStyle: {
	                    type: 'dashed',
	                    color: '#ccc'
	
	                }
	            },
	            axisLabel: {
                     formatter: function(value,index){
                     	var date= new Date(value);
                     	var hour=date.getHours();
                     	hour=hour>9?hour:'0'+hour;
                     	var min=date.getMinutes();
                     	min=min>9?min:'0'+min;
                     	return hour+":"+min
                     }
                },
		    },
		    yAxis: {
		        type: 'value',
		        boundaryGap: [0, '100%'],
		        max: 3,
            	min: 0,
		       	axisTick: {
	                show: false
	            }, 
	            splitLine: {
	                show: false
	            },
	            axisLine: {
                    show: false,
	                lineStyle: {
	                    color: '#333'
	                }
	            },
		    },
		    visualMap: {
	            show: false,
	            pieces: [{
	                gt: 0,
	                lte: 1,
	                color: '#bce592'
	            }, {
	                gt: 1,
	                lte: 2,
	                color: '#fee371'
	            }, {
	                gt: 2,
	                lte: 3,
	                color: '#ed7371'
	            }],
	            outOfRange: {
	                color: '#999'
	            }
	        },
		    color:['#388cfe'],
		    series: [
		        {
		            name:title,
		            type: 'line',
			        smooth: true,
			        showSymbol: false,
			        symbol: 'circle',
			        data: data.y
		        }
		    ]
		};
		myChart.setOption(option);
	}
	function category(id,data){//出行、站内人数曲线图
		$("#" + id).empty();
        var myChart = echarts.init(document.getElementById(id));
        var option = {
            tooltip: {
                trigger: 'axis'
            },
			color: ['#4095e6'], //设置颜色调色盘
			grid: {
				show: false,
				containLabel: false,
				left: '80',
				right: '20',
				top: '30',
				bottom: '30'
			},
			xAxis: [{
				boundaryGap: false,
				type: 'category',
				data: data.x,
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
                     formatter: '{value} 人'
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
				data: data.y,
				smooth: true
			}]
		};
        myChart.setOption(option);
	}
	function drawBar(id,data, title) {//绘制客流排行柱状图
		console.log(data)
        $("#" + id).empty();
        var myChart = echarts.init(document.getElementById(id));
        // 指定图表的配置项和数据
        var option = {
		    tooltip : {
		        trigger: 'axis',
		        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
		            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
		        }
		    },
		    grid: {
		        left: '3%',
		        right: '4%',
		        bottom: '3%',
		        containLabel: true
		    },
		    xAxis:  {
		        type: 'value',
		        name: '万人',
		        axisTick: {
	                show: false
	            },
	            axisLine: {
                    show: false,
	                lineStyle: {
	                    color: '#333'
	                }
	            },
	            splitLine: {
	                lineStyle: {
	                    type: 'dashed',
	                    color: '#ccc'
	
	                }
	            },
		    },
		    yAxis: {
		        type: 'category',
		        data: data.y,
		        axisTick: {
	                show: false
	            },
	            axisLine: {
                    show: false,
	                lineStyle: {
	                    color: '#333'
	                }
	            },
		    },
		    series: [
		        {
		            name: title.x1,
		            type: 'bar',
		            stack: '总量',
		            label: {
		                normal: {
		                    position: 'insideRight',
		            		color:'#4095e6'
		                }
		            },
		            itemStyle: {
			            normal: {
			                color: '#4095e6'
			            }
			        },
		            data: data.x1
		        },
		        {
		            name: title.x2,
		            type: 'bar',
		            stack: '总量',
		            label: {
		                normal: {
		                    position: 'insideRight'
		                }
		            },
		            itemStyle: {
			            normal: {
			                color: '#ecc47f'
			            }
			        },
		            data:  data.x2
		        }
		    ]
		};
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }
    function getPredictSectionFlow() {//获取预测区间客流
        $.get(serverIP4 + "/api/predict_traffic_flow_top5",function (result) {
            console.log(result);
            if(result.status == '200'){
                var chartData = {x1: [],x2: [] ,y: []};
                result.data.sort(function (a, b) {
                    return a.flow - b.flow;
                });
                $.each(result.data,function (i, obj) {
                    if(!obj){
                        return true
                    }
                    chartData.x1.push(obj.flow);
                    var difference = obj.flow-obj.fullFlow;
                    if(difference>0){
                        chartData.x2.push(difference);
					}else{
                        chartData.x2.push(0);
					}
                    chartData.y.push(obj.sectionName);
                });
                var title = {x1:'预测区间客流',x2:'超出阈值'}
                drawBar('chart_ranking2', chartData, title);
            }
		}).fail(function () {

		})
    }

    function getPredictStationFlow() {//获取预测站点客流
        $.get(serverIP4 + "/api/predict_traffic_flow_in_out_top5",function (result) {
            console.log(result);
            if(result.status == '200'){
                var chartData = {x1: [],x2: [] ,y: []};
                result.data.sort(function (a, b) {
                    return a.flow - b.flow;
                });
                $.each(result.data,function (i, obj) {
                    if(!obj){
                        return true
                    }
                    chartData.x1.push(obj.stationOut);
                    var difference = obj.stationOut-obj.threshold;
                    if(difference>0){
                        chartData.x2.push(difference);
                    }else{
                        chartData.x2.push(0);
                    }
                    chartData.y.push(obj.stationName);
                });
                var title = {x1:'预测站点客流',x2:'超出阈值'}
                drawBar('chart_ranking2', chartData, title);
            }
        }).fail(function () {

        })
    }
})
