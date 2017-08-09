$(function(){
	getPolicData(0,'',serverIP2)
	$('.input-group-btn').on('click',function(){
		var seachText=$('.form-control').val();
		if(seachText==''){
			alert('搜索的内容不能为空！请重新输入...')
		}else{
            getPolicData(1,seachText,serverIP2);
		}
	})
	function getPolicData(type,key,serverIP){//type==0   默认加载警员列表;type==1 搜索警员;key为搜索关键字
		$.ajax({//获取警员基本信息
			type:"get",
			url:serverIP+"/escopeweb//count/cntservice!getDepartmentPoliceOnlineData.action",//原始ip：http://police.sibat.cn
			async:true,
			dataType: 'json',
			data: {
	            timespan: 20,
	       },
			success:function(res){
				var dataLength = res.stationdata.length;
				var htmlStr="";
				htmlStr+="<tr><th>序号</th><th>派出所</th><th>警员类型</th><th>警号</th><th>姓名</th><th>性别</th><th>学历</th><th>联系电话</th><th>详情</th></tr>";
				var index=1;
				var page=0;
				var seachDefult=true;
				if((type==0)||(key=='')){
					for(var i=0;i<dataLength;i++){
						var datLength= res.stationdata[i].data.length;
						for(var j=0;j<datLength;j++){
							index=index<10?"0"+index:index;
							if((index-1)%15==0){
								page++;
							}
							if(res.stationdata[i].data[j].usertypename=="警员"){
								htmlStr+="<tr class=\"page page-"+page+"\"><td>"+index+"</td><td>"+res.stationdata[i].depname+"</td><td><img src=\"../../img/icon 09.png\"/>"+res.stationdata[i].data[j].usertypename+"</td><td>"+res.stationdata[i].data[j].cardno+"</td><td>"+res.stationdata[i].data[j].username+"</td><td>-</td><td>-</td><td>"+res.stationdata[i].data[j].telephone+"</td><td><img class='btnDetail' src=\"../../img/image 35.png\"/></td></tr>"
							}else{
								htmlStr+="<tr class=\"page page-"+page+"\"><td>"+index+"</td><td>"+res.stationdata[i].depname+"</td><td><img src=\"../../img/icon 10.png\"/>"+res.stationdata[i].data[j].usertypename+"</td><td>"+res.stationdata[i].data[j].cardno+"</td><td>"+res.stationdata[i].data[j].username+"</td><td>-</td><td>-</td><td>"+res.stationdata[i].data[j].telephone+"</td><td><img class='btnDetail' src=\"../../img/image 35.png\"/></td></tr>"
							}
							index++;
						}
					}
				}else{
					page=1;
					for(var i=0;i<dataLength;i++){
						var datLength= res.stationdata[i].data.length;
						for(var j=0;j<datLength;j++){
							if((res.stationdata[i].data[j].cardno==key)||(res.stationdata[i].data[j].username==key)){
								index=index<10?"0"+index:index;
								if(res.stationdata[i].data[j].usertypename=="警员"){
									htmlStr+="<tr class=\"page page-"+page+"\"><td>"+index+"</td><td>"+res.stationdata[i].depname+"</td><td><img src=\"../../img/icon 09.png\"/>"+res.stationdata[i].data[j].usertypename+"</td><td>"+res.stationdata[i].data[j].cardno+"</td><td>"+res.stationdata[i].data[j].username+"</td><td>-</td><td>-</td><td>"+res.stationdata[i].data[j].telephone+"</td><td><img class='btnDetail' src=\"../../img/image 35.png\"/></td></tr>"
								}else{
									htmlStr+="<tr class=\"page page-"+page+"\"><td>"+index+"</td><td>"+res.stationdata[i].depname+"</td><td><img src=\"../../img/icon 10.png\"/>"+res.stationdata[i].data[j].usertypename+"</td><td>"+res.stationdata[i].data[j].cardno+"</td><td>"+res.stationdata[i].data[j].username+"</td><td>-</td><td>-</td><td>"+res.stationdata[i].data[j].telephone+"</td><td><img class='btnDetail' src=\"../../img/image 35.png\"/></td></tr>"
								}
								index++;
								seachDefult=false;
							}
						}
					}
				}
				if(seachDefult&&type==1){
					index=1;
					page=0;
					alert("搜索内容失败！请输入正确完整的警号或姓名搜索警员...");
					for(var i=0;i<dataLength;i++){
						var datLength= res.stationdata[i].data.length;
						for(var j=0;j<datLength;j++){
							index=index<10?"0"+index:index;
							if((index-1)%15==0){
								page++;
							}
							if(res.stationdata[i].data[j].usertypename=="警员"){
								htmlStr+="<tr class=\"page page-"+page+"\"><td>"+index+"</td><td>"+res.stationdata[i].depname+"</td><td><img src=\"../../img/icon 09.png\"/>"+res.stationdata[i].data[j].usertypename+"</td><td>"+res.stationdata[i].data[j].cardno+"</td><td>"+res.stationdata[i].data[j].username+"</td><td>-</td><td>-</td><td>"+res.stationdata[i].data[j].telephone+"</td><td><img class='btnDetail' src=\"../../img/image 35.png\"/></td></tr>"
							}else{
								htmlStr+="<tr class=\"page page-"+page+"\"><td>"+index+"</td><td>"+res.stationdata[i].depname+"</td><td><img src=\"../../img/icon 10.png\"/>"+res.stationdata[i].data[j].usertypename+"</td><td>"+res.stationdata[i].data[j].cardno+"</td><td>"+res.stationdata[i].data[j].username+"</td><td>-</td><td>-</td><td>"+res.stationdata[i].data[j].telephone+"</td><td><img class='btnDetail' src=\"../../img/image 35.png\"/></td></tr>"
							}
							index++;
						}
					}
				}
				$('#policList').html(htmlStr);
				$('.page-select').eq(0).find('a').text(1)
				$('.page-select').eq(1).find('a').text(2)
				$('.page-select').eq(2).find('a').text(3)
				$('.pagination').find('.before-page').on('click',function(){
					if($(this).siblings('.page-select').eq(0).text()!=1){
						$(this).siblings('.page-select').eq(0).find('a').text(parseInt($(this).siblings('.page-select').eq(0).text())-1)
						$(this).siblings('.page-select').eq(1).find('a').text(parseInt($(this).siblings('.page-select').eq(1).text())-1)
						$(this).siblings('.page-select').eq(2).find('a').text(parseInt($(this).siblings('.page-select').eq(2).text())-1)
						$('.page').hide();
						$('.page-'+$('.pagination').find('.active').text()).show();
					}
				})
				$('.pagination').find('.next-page').on('click',function(){
					if($(this).siblings('.page-select').eq(2).text()<page){
						$(this).siblings('.page-select').eq(0).find('a').text(parseInt($(this).siblings('.page-select').eq(0).text())+1)
						$(this).siblings('.page-select').eq(1).find('a').text(parseInt($(this).siblings('.page-select').eq(1).text())+1)
						$(this).siblings('.page-select').eq(2).find('a').text(parseInt($(this).siblings('.page-select').eq(2).text())+1)
						$('.page').hide();
						$('.page-'+$('.pagination').find('.active').text()).show();
					}
				})
				$('.page-select').on('click',function(){
					$('.page-select').removeClass('active');
					$(this).addClass('active');
					$('.page').hide();
					$('.page-'+$(this).text()).show();
				})
			},
			error: function () {
	            console.log('获取警员信息失败...');
	        }
		});
	}

	$('#policList').on('click','.btnDetail',function(){//点击详情获取id跳转传id
		var policeId=$(this).parent().siblings().eq(3).text();
        $('#iframe', parent.document).attr('src', 'template/policing-manage/polic-footprint.html?cardno='+policeId)
	})
})
