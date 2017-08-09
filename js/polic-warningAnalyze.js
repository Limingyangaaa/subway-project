$(function(){
	$('.input-group .input-group-btn .dropdown-menu li').click(function(){
		$(this).parent().siblings('input').val($(this).text());
	})
	$('.hover-show').on('mouseenter',function(){
		$(this).siblings('.bus-or-sub').show()
	})
	$('.bus-or-sub').on('mouseleave',function(){
		$('.bus-or-sub').hide()
	})
function barChart1(id,data){
		$("#" + id).empty();
		var myChart = echarts.init(document.getElementById(id));
		option = {
				title: {
		        text: data.z,
		        left: '50%',
		        textStyle: {color:'#388cfe'},
		        textAlign: 'center'
		    },
		    color: ['#3398DB'],
		    tooltip : {
		        trigger: 'axis',
		        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
		            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'|'cross'
		        }
		    },
		    grid: {
		        left: '5%',
		        right: '5%',
		        top: '10%',
		        bottom: '10%',
		        containLabel: true
		    },
		    xAxis : [
		        {
		            type : 'category',
		            data : data.x,
		            axisTick: {
		                alignWithLabel: true
		            },
		             axisTick: {
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
		            axisLabel:{
		            	textStyle:{
		            		fontSize:8,
		            		color:'rgba(0,0,0,.7)'
		            	},
		            	rotate: 60,
		            	interval: 0
		            }
		        }
		    ],
		    yAxis : [
		        {
		        	
		            type : 'value',
		             axisLabel:{
		            	textStyle:{
		            		fontSize:8,
		            		color:'rgba(0,0,0,.7)'
		            	}
		            },
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
		            }
		           
		        }
		    ],
		    series : [
		        {
		            name:'警情数',
		            type:'bar',
		            barWidth: '33%',
		            data: data.y
		        }
		    ]
		};
		myChart.setOption(option);
	}
	

	function barChart(id,data){
		$("#" + id).empty();
		var myChart = echarts.init(document.getElementById(id));
		option = {
				title: {
		        text: data.z,
		        left: '50%',
		        textStyle: {color:'#388cfe'},
		        textAlign: 'center'
		    },
		    color: ['#3398DB'],
		    tooltip : {
		        trigger: 'axis',
		        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
		            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'|'cross'
		        }
		    },
		    grid: {
		        left: '15%',
		        right: '10%',
		        top: '10%',
		        bottom: '10%',
		        containLabel: true
		    },
		    yAxis : [
		        {
		            type : 'category',
		            data : data.x,
		            axisTick: {
		                alignWithLabel: true
		            },
		             axisTick: {
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
		            axisLabel:{
		            	textStyle:{
		            		fontSize:8,
		            		color:'rgba(0,0,0,.7)'
		            	}
		            }
		        }
		    ],
		    xAxis : [
		        {
		        	
		            type : 'value',
		             axisLabel:{
		            	textStyle:{
		            		fontSize:8,
		            		color:'rgba(0,0,0,.7)'
		            	}
		            },
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
		            }
		           
		        }
		    ],
		    series : [
		        {
		            name:'警情数',
		            type:'bar',
		            barWidth: '33%',
		            data: data.y
		        }
		    ]
		};
		myChart.setOption(option);
	}

	function pieChart(id,data){
		$("#" + id).empty();
		var myChart = echarts.init(document.getElementById(id));
		option = {
				title: {
		        text: '警情性质分布',
		        x:'center',
		        y:'top',
		        textStyle: {color:'#388cfe'},

		    },
			    tooltip : {
			        trigger: 'item',
			        formatter: "{a} <br/>{b} : {c} ({d}%)"
			    },
			    legend: {
		    	orient: 'vertical',
		        	x : 'right',
        			y : 'bottom',
        			itemWidth: 14,
			        data:data.legendData
			    },
			    
			    calculable : true,
			    color:data.color,
			    series : [
			        {
			            name:'访问来源',
			            type:'pie',
			            radius : ['50%', '70%'],
			            itemStyle : {
			                normal : {
			                    label : {
			                        show : false
			                    },
			                    labelLine : {
			                        show : false
			                    }
			                },
			                emphasis : {
			                    label : {
			                        show : true,
			                        position : 'center',
			                        textStyle : {
			                            fontSize : '30',
			                            fontWeight : 'bold'
			                        }
			                    }
			                }
			            },
			            data:data.data
			        }
			    ]
			};
		myChart.setOption(option);
	}

	function XbarChart(id,data){
		$("#" + id).empty();
		var myChart = echarts.init(document.getElementById(id));
		option = {
			title: {
		        text: data.z,
		        left: '5%',
		        textStyle: {color:'#388cfe'},
		        textAlign: 'center'
		    },
		    color: ['#3398DB'],
		    tooltip : {
		        trigger: 'axis',
		        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
		            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'|'cross'
		        }
		    },
		    grid: {
		        left: '25%',
		        right: '25%',
		        top: '10%',
		        containLabel: true
		    },
		    xAxis : [
		        {
		            type : 'category',
		            data : data.x,
		            axisTick: {
		                alignWithLabel: true
		            },
		             axisTick: {
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
		            axisLabel:{
		            	textStyle:{
		            		fontSize:20,
		            		color:'rgba(145,145,145,1)'
		            	},
		            	interval:0
		            }
		        }
		    ],
		    yAxis : [
		        {
		        	name :'件',
		        	
		            type : 'value',
		             axisLabel:{
		            	textStyle:{
		            		fontSize:20,
		            		color:'rgba(145,145,145,1)'
		            	}
		            },
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
		            }
		           
		        }
		    ],
		    series : [
		        {
		            name:'警情数',
		            type:'bar',
		            barWidth: '15%',
		            data: data.y
		        }
		    ]
		};
		myChart.setOption(option);
	}

