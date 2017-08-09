$(function(){
	var chartData={x:['张李叁', '罗大力', '王小明', '王福泉', '张李叁', '罗大力', '王小明', '王福泉', '王小明', '王福泉'],y1:[20, 15, 12, 11, 10, 10, 11, 9, 7, 6],y2:[11, 12, 8, 10, 7, 9, 8, 4, 7, 5]}
	warning_chart('warning_chart',chartData)
	function warning_chart(id,data){
		$("#" + id).empty();
		var myChart = echarts.init(document.getElementById(id));
		var option = {
		    title: {
		        text: '高危重点人员预警TOP10',
		        right: 'middle',
		        textStyle: {
					color: '#3f96e5',
					fontSize: 16
				}
		    },
		    tooltip: {
		        trigger: 'axis',
		        axisPointer: { // 坐标轴指示器，坐标轴触发有效
		            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
		        }
		    },
		    color:['#4095e6','#fecb00'],
		    legend: {
		        data: ['预警次数', '预警场所'],
		        align: 'right',
		        right: 10,
		        top: 40
		    },
		    grid: {
		        left: '3%',
		        right: '4%',
		        bottom: '3%',
		        containLabel: true
		    },
		    xAxis: [{
		        type: 'category',
		        data: data.x,
		        axisTick: {
	                show: false
	            }, 
	            splitLine: {
	                show: false
	            }
		    }],
		    yAxis: [{
		        type: 'value',
		        name: '次数',
		        axisLabel: {
		            formatter: '{value}'
		        },
		        axisTick: {
	                show: false
	            }, 
	            splitLine: {
	                show: false
	            }
		    }],
		    series: [{
		        name: '预警次数',
		        type: 'bar',
		        data: data.y1
		    }, {
		        name: '预警场所',
		        type: 'bar',
		        data: data.y2
		    }]
		};
		myChart.setOption(option);
	}
})
