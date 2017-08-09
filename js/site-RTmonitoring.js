$(function(){
	var chartData={x:[2.4, 2.8, 3.5, 4.2, 4.5],y:['M433','M240','K113','369','113']}
	chart_lineRanking('chart_lineRanking',chartData);
	function chart_lineRanking(id,data){
		$("#" + id).empty();
        var myChart = echarts.init(document.getElementById(id));
		option = {
		    tooltip : {
		        trigger: 'axis',
		        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
		            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
		        }
		    },
		    grid: {
		    	top:'30',
		        left: '3%',
		        right: '40',
		        bottom: '3%',
		        containLabel: true
		    },
		    xAxis:  {
		        type: 'value',
		        name: '人次',
		        axisTick: {
	                show: false
	            }, 
	            splitLine: {
	                show: false
	            },
	            axisLine: {
	                lineStyle: {
	                    color: '#ccc'
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
	                lineStyle: {
	                    color: '#ccc'
	                }
	            },
		    },
		    series: [
		        {
		            name: '线路客运量',
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
		            data: data.x
		        }
		    ]
		};
		myChart.setOption(option);
	}
	chartData={x:[2.2, 2.8, 3.2, 4.0, 5.3],y:['深大','水库新村','草埔','白石洲','福田口岸']}
	chart_siteRanking('chart_siteRanking',chartData)
	function chart_siteRanking(id,data){
		$("#" + id).empty();
        var myChart = echarts.init(document.getElementById(id));
		option = {
		    tooltip : {
		        trigger: 'axis',
		        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
		            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
		        }
		    },
		    grid: {
		    	top:'30',
		        left: '0',
		        right: '40',
		        bottom: '3%',
		        containLabel: true
		    },
		    xAxis:  {
		        type: 'value',
		        name: '人次',
		        axisTick: {
	                show: false
	            }, 
	            splitLine: {
	                show: false
	            },
	            axisLine: {
	                lineStyle: {
	                    color: '#ccc'
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
	                lineStyle: {
	                    color: '#ccc'
	                }
	            },
		    },
		    series: [
		        {
		            name: '站点客运量',
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
		            data: data.x
		        }
		    ]
		};
		myChart.setOption(option);
	}
})
