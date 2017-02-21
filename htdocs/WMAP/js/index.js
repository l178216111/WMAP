$(document).ready(function(){
	load();
})
function load(){
   	var app= angular.module('myApp', []);
	app.directive('renderFinish', function ($timeout) {      //renderFinish自定义指令
		return {
			restrict: 'A',
			link: function(scope, element, attr) {
				if (scope.$last === true || scope.$last == '') {
					$timeout(function() {
						scope.$emit('ngRepeatFinished');
					});
				}
			}
		};
	});
        app.directive('die', function () {  
                return {                        
                        restrict: 'A',  
                        link: function(scope, element, attr) {
				$(element).bind("mousemove", function(event){
					var coordinate=[];
					coordinate=attr.die.split(',');
					var x=parseInt(scope.coordinate.x)+parseInt(coordinate[0]);
					var y=parseInt(scope.coordinate.y)+parseInt(coordinate[1]);
					scope.setcoordinate(x + ","  + y);
				});
                        }
                };                      
        });
        app.directive('loading',function() {
                return{ 
                        restrict: 'A',
                        link:function($scope, element, attrs) {
                                        $scope.loadinggif=$(element);           
                            }
                };
        });
	app.directive('select2part',function() {
		return{
			restrict: 'A',
			link:function($scope, element, attrs) {
					$(element).select2({placeholder: 'Select a Part'});
					$scope.select2part=$(element);		
					$(element).on('select2:select', function (evt) {
						$scope.getlist('part');
					});	
			}
		};
	});
        app.directive('select2lot',function() {
                return{                                 
                        restrict: 'A',                  
                        link:function($scope, element, attrs) {         
                                        $(element).select2({placeholder: 'Select a Lot'});           
					$scope.select2lot=$(element);
                                        $(element).on('select2:select', function (evt) {
						$scope.getlist('lot');
                                        });
                        }                                               
                };                                      
        });
        app.directive('select2wafer',function() {
                return{                                 
                        restrict: 'A',                  
                        link:function($scope, element, attrs) {         
                                        $(element).select2({placeholder: 'Select a Wafer'});           
					$scope.select2wafer=$(element);
                                        $(element).on('select2:select', function (evt) {
						$scope.getlist('wafer');
                                        });
                        }                                               
                };                                      
        });
        app.directive('select2pass',function() {
                return{                                 
                        restrict: 'A',                  
                        link:function($scope, element, attrs) {         
                                        $(element).select2({placeholder: 'Select a Pass'});           
					$scope.select2pass=$(element);
                                        $(element).on('select2:select', function (evt) {
						$scope.getlist('pass');
                                        });
                        }                                               
                };                                      
        });
        app.directive('select2layer',function() {
                return{
                        restrict: 'A',
                        link:function($scope, element, attrs) {
					$(element).select2({});
                                        $scope.select2layer=$(element);
                                        $(element).on('select2:select', function (evt) {
						if ($scope.data.pass == ''){return};
						$scope.data.layer=$scope.select2layer.select2('val');
						$scope.getmap($scope.data);
                                        });
                        }
                };
        });
        app.directive('bodymap',function() {
                return {
                        restrict: 'A',
                        link:function($scope, element, attrs) {
					$scope.move = false;
					var isDown      = false;// 是否能够移动
					var initialLeft = 0; // 鼠标摁下时的坐标
					var initialTop  = 0;
					var divLeft     = 0; // 鼠标摁下时内部div的坐标
					var divTop      = 0;
					$(element).bind("mousemove", function(event){
							var opposite = getOppositeCoor($(element), event);
							if(isDown){
									var divl = divLeft+(opposite.left-initialLeft);
									var divt  = divTop+(opposite.top-initialTop);
									$(element).children().css({'left':divl, 'top':divt});
									$scope.move = true;
							}
					});
					$(element).bind("mousedown", function(event){
							isDown       = true;
							var opposite = getOppositeCoor($(element), event);
							initialLeft  = opposite.left;
							initialTop   = opposite.top;
							divLeft      = parseInt($(element).children().css("left"));
							divTop       = parseInt($(element).children().css("top"));
					});
					$(element).bind("mouseup", function(){
							isDown      = false;
							$scope.move = false;
							initialLeft = 0;
							initialTop  = 0;
							divLeft     = 0;
							divTop      = 0;
					});
					$(element).mousewheel(function(event, delta, deltaX, deltaY) {
						var diagonaldelta=$scope.diagonal+delta*2;
						if ( diagonaldelta >=1 ) {
							$scope.$apply(function () {
								$scope.diagonal=diagonaldelta;
							});
						}
						return false;
					});
					function getOppositeCoor(obj, event){
							event = event || window.event;
							var left = obj.offset().left;
							var top  = obj.offset().top;

							left += obj.offsetParent().offset().left;
							top+=obj.offsetParent().offset().top; 

							var OppositeCoorLeft = event.clientX-left+document.body.scrollLeft;
							var OppositeCoorTop  = event.clientY-top+document.body.scrollTop;
							return {'left':OppositeCoorLeft, 'top':OppositeCoorTop};
					}

                        }
                };
        });
        app.controller('LotDisp',
                function ($scope) {
			$scope.$on('genmap-father',function(event,data){
				$scope.$broadcast('genmap-child',data);
			});
			$scope.loading=function(opt){
				if (opt =='show'){
					var height=$(window).height()/2;
					$scope.loadinggif.css({'left':'50%','top':height});
					$scope.loadinggif.show();
				}
				else if (opt == 'hide'){
					$scope.loadinggif.hide();
				}

			}
                });
	app.controller('LotList',
		function ($scope,$http) {
			$scope.getlist=function(changed){
				var data={
                                                        'operate':"select",
                                                        'change':changed,
                                                        'part':$scope.select2part.select2('val'),
                                                        'lot':$scope.select2lot.select2('val'),
                                                        'wafer':$scope.select2wafer.select2('val'),
                                                        'pass':$scope.select2pass.select2('val')
				};
				if (changed == "pass"){
					$scope.$emit('genmap-father',data);
				}else{
				$scope.loading('show');
				$http({
					method:"post",
					url:"/cgi-bin/WMAP/index.pl",
					headers: {
						 'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
					},
					transformRequest: function (data) {
							   return $.param(data);
					},
					data:data
					})
					.success(function (response) {
							if (changed == 'part') {
								$scope.select2lot.val("").trigger("change");
								$scope.list.lot=response.list.lot;
								$scope.loading('hide');
								$scope.list.wafer='';
								$scope.list.pass='';
							}else if (changed == 'lot') {
								$scope.select2wafer.val("").trigger("change");
								$scope.list.wafer=response.list.wafer;
                                                                $scope.loading('hide');
								$scope.list.pass='';
							}else if (changed == 'wafer') {
								$scope.select2pass.val("").trigger("change");
								$scope.list.pass=response.list.pass;
                                                                $scope.loading('hide');
								$scope.select2pass.val('0').trigger("change");
								$scope.getlist('pass');
							}
					});
				}
			};
			$http({
				method:"post",
				url:"/cgi-bin/WMAP/index.pl",
                                headers: {
                                     'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
                                },
                                transformRequest: function (data) {
					   $scope.loading('show');
                                           return $.param(data);
                                },
                                data:{
                                        'operate':"initial",
                                }
                        })
			.success(function (response) {
				$scope.list=response.list;
				$scope.loading('hide');
			 });
		});
        app.controller('WaferMap',
		function ($scope,$http) {
			$scope.diagonal=12;
			$scope.ratiox=1;
			$scope.ratioy=1;
			$scope.data={part:'',lot:'',wafer:'',pass:'',layer:''};
                        $scope.colorgrp={
                                        0:'bg0',
                                        1:'bg1',
                                        2:"bg2",
                                        3:"bg3",
                                        4:"bg4",
                                        5:'bg5',
                                        6:'bg6',
                                        7:'bg7',
                                        8:'bg8',
                                        9:"bg9",
                                        A:"bgA",
                                        B:"bgB",
                                        C:"bgC",
                                        D:"bgD",
                                        E:"bgE",
                                        F:"bgF",
                        };
			$scope.$on('genmap-child',function(event,data){
				$scope.data=data;
				$scope.data.layer=$scope.select2layer.select2('val');
				$scope.getmap($scope.data);
			});
			$scope.getmap=function(data){	
				$http({
					method:"post",
					url:"/cgi-bin/WMAP/wafermap.pl",
					headers: {
							  'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
					},
					transformRequest: function (data) {
							$scope.loading('show');
							return $.param(data);
					},
					data:{
					'part':data.part,
					'lot':data.lot,
					'wafer':data.wafer,
					'pass':data.pass,
					'layer':data.layer
					}
					})
                        	.success(function (data,hearer,config,status) {
                                	$scope.map=data.map;
					$scope.wfinfo=data.wfinfo;
					console.log($scope.wfinfo);
					var diecount=[{key:"Value",count:"Count"}];
					data.data.forEach(function(value,index,arry){
						re=/(.*):(.*)/;
						var arry={};
						arr=re.exec(value);
						arry['key']=arr[1];
						arry['count']=arr[2];
						diecount.push(arry);
					});
					$scope.coordinate=data.coordinate;
					$scope.diecount=diecount;
					$scope.color=data.color;
					$scope.colorlist=data.colorlist;
					$scope.ratioy=$scope.map.length;
					$scope.ratiox=$scope.map[0].length;
					$scope.diagonal=parseInt(800/$scope.ratiox)
			 	});
			};
			$scope.$on('ngRepeatFinished', function(){
				$scope.loading('hide');
			});
			$scope.setcoordinate=function(coordinate){
				if ($scope.move == false) {
					$scope.$apply(function(){
						$scope.coor=coordinate;
					});
				}
				
			}
			$scope.setbg=function(y){
				if (y =="\@\@"){
					return "bgI"
				} else {
					return $scope.colorgrp[$scope.color[y]]
				}
			}
			$scope.die=function(y){
				if (y == "\@\@"){
                                        return " ";
                                } 
				if ($scope.ratiox/$scope.ratioy > 1){
					var min_size=$scope.diagonal;
				}else{
					var min_size=$scope.ratiox/$scope.ratioy*$scope.diagonal;
				}
				if (min_size < 12) {
					return "";
				}else {
					return y;
				}
			}
			$scope.click=function(x,y){
				if ( $scope.move == false ) {
					console.log("x:"+x +",y:"+y);
				}
			}
    		});
}
