$(document).ready(function(){
	load();
})
function load(){
   	var app= angular.module('myApp', []);
	var button_modify = Ladda.create(document.querySelector('#submit_ladda'));
        app.controller('history',
		function ($scope,$http,$filter) {
			$http({
							method:"post",
							url:"/cgi-bin/EMS/history.pl",
							headers: {
									  'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
							},
							transformRequest: function (data) {
									return $.param(data);
							},
							data:{
									'operate':'initial',
							}
							})
			.success(function (data,hearer,config,status) {
					if (data.result == 'success'){
						$scope.data=data.list;
						var list=new Array();;
	                                        angular.forEach($scope.data,function(data,index,arry){
							list.push(index);
                                        	})
						$scope.owner=list;
						$scope.owner_default=$scope.owner[0];
						$scope.equiment=$scope.data['全部'];
						$scope.equiment_default=$scope.equiment[0];
					}
			})
			$scope.submit=function(){
				if ($scope.time == null){
					alert('请选择开始时间');
					return;
				}
				button_modify.start();
				$http({
	                                        method:"post",
                                                url:"/cgi-bin/EMS/history.pl",
                                                headers: {
                                                          'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
                                                },
                                                transformRequest: function (data) {
                                                        return $.param(data);
                                                },
                                                data:{
							'operate':'submit',
                                                        'time':$scope.time,
							'owner':$scope.owner_default,
							'equiment':$scope.equiment_default
                                                }
                                                })
				.success(function (data,hearer,config,status) {
					history_char(data.series,data.xAxis);
					button_modify.stop();
				})
				}
                        $scope.change_ownlist=function(x){
				$scope.equiment=$scope.data[x];
				$scope.equiment_default=$scope.equiment[0];
                        }
    		});
}
function history_char(series,xAxis){
$('#container').highcharts({
        chart: {
            type: 'bar'
        },
        title: {
            text: '设备历史状态'
        },
        credits : { 
                enabled : false 
        },
        xAxis: {
            categories:xAxis
        },
        yAxis: {
            min: 0,
            reversedStacks : false,
	    categories: ['8点','9点', '10点', '11点', '12点','13点','14点','15点','16点','17点','18点','19点','20点','21点','22点','23点','0点','1点','2点','3点','4点','5点','6点','7点'],
            reversedStacks : false,
            title: {
                text: ''
            }
        },
        tooltip:{
                formatter:function() {
                        var a = parseInt(this.y * 3600);
                        // 小时：h=time/3600（整除）
                        // 分钟：m=(time-h*3600)/60 （整除）
                        // 秒：s=(time-h*3600) mod 60 （取余）
                        var h = parseInt(a / 3600);
                        var m = parseInt((a - h * 3600) / 60);
                        var s = (a - h * 3600) % 60;
                        var c = "";
                        if (h > 0) {
                                c += h.toString() + "小时";
                        }
                        if (m > 0) {
                                c += m.toString() + "分";
                        }
                        if (s > 0) {
                                c += s.toString() + "秒"
                        }
                        return '设备号:' + this.x + '<br/>' + this.series.name + ':' + c
                                        + '</b>';
                }
                },
        legend: {
            enabled: false
        },
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },
        series:series
    });
} 
