$(document).ready(function(){
	load();
})
function load(){
	var button_submit = Ladda.create(document.querySelector('#submit_ladda'));
   	var app= angular.module('myApp', []);
        app.controller('report',
		function ($scope,$http,$filter) {
			$scope.submit=function(){
				button_submit.start();
				$http({
	                                        method:"post",
                                                url:"/cgi-bin/EMS/report.pl",
                                                headers: {
                                                          'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
                                                },
                                                transformRequest: function (data) {
                                                        return $.param(data);
                                                },
                                                data:{
                                                        'time':$scope.time
                                                }
                                                })
				.success(function (data,hearer,config,status) {
				})
				button_submit.stop();
				}
    		});
}
