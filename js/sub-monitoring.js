$(function(){
	$('.spanNav').find('span').on('click',function(){//三级导航点击 实现相对信息
		$(this).siblings('span').removeClass('spanActive');
		$(this).addClass('spanActive');
		var navText = $(this).text();
		if(navText=='站点客流'){
			console.log("站点客流");
		}else if(navText=='平均驻留时间'){
			console.log("平均驻留时间");
		}else if(navText=='峰值客流密度'){
			console.log("峰值客流密度");
		}else if(navText=='警情'){
			console.log("警情");
		}else if(navText=='在线警员'){
			console.log("在线警员");
		}else if(navText=='重点人员'){
			console.log("重点人员");
		}
	})
	var chartData = {x: ['06:00','06:16','06:32','06:48','07:04','07:20'],y: [1120, 1520, 1842, 3530, 4535, 4825]};
	passenger_chart('passengerChart',chartData)
	function passenger_chart(id,data){
		$("#" + id).empty();
        var myChart = echarts.init(document.getElementById(id));
        var option = {
			color: ['#4095e6'], //设置颜色调色盘
			grid: {
				show: false,
				containLabel: false,
				left: '60',
				right: '20',
				top: '40',
				bottom: '25'
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
