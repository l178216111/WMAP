		$(document).ready(function(){
			controller();
		})
	     function controller(){
//		var add = Ladda.create(document.querySelector('#add'));
//		var modify=Ladda.create(document.querySelector('#modify'));
		var app= angular.module('myApp', []);
		app.controller('customermodify',
			function ($scope,$http){
				$scope.$on('data.modify',function(event, data) {
					$scope.data=data;
				});
			$scope.modif=function(){
                            $http({
                                                method:"post",
                                                url:"/cgi-bin/EMS/admin.pl",
                                                headers: {
                                                          'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
                                                },
                                                transformRequest: function (data) {
                                                        return $.param(data);
                                                },
                                                data:{
                                                        'operate':'modify',
							'equiment':$scope.data.equiment,
							'owner':$scope.data.owner,
							'ip':$scope.data.ip,
							'port':$scope.data.port,
							'id':$scope.data.scope.id
                                                }
                                                })
                                .success(function (data,hearer,config,status) {
                                        	if (data.result=="success"){
						$("#modify_modal").modal("toggle");
						var data={
							'equiment':$scope.data.equiment,
							'owner':$scope.data.owner,
							'ip':$scope.data.ip,
							'port':$scope.data.port,
							'index':$scope.data.index
						};
						$scope.$emit('data.modifydone',data);
						$scope.data=undefined;
						}
                                });

			}
			});
		app.controller('admin',
			function ($scope,$http){
				$http({
                                                method:"post",
                                                url:"/cgi-bin/EMS/admin.pl",
                                                headers: {
                                                          'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
                                                },
                                                transformRequest: function (data) {
                                                        return $.param(data);
                                                },
                                                data:{
                                                	'operate':'load',
                                                }
                                                })
                        	.success(function (data,hearer,config,status) {
                                	$scope.result = data.result;
					angular.forEach($scope.result,function(data,index,arry){
						if (data.stick=='Stick'){
							$scope.result[index].istick="true"
						}else{
							$scope.result[index].istick="false"
						}
					})	
				});
				$scope.$on('data.add', function(event, data) {  
					$scope.result.push(data);
        			});  
				$scope.$on('data.deletedone',function(event,data){
					$scope.result.splice(data.index,1);
				});
				$scope.$on('data.modifydone',function(event,data){
					var index=data.index;
					if (data.equiment != undefined){
						$scope.result[index].equiment=angular.uppercase(data.equiment);
					}
					if (data.owner != undefined){
						$scope.result[index].owner=angular.uppercase(data.owner);
					}
                                        if (data.ip != undefined){
                                                $scope.result[index].ip=angular.uppercase(data.ip);
                                        }
                                        if (data.port != undefined){
                                                $scope.result[index].port=angular.uppercase(data.port);
                                        }
				});
				$scope.delete=function(x,index){
					$("#delete_modal").modal("toggle");
					var data={
						'scope':x,
						'index':index
					};
					$scope.$broadcast('data.delete',data);
				}
                                $scope.modify=function(x,index){
					$("#modify_modal").modal("toggle");
					var data={
                                                'scope':x,
                                                'index':index
                                        };
                                        $scope.$broadcast('data.modify',data);	
                                }
				$scope.add=function(){
					$("#add_modal").modal("toggle");
				}
                                $scope.stick=function(x){
                                $http({
                                                method:"post",
                                                url:"/cgi-bin/EMS/admin.pl",
                                                headers: {
                                                          'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
                                                },
                                                transformRequest: function (data) {
                                                        return $.param(data);
                                                },
                                                data:{
                                                        'operate':'stick',
							'id':x.id,
							'stick':x.stick
                                                }
                                                })
                                .success(function (data,hearer,config,status) {
					if(data.result=='success'){
						if (x.stick=='Stick'){
							x.stick='Unstick';
							x.istick="false";
						}else{
							x.stick='Stick';
							x.istick="true";
						}
					}
					});
                                }
		});
		app.controller('customerDelete',
			function($scope,$http){
				$scope.$on('data.delete',function(event,data){
					$scope.data=data;
				});
			$scope.delet=function(){
                                        $http({
                                                method:"post",
                                                url:"/cgi-bin/EMS/admin.pl",
                                                headers: {
                                                          'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
                                                },
                                                transformRequest: function (data) {
                                                        return $.param(data);
                                                },
                                                data:{
							'operate':'delete',
                                                	'id':$scope.data.scope.id,
                                                }
                                                })
                                        .success(function (data,hearer,config,status){
                                                if (data.result == "success"){
							$("#delete_modal").modal("toggle");
							var data={
								'index':$scope.data.index
							};
							$scope.$emit('data.deletedone',data);
                                                }else{
							alert('delete fail');
						}
                                        })
                                        .error(function (data,hearer,config,status){
                                        });
			}
		});
		 app.controller('customerAdd',
			function ($scope,$http) {
				$scope.add=function(){
					$http({
						method:"post",
						url:"/cgi-bin/EMS/admin.pl",
						headers: {
							  'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
 						},
						transformRequest: function (data) {
							return $.param(data);
						},
						data:{
						'operate':'add',
						'equiment':$scope.equiment,
						'owner':$scope.owner,
						'ip':$scope.ip,
						'port':$scope.port
						}
						})
					.success(function (data,hearer,config,status){
						if (data.result == "success"){
							$("#add_modal").modal("toggle");
							var data={
								'equiment':$scope.equiment,
								'owner':$scope.owner,
								'ip':$scope.ip,	
								'port':$scope.port,
								'stick':'Stick',
								'istick':'true',
								'id':data.id
							};
							$scope.$emit('data.add',data);
						}
		                        $scope.equiment="";
                                        $scope.owner="";
                                        $scope.ip="";
                                        $scope.port="";
					})
					.error(function (data,hearer,config,status){
					});
				}
				$scope.reset=function(){
					$scope.equiment="";
					$scope.owner="";
					$scope.ip="";
					$scope.port="";
				}
			 });
		}


	
