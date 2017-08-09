$(function(){//此文件主要实现变更iframe地址实现路由， clickLink为所需要路由的class类名，给标签设置一个index属性值，通过属性值来改变iframe的src
	$(".clickLink").on('click',function(){
		var index = $(this).attr('index')
		switch (index){
			case 'subTraffic': $('#iframe').attr('src','template/traffic-monitoring/network-monitoring.html')
				break;
			case 'networkMonitoring': $('#iframe',parent.document).attr('src','template/traffic-monitoring/network-monitoring.html')
				break;
			case 'siteMonitoring': $('#iframe',parent.document).attr('src','template/traffic-monitoring/site-monitoring.html')
				break;
			case 'traffiQcuery': alert("客流查询页面预留，待更新...")
			case 'pubTraffic': $('#iframe').attr('src','template/traffic-monitoring/site-RTmonitoring.html')
				break;
			case 'policingManage': $('#iframe').attr('src','template/policing-manage/polic-RTmonitoring.html')
				break;
			case 'policRTmonitoring': $('#iframe',parent.document).attr('src','template/policing-manage/polic-RTmonitoring.html')
				break;
			case 'polic': $('#iframe',parent.document).attr('src','template/policing-manage/polic-policeList.html')
				break;
			case 'policRefer': $('#iframe',parent.document).attr('src','template/policing-manage/polic-policRefer.html')
				break;
			case 'policDetails': $('#iframe',parent.document).attr('src','template/policing-manage/polic-footprint.html')
				break;
			case 'backPolic': $('#iframe',parent.document).attr('src','template/policing-manage/polic-policeList.html')
				break;
			case 'warningManage': $('#iframe').attr('src','template/policing-manage/polic-warningMap.html?type=1')
				break;
			case 'warningSubMap': $('#iframe',parent.document).attr('src','template/policing-manage/polic-warningMap.html?type=1')
				break;
			case 'warningBusMap': $('#iframe',parent.document).attr('src','template/policing-manage/polic-warningMap.html?type=2')
				break;
			case 'warningSubRefer': $('#iframe',parent.document).attr('src','template/policing-manage/polic-warningRefer.html?type=1')
				break;
			case 'warningBusRefer': $('#iframe',parent.document).attr('src','template/policing-manage/polic-warningRefer.html?type=2')
				break;
			case 'warningAnalyz': $('#iframe',parent.document).attr('src','template/policing-manage/polic-warningAnalyze.html')
				break;
			case 'industryManage': $('#iframe',parent.document).attr('src','template/policing-manage/polic-industryManage.html')
				break;
			case 'gjqy': $('#rocordIframe').attr('src','http://10.42.77.245:8080/man/gjfk/gjqy?falg=1')
				break;
			case 'ctqc': $('#rocordIframe').attr('src','http://10.42.77.245:8080/man/gjfk/ctqcz?falg=1')
				break;
			case 'dlysqy': $('#rocordIframe').attr('src','http://10.42.77.245:8080/man/gjfk/dlysqy?falg=1')
				break;
			case 'wyc': $('#rocordIframe').attr('src','http://10.42.77.245:8080/man/gjfk/zcZtqk?falg=1')
				break;
			case 'czc': $('#rocordIframe').attr('src','http://10.42.77.245:8080/man/gjfk/czcysqy?falg=1')
				break;
			case 'hnycry': $('#rocordIframe').attr('src','http://10.42.77.245:8080/man/gjfk/ycrygl?falg=1')
				break;
			case 'recordManage': $('#iframe').attr('src','template/policing-manage/polic-recordManage.html')
				break;
			case 'hlAnalysis': $('#rocordIframe').attr('src','http://10.42.77.245:8080/man/dtfk/hlAnalysis?checkKey=1')
				break;
			case 'hlgl': $('#rocordIframe').attr('src','http://10.42.77.245:8080/man/dtfk/hlgl')
				break;
			case 'dwsjhlyc': $('#rocordIframe').attr('src','http://10.42.77.245:8080/man/dtfk/dwsjhlyc')
				break;
			case 'dwzdhlyc': $('#rocordIframe').attr('src','http://10.42.77.245:8080/man/dtfk/dwzdhlyc')
				break;
			case 'hlcxPage': $('#rocordIframe').attr('src','http://10.42.77.245:8080/man/dtfk/hlcxPage')
				break;
			case 'subMonitoring': $('#iframe').attr('src','template/policing-manage/polic-subMonitoring.html')
				break;
			case 'RTmonitoring': $('#iframe').attr('src','template/important-person/net-RTmonitoring.html')
				break;
			case 'netRTmonitoring': $('#iframe',parent.document).attr('src','template/important-person/net-RTmonitoring.html')
				break;
			case 'keyPersonnelDetails': $('#iframe',parent.document).attr('src','template/important-person/key-personnelDetails.html')
				break;
			case 'forewarningManage': $('#iframe').attr('src','template/important-person/warningManage.html')
				break;
			case 'forewarningRefer': $('#iframe').attr('src','template/important-person/high-riskPersonRefer.html')
				break;
			case 'fellowWorkers': $('#iframe',parent.document).attr('src','template/important-person/fellow-workers.html')
				break;
			case 'highRiskPerson': $('#iframe',parent.document).attr('src','template/important-person/high-riskPerson.html')
				break;	
			case 'highFrequencyPlace': $('#iframe',parent.document).attr('src','template/important-person/high-frequencyPlace.html')
				break;
			case 'warningTime': $('#iframe',parent.document).attr('src','template/important-person/warningTime.html')
				break;
			case 'warningNum': $('#iframe',parent.document).attr('src','template/important-person/warningNum.html')
				break;
			case 'jgfltj': alert("籍贯分类统计页面，待嵌入！")
				break;
			case 'caseProsecuted': $('#iframe').attr('src','template/case-prosecuted/forewarning-analyze.html')
				break;
			case 'forewarningAnalyze': $('#iframe',parent.document).attr('src','template/case-prosecuted/forewarning-analyze.html')
				break;
			case 'forewarningRefers': $('#iframe',parent.document).attr('src','template/case-prosecuted/forewarning-refer.html')
				break;
			case 'probingManage': $('#iframe').attr('src','template/case-prosecuted/probing-manage.html')
				break;
			case 'caseAnalysis': $('#iframe',parent.document).attr('src','template/case-prosecuted/probing-manage.html')
				break;
			case 'caseStatistics': $('#iframe',parent.document).attr('src','template/case-prosecuted/probing-caseStatistics.html')
				break;
			case 'suspectDealRefer':$('#iframe',parent.document).attr('src','template/case-prosecuted/probing-suspectDealRefer.html')
				break;
			case 'suspectDealAnalysis':$('#iframe',parent.document).attr('src','template/case-prosecuted/suspectDealAnalysis.html')
				break;
			case 'probingTool': alert("侦办工具页面，待嵌入！")
				break;
			case 'personalCenter': $('#iframe').attr('src','template/personal-center/app-center.html')
				break;
			default:
				break;
		}
	})
})
