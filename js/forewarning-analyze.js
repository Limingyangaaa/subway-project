$(function(){

	$('.input-group .input-group-btn .dropdown-menu li').click(function(){
		$(this).parent().siblings('input').val($(this).text());
	})

	setTimeout(function(){
		var checkTime = $('.inputGroup2 .search-box').text();
		var timeAttr=(checkTime.split('--')); 
		var start=$.trim(timeAttr[0]);
		var end=$.trim(timeAttr[1]);
		chartShow(start,end)
	},10)
	$("#checkBtn").click(function(){
		var dept_id=$('#police-search').val();
		switch(dept_id)
			{
				case '布吉公交派出所'				:dept_id=440396650000
				break;
				case '罗湖公交派出所'				:dept_id=440396540000
				break;
				case '龙华公交派出所'				:dept_id=440396630000
				break;
				case '宝安公交派出所'				:dept_id=440396570000
				break;
				case '南山公交派出所'				:dept_id=440396550000
				break;
				case '福田公交派出所'				:dept_id=440396530000
				break;
				case '龙岗公交派出所'				:dept_id=440396580000
				break;
				case '香蜜湖公交派出所'			:dept_id=440396610000
				break;
				case '坪山公交派出所'				:dept_id=440396600000
				break;
				case '东站公交派出所'				:dept_id=440396660000
				break;
				case '北站公交派出所'				:dept_id=440396640000
				break;
				case '福永公交派出所'				:dept_id=440396620000
				break;
				case '福田枢纽公交派出所'		:dept_id=440396710000
				break;
				case '光明公交派出所'				:dept_id=440396590000
				break;
				case '盐田公交派出所'				:dept_id=440396560000
				break;
				
			}
		var checkTime=$('.inputGroup2 .search-box').text();
		console.log($('.inputGroup2 .search-box').text(),'34')
		var timeAttr=(checkTime.split('--'));
		var start=$.trim(timeAttr[0]);
		var end=$.trim(timeAttr[1]);
		chartShow(start,end,dept_id)
	})
});

function barChart(id,data){
		$("#" + id).empty();
		var myChart = echarts.init(document.getElementById(id));
		option = {
		    color: ['#3398DB'],
		    tooltip : {
		        trigger: 'axis',
		        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
		            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'|'cross'
		        }
		    },
		    grid: {
		        left: '5%',
		        right: '15%',
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
		            		fontSize:14,
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
		            		fontSize:14,
		            		color:'rgba(0,0,0,.7)'
		            	},
		            	formatter:'{value}'+'件'
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

		function lineChart(id,data){//警情总数线图
		$("#" + id).empty();
		var myChart = echarts.init(document.getElementById(id));
		option = {
		    title: {
		        text: '24小时各小时时段预警数分布',
                x:'center',
                y:'top',
		        textStyle: {color:'#388cfe'},
		    },
            grid: {
                left: '10%',
                right: '10%',
                top: '20%',
                bottom: '10%',
                containLabel: true
            },
		    tooltip: {
		        trigger: 'asix'
		    },
		    xAxis: {
		        type: 'category',
		        data: ['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'],
		        boundaryGap: false,
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
	
	                    color: '#ccc'
	
	                },
	                show:true
	            },
	            axisLabel:{
		            	textStyle:{
		            		color:'rgba(0,0,0,.7)'
		            	}
		            }
		    },
		    yAxis: {
		        type: 'value',
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
	            axisLabel:{
		            	textStyle:{
		            		color:'rgba(0,0,0,.7)'
		            	},
		            	formatter:'{value}'+'件'
		            }
		    },
		    color:['#388cfe'],
		    series: [{
		        name: '警情总数',
		        type: 'line',
		        smooth: true,
		        showSymbol: false,
		        symbol: 'circle',
		        data:data
		    }]
		};
		myChart.setOption(option);
	
	}