$('.check-btn').click(function(){
		var checkTime=$('.inputGroup2 .search-box').text();
		var timeAttr=(checkTime.split('--'));
		var start=$.trim(timeAttr[0]);
		var end=$.trim(timeAttr[1]);
		var type;
		//var dimension;
		var typeContent=$('.inputGroup1 input').val();
		switch(typeContent){
			case '地铁':type='dt'
						  break;
			case '公交':type="gj"
						  break;
		}
		
		console.log(start,end,type);
		//chartShow(start,end,type,dimension);
		chartsShow(start, end , type)

	})
	chartsShow('2016-01-01', '2017-08-01', 'dt')
	function chartsShow(start1, end1, type1) {
		$.ajax({
			type:'get',
			dataType:'json',
			data:{
				start:start1,
				end:end1,
				type:type1,
				dimension:'police'
			},
			url:serverIP1+'/police/api/event/metro/analysis',
			success: function (res) {
				console.log(res)
				 var data=res.data;
         var YY=[];
         var XX=[];
         for(var key in data){
         		 var keyArr = key.split('')
         		 keyArr.splice(-5, 5)
         		 keyStr = keyArr.join('')
             XX.push(keyStr);
             YY.push(data[key]);
         }
         var chartData={};
         chartData.x=XX;chartData.y=YY;
         chartData.z='派出所警情分析'
         console.log(chartData)
         barChart1('chartsR',chartData);
			}
		})

		$.ajax({
			type:'get',
			dataType:'json',
			data:{
				start:start1,
				end:end1,
				type:type1,
				dimension:'line'
			},
			url:serverIP1+'/police/api/event/metro/analysis',
			success: function (res) {
				console.log(res)
				 var data=res.data;
         var YY=[];
         var XX=[];
         for(var key in data){
             XX.push(key);
             YY.push(data[key]);
         }
         var chartData={};
         chartData.x=XX;chartData.y=YY;
         chartData.z='线路警情分析'
         console.log(chartData)
         barChart('chartsMH',chartData);
			}
		})

		$.ajax({
			type:'get',
			dataType:'json',
			data:{
				start:start1,
				end:end1,
				type:type1,
				dimension:'station'
			},
			url:serverIP1+'/police/api/event/metro/analysis',
			success: function (res) {
				console.log(res)
				 var data=res.data;
         var YY=[];
         var XX=[];
         for(var key in data){
             XX.push(key);
             YY.push(data[key]);
         }
         var chartData={};
         chartData.x=XX;chartData.y=YY;
         chartData.z='站点警情分析'
         console.log(chartData)
         barChart('chartsMF',chartData);
			}
		})

		$.ajax({
			type:'get',
			dataType:'json',
			data:{
				start:start1,
				end:end1,
				type:type1,
				dimension:'jqlb'
			},
			url:serverIP1+'/police/api/event/metro/analysis',
			success: function (res) {
				console.log(res)
				 var data=res.data;
         var YY=[];
         var XX=[];
         for(var key in data){
             XX.push(key);
             YY.push(data[key]);
         }
         var chartData={};
         chartData.x=XX;chartData.y=YY;
         chartData.z='警情类型分析'
         console.log(chartData)
         var legendArr = []
         var legendData = []
         for (key in chartData.x) {
         	legendArr.push(key)
         }
         for (var i = 0; i < legendArr.length; i++) {
         	legendData[i] = {
         		value: chartData.y[i], name: chartData.x[i]
         	}
         }
         var pieData={
             color:['rgba(46,96,185,1)','rgba(224,94,81,1)','pink','rgba(160,228,89,1)','rgba(64,149,230,1)','#61a9fe','#f3cf85','#84d19d','#d9796b','#e74538'],
             legendData:legendArr,
             name:'警情性质',
             data:legendData
         }
         pieChart('chartsLH',pieData);
			}
		})

		$.ajax({
			type:'get',
			dataType:'json',
			data:{
				start:start1,
				end:end1,
				type:type1,
				dimension:'jqxz'
			},
			url:serverIP1+'/police/api/event/metro/analysis',
			success: function (res) {
				console.log(res, 'dd')
				var count = res.data['地铁其他警情'] + res.data['地铁刑事警情'] + res.data['地铁治安警情'] + res.data['重复报警'] + res.data['非地铁警情'];
				type_AWidth = (res.data['地铁治安警情']/count)*100;
				type_BWidth = (res.data['地铁刑事警情']/count)*100;
				type_CWidth = (res.data['地铁其他警情']/count)*100;
				type_DWidth = (res.data['重复报警']/count)*100;
				type_EWidth = (res.data['非地铁警情']/count)*100;
				$('.type_A').css('width',type_AWidth+'%')
				$('.type_B').css('width',type_BWidth+'%')
				$('.type_C').css('width',type_CWidth+'%')
				$('.type_D').css('width',type_DWidth+'%')
				$('.type_E').css('width',type_EWidth+'%')
				$('.span-anum').text(parseInt(type_AWidth))
				$('.span-bnum').text(parseInt(type_BWidth))
				$('.span-cnum').text(parseInt(type_CWidth))
				$('.span-dnum').text(parseInt(type_DWidth))
				$('.span-enum').text(parseInt(type_EWidth))
			}
		})

	}

	function isEmptyObject(obj) {
        for (var key in obj) {
            return false;
        }
        return true;
    }
})
