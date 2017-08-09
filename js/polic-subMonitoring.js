$(function(){

	var lineSite={}
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
	console.log(lineSite);

  $('.contentRightBox').find('iframe').attr('src',serverIP2+'/escopeweb//content/cn/wifi/heatmapdetailpc.html?bid=1268004000&fid=6&id=18')

	$('.line-menu').find('li').on('click',function(){
		$('.site-menu').empty()
		var thisSrc = $(this).find('a').find('img').attr('src')
		$(this).parent('.line-menu').siblings('.btn1').find('img').attr('src',thisSrc)
		console.log($(this).parent('.line-menu').siblings('.btn1').find('img'))
		var lineCon = thisSrc.split('.png')[0].split('line')[1]
		var lineNum = 'line'+lineCon
		var lineId = lineNum+'s'
		var siteMenuHtml='';
		for(var i=0;i<lineSite[lineNum].length;i++)
		{
			siteMenuHtml+="<li><a href=\"#\">"+lineSite[lineNum][i]+"</a><span style='display: none'>"+lineSite[lineId][i]+"</span></li>"
		}
		$('.site-menu').append(siteMenuHtml)
		console.log(siteMenuHtml)
    $('.btn2').text('--请选择--')

		console.log(lineSite[lineNum])
		$('.site-menu').find('li').on('click',function(){
			var thisTxt = $(this).find('a').text()
			console.log(thisTxt,'222')
			$(this).parent('.site-menu').siblings('.btn2').text(thisTxt)
			var thisId = $(this).find('span').text()

			listShow(thisId)
		})

	})
	

	$('.site-menu').find('li').on('click',function(){
			var thisTxt = $(this).find('a').text()
			console.log(thisTxt,'222')
			$(this).parent('.site-menu').siblings('.btn2').text(thisTxt)
			var thisId = $(this).find('span').text()
			listShow(thisId)
	})
	function listShow(id){
		$.ajax({
			type:'get',
			dateType:'json',
			data:{
				bid:id
			},
			url: serverIP2+'/escopeweb/count/cntservice!getCameraList.action',
			success: function(res){
        console.log(res)
                var tableContent=''
				$('.table-list').find('table').empty()
				var res=JSON.parse(res);
                if(res.data.length!==0){
                    var data=res.data[0].cameralist;
                    var listData=data;
                    for(var i=0;i<data.length;i++)
                    {
                        var floornameen = (data[i].floornameen)?(data[i].floornameen):'--';
                        var deviceid = (data[i].deviceid)?(data[i].deviceid):'--';
                        var title = (data[i].title)?(data[i].title):'--';
                        var bonline = (data[i].bonline)?(data[i].bonline):'--';
                        tableContent+=
                            '<tr>' +
                            '<td>'+floornameen+'</td>' +
                            '<td>'+deviceid+'</td>' +
                            '<td>'+title+'</td>' +
                            '<td>'+bonline+'</td>' +
                            '<td class="tb-url" style="display:none">'+data[i].url+'</td>' +
                            '<td style="display:none">'+data[i].id+'</td>' +
                            '</tr>'
                    }
                    $('.table-list').find('table').append(tableContent)
                    $('.table-list').find('tr').click(function(){
                        var url=$(this).find('.tb-url').text()
                        $('.contentRightBox').find('iframe').attr('src',serverIP2+'/escopeweb/'+url)
                    })
                     $('.contentRightBox').find('iframe').attr('src',serverIP2+'/escopeweb/' + data[0].url)
                     console.log(serverIP2+'/escopeweb/' + data[0].url, '33333333333333333333333333333')
				}else{
					tableContent='<tr><td rowspan="4" style="color: red">暂无数据</td></tr>'
             $('.table-list').find('table').append(tableContent)
             $('.contentRightBox').find('iframe').attr('src','')
				}
			}
		})
	}

})