function pieChart(id,data){
	console.log(data.title)
		$("#" + id).empty();
		var myChart = echarts.init(document.getElementById(id));
		option = {
				title: {
		        text: data.title,
		        x:'center',
		        y:'top',
		        textStyle: {color:'#388cfe'},
		    },
            grid: {
                left: '10%',
                right: '10%',
                top: '10%',
                bottom: '10%',
                containLabel: true
            },

			    tooltip : {
			        trigger: 'item',
			        formatter: "{a} <br/>{b} : {c} ({d}%)"
			    },
			    legend: {
			        x : 'center',
			        y: 'bottom',
			        data:data.legendData
			    },
			    
			    calculable : false,
			    color:['rgba(97,169,254,1)','rgba(31,31,93,1)','rgba(146,208,81,1)','rgba(200,56,48,1)','rgba(64,149,230,1)','rgba(224,94,81,1)','pink'],
			    series : [
			        {
			            name:'访问来源',
			            type:'pie',
			            radius : ['45%', '63%'],
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
			                        show : false,
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
 
function rabarChart(id,data){
		$("#" + id).empty();
		var myChart = echarts.init(document.getElementById(id));
		option = {
			title: {
		        text: '各类警情性质分析',
		        left: '25%',

		        textStyle: {color:'#388cfe'},
		        textAlign: 'center'
		    },
		    color: ['rgba(224,101,90,1)'],
		    tooltip : {
		        trigger: 'axis',
		        show:true      
		    },
		    grid: {
		        left: '30%',
		        right: '30%',
		        top: '30%',
		    },
		    calculable : true,
			polar : [
   			     {
   			         indicator : [
   			             {text : 'A类普通关注', max  : 10},
   			             {text : 'B类积极关注', max  : 10},
   			             {text : 'C类重点关注', max  : 10},
   			             {text : 'D类立即处置', max  : 10}
   			         ],
   			         name:{
   			         	textStyle:{
   			         		fontSize:15
   			         	}
   			         },

   			         radius : 90
   			     }
   			 ],
		     series : [
   			      {
   			          name: '类型',
   			          type: 'radar',
   			          itemStyle: {
   			              normal: {
   			                  areaStyle: {
   			                      type: 'default'
   			                  }
   			              }
   			        },
   			          data : data
   			      }
   			  ]
		    
		};
		myChart.setOption(option);
	}


function chartShow(start,end,dept_id){
		$.ajax({
		type:'get',
		dataType:'json',
		data:{
			start:start,
			end:end,
			dept_id:dept_id
		},
		url:serverIP1+'/police/api/pre_warning/suspect_analysis',
		success:function(res){
			var data=res.data;
			console.log(res);
			var time=data.time;
			var site=data.site;
			var name=data.name;
			var nativePlace=data.nativePlace;
			var zdryState=data.zdryState;
			var zdryType=data.zdryType;
			

			var XX=[];
			var YY=[];
			for(var key in site)
			{
				XX.push(key);
				YY.push(site[key]);
			}
			var chartData={};
			chartData.x=XX;
			chartData.y=YY;
			console.log(chartData)
			barChart('chart-A',chartData);
			
			$('.chartBoxL').find('li').click(function(){
				$('.chartBoxL .active').removeClass('active');
				$(this).addClass('active');
				var title=$(this).text();
				var XX=[];
				var YY=[];
				switch(title)
				{
					case '高发预警场所':for(var key in site)
										{
											XX.push(key);
											YY.push(site[key]);
										}
										var chartData={};
										chartData.x=XX;
										chartData.y=YY;
										console.log(chartData)
										barChart('chart-A',chartData);
										break;
					case '高危重点人员':for(var key in name)
										{
											XX.push(key);
											YY.push(name[key]);
										}
										var chartData={};
										chartData.x=XX;
										chartData.y=YY;
										console.log(chartData)

										barChart('chart-A',chartData);
										break;
					case '高发预警籍贯':for(var key in nativePlace)
										{
											XX.push(key);
											YY.push(nativePlace[key]);
										}
										var chartData={};
										chartData.x=XX;
										chartData.y=YY;
										console.log(chartData)
										barChart('chart-A',chartData);
										break;
				}
			})
			var value=[];
			var state=[];
			var i=0;
			for(var key in zdryState)
			{
				console.log(key)
				state.push(key);
			}
			for(var j=0;j<4;j++)
			{
				switch(j)
				{
					case 0:
							if(state[0]=="普通关注")
							{
								value.push(zdryState['普通关注']);
							}
							else
							{
								value.push(0);
							}
							break;
					case 1:
							if(state[1]=="积极关注")
							{
								value.push(zdryState['积极关注']);
							}
							else
							{
								value.push(0);
							}
							break;
					case 2:
							if(state[2]=="重点关注")
							{
								value.push(zdryState['重点关注']);
							}
							else
							{
								value.push(0);
							}
							break;
					case 3:
							if(state[3]=="立即处置")
							{
								value.push(zdryState['立即处置']);
							}
							else
							{
								value.push(0);
							}
							break;
				}
			}
			console.log('1',value)		
			var chartData=[{
				name:'1',
				value:value
			}]
			var pieData={
						
						legendData:['A类普通关注','B类积极关注','C类重点关注','D类立即处置'],
						name:'类别分析',
						data:[
					            {value:value[0], name:'A类普通关注'},
					            {value:value[1], name:'B类积极关注'},
					            {value:value[2], name:'C类重点关注'},
					            {value:value[3], name:'D类立即处置'}
					        ],
					  title: '各预警类别预警数分布'
						}
			pieChart('chartBoxRFL',pieData);

			var EE=[];
			var RR=[];
			var len=0;
			for(var key in zdryType)
			{
				EE.push(key);
				RR.push(zdryType[key]);
				len++;
			}
			var chartData={};
			chartData.x=EE;
			chartData.y=RR;
			var itemContent=[];
			var lengendContent=[];
			for(var u=0;u<len;u++)
			{
				itemContent.push({value:RR[u],name:EE[u]});
				lengendContent.push(EE[u]);
			}
			console.log(chartData)
			var pieContent={
				legendData:lengendContent,
						name:'各预警信息类型分布',
						data:itemContent,
					  title: '各预警类型预警数分布'

						
					    
			}

			pieChart('chartBoxRFR',pieContent);

			var length=0;
			for(var k in time)
			{
				length++
			}
			console.log(length)
			var text=[];
			var num=0;
			
			for(var i=0;i<length;i++)
			{
				for(var key in time)
				{
					if(key==num)
					{
						text.push(time[key]);
					}
				}
				num++;
			}

			lineChart('chartBoxRH',text)
		}
	})
}