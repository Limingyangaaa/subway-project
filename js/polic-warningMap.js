var thisSrc = $('#iframe',parent.document).attr('src');
thisType = thisSrc.substring(thisSrc.indexOf('=')+1,thisSrc.length)//获取显示的是地铁or公交   1为地铁  2为公交
$(function(){
	$("#selectType").simpleCanleder();
	$('.hover-show').on('mouseenter',function(){
		$(this).siblings('.bus-or-sub').show()
	})
	$('.bus-or-sub').on('mouseleave',function(){
		$('.bus-or-sub').hide()
	})
	var Date=$("#selectType").val()
	getWarningInfo(serverIP3,serverIP1,Date)
})
	function getWarningInfo(serverIP0,serverIP1,date){
		if(thisType==1){
			$('#mapIframe').attr('src',serverIP0 + '/police-situation-map/sub.html?date='+date)
		}else if(thisType==2){
			$('#mapIframe').attr('src',serverIP0 + '/police-situation-map/bus.html?date='+date)
		}
		var typeContent
		if(thisType==1)
		{
			typeContent='subway'
		}
		else if(thisType==2)
		{
			typeContent='bus'
		}
		$.ajax({//获取本月警情数
			type:"get",
			url:serverIP1+"/police/api/event/metro/statistic/month",//原始ip：http://192.168.40.87:8997
			async:true,
			dataType: 'json',
			data: {
	            date: date,//日期年月
	            type:typeContent
	       },
			success:function(res){
				console.log('res3',res);
				$('.passengerNum').text(res.data.currentMonth)//本月警情数
				var chainPercent=(res.data.currentMonth-res.data.lastMonth)/res.data.lastMonth
				$('.chainPercent').text(chainPercent.toFixed(2)+"%")//环比
				var syntropyPercent=(res.data.currentMonth-res.data.lastYear)/res.data.lastYear
				$('.syntropyPercent').text(syntropyPercent.toFixed(2)+"%")//同比
				var Data1=[]
				var legendData=[]
				var category=res.data.category
				for(var i=0;i<category.length;i++){
					Data1.push({value:category[i].count, name:category[i].name})
					legendData.push(category[i].name)
				}
				warningTypeChart('warningTypeChart',legendData,Data1)
				var department = res.data.department
				var Data2={x:[],y:[]}
				for(var i=0;i<department.length;i++){
					Data2.x.push(department[i].police)
					Data2.y.push(department[i].count)
				}
				warningNumChart('warningNumChart',Data2);
			},
			error: function () {
	            console.log('获取本月警情失败...');
	        }
		});
	}
	function warningTypeChart(id,legendData,data){//警情类型饼状图
		$("#" + id).empty();
		var myChart = echarts.init(document.getElementById(id));
		var option = {
		    tooltip: {
		        trigger: 'item',
		        formatter: "{a} <br/>{b}: {c} ({d}%)"
		    },
		    color:['#61a9fe','#f3cf85','#84d19d','#d9796b','#e74538'],
		    legend: {
		    	orient: 'vertical',
		        x : 'right',
        		y : 'bottom',
        		itemWidth: 14,
        		data: legendData
		    },
		    series: [
		        {
		            name:'警情类型',
		            type:'pie',
		            radius: ['50%', '70%'],
		            avoidLabelOverlap: false,
		            label: {
		                normal: {
		                    show: false
		                }
		            },
		            labelLine: {
		                normal: {
		                    show: false
		                }
		            },
		            data:data
		        }
		    ]
		};		
		myChart.setOption(option);
	}
	function warningNumChart(id,data){
		$("#" + id).empty();
		var myChart = echarts.init(document.getElementById(id));
		var option = {
		    color: ['#3398DB'],
		    tooltip : {
		        trigger: 'axis',
		        axisPointer : {     
		            type : 'shadow'      
		        }
		    },
		    grid: {
		        left: '3%',
		        right: '4%',
		        bottom: '3%',
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
		            	show: false,
		                lineStyle: {
		                    color: '#333'
		                }
		            },
		            splitLine: {
		                lineStyle: {
		                    type: 'dashed',
		                    color: '#333'
		
		                }
		            }
		        }
		    ],
		    yAxis : [
		        {
		        	name: '宗',
		            type : 'value',
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
		            }
		        }
		    ],
		    series : [
		        {
		            name:'警情数',
		            type:'bar',
		            barWidth: '60%',
		            data:data.y
		        }
		    ]
		};
		myChart.setOption(option);
	}
