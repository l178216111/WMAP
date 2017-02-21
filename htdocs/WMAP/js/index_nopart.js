			$(document).ready(function(){
			$('#all').on('ifChecked',function(event){
			//	$('input').iCheck('check');
				$("input[name='platform']").each(function(indexs,element){
					$(this).iCheck('check');
				});
			});
			 $('#all').on('ifUnchecked',function(event){
			    $("input[name='platform']").each(function(indexs,element){
                                        $(this).iCheck('uncheck');
                                });
                        });		
			var l=Ladda.create( document.querySelector('#submit') );
			$("#submit").bind("click",function(){
			var platform=$("input[name='platform']:checked").serialize();
			var part="all";
			 l.start();
                                                $.ajax({
						type:'post',
                                                url:'/cgi-bin/RealView/image.pl',
                                                data:{platform:platform,
							part:part},
                                                dataType:'json',
						async:false,
                                                success:function(data){ 
						clearInterval(timeer);
			   			$("#myimage").empty();
							$.each(data,function(index,value){
							var arry=[];
				 			$("#myimage").append(
								'<h3 class="text-center col-xs-12">'+index+'</h3>'
							);
								$.each(data[index],function(id,value){
									arry[arry.length]=id;
								});
								arry.sort();
								$.each(arry,function(i,id){
								if($("input[name=large]").is(':checked')){
                                                                $("#myimage").append(
                                                                '<div class="img" style="width:23%;box-sizing:content-box;">'+
                                                                '<a  href="javascript:void(0);" onclick="pstatus('+"'"+escape(data[index][id].image)+"'"+' )" style="display: block;padding:0px;height:250px;">'+
                                                                '<img id="'+id+'-image" src='+data[index][id].image+'?time='+Math.random()+'" alt="Loading" style="width:100%;height:250px">'+
								'</a>'+
								'<table style="width:100%;table-layout:fixed;" rules=cols class="text-center">'+
								'<tr>'+
							        '<td class="table1" id="'+id+'-tool" >'+id+'</td>'+
                                                                '<td class="table1"><a href="javascript:void(0);" id="'+id+'-part" style="text-decoration:none;">'+data[index][id].part+'</a></td>'+
								'</tr>'+
       								'<tr>'+
                                                                '<td id="'+id+'-evr" class="table1" style="background-color:'+data[index][id].color_evr+';">'+data[index][id].status_evr+'</td>'+
                                                                '<td id="'+id+'-ems" class="table1" style="background-color:'+data[index][id].color_ems+';">'+data[index][id].status_ems+'</td>'+
                                                                '</tr>'+
								'</table>'+
								'<ul class="moreinfo" style="box-sizing:content-box;">'+
								'<li id="'+id+'-lot" >'+data[index][id].lot+'</li>'+
                                                                '<li id="'+id+'-remain" >'+'Reamin:'+data[index][id].remain+'</li>'+
                                                                '<li id="'+id+'-wafer" >'+data[index][id].wafer+'</li>'+
								'</ul>'+
                                                                '</div>'
                                                                );
								}else{
								$("#myimage").append(
                                                                '<div class="img" style="box-sizing:content-box;">'+
                                                                '<a  href="javascript:void(0);" onclick="pstatus('+"'"+escape(data[index][id].image)+"'"+' )" style="display: block;padding:0px;height:150px;">'+
                                                                '<img id="'+id+'-image" src='+data[index][id].image+'?time='+Math.random()+'" alt="Loading" style="width:100%;">'+
                                                                '</a>'+
                                                                '<table style="width:100%;table-layout:fixed;" rules=cols class="text-center">'+
                                                                '<tr>'+
                                                                '<td class="table1" id="'+id+'-tool" >'+id+'</td>'+
                                                                '<td class="table1"><a href="javascript:void(0);" id="'+id+'-part" style="text-decoration:none;">'+data[index][id].part+'</a></td>'+
                                                                '</tr>'+
                                                                '<tr>'+
                                                                '<td id="'+id+'-evr" class="table1" style="background-color:'+data[index][id].color_evr+';">'+data[index][id].status_evr+'</td>'+
                                                                '<td id="'+id+'-ems" class="table1" style="background-color:'+data[index][id].color_ems+';">'+data[index][id].status_ems+'</td>'+
                                                                '</tr>'+
                                                                '</table>'+
                                                                '<ul class="moreinfo" style="box-sizing:content-box;">'+
                                                                '<li id="'+id+'-lot" >'+data[index][id].lot+'</li>'+
                                                                '<li id="'+id+'-remain" >'+'Reamin:'+data[index][id].remain+'</li>'+
                                                                '<li id="'+id+'-wafer" >'+data[index][id].wafer+'</li>'+
                                                                '</ul>'+
                                                                '</div>'
                                                                );
								}
                                                        });

						});
				 $("img").on("mouseenter",function(){
                                        $(this).parents(".img").children(".moreinfo").animate({"height":"70px","bottom":"-70px"},"slow");
                                        $(this).parents(".img").css("zIndex","2");
                                });
                                $(".img").on("mouseleave",function(){
                                        $(this).children(".moreinfo").animate({"height":"0px","bottom":"0px"},"fast");
                                        $(this).css("zIndex","1");
                                });

							 var timeer=setInterval("refresh('"+escape(platform)+"')",60000);
							l.stop();
                                                        },
                                                error:function(XMLHttpRequest, textStatus, errorThrown) {
							     l.stop();
                                                        alert("ajax.state："+XMLHttpRequest.readyState);
                                                        alert("ajax.status："+XMLHttpRequest.status);
                                                        alert("ajax："+textStatus);
                                                }
                                                });
		});
		})
		function submit(platform,part){




		}
		function refresh(platform,part){
			platform=unescape(platform);
			part=unescape(part);
//			for (var i = 0; i < i_index; i++) {
//				var this_src= $("#"+i).attr("src");
//				var src=this_src.match(/(.*)\?/);
			//	$("#"+i).removeAttr("src");
//				$("#"+i).attr("src", src[1]+"?time="+Math.random());
//				}
					$.ajax({
						type:'post',
                                                url:'/cgi-bin/RealView/image.pl',
                                                data:{platform:platform,part:part},
                                                dataType:'json',
                                                async:false,
                                                success:function(data){
							$.each(data,function(key,value){	
								$.each(data[key],function(index,value){
									$("#"+index+"-image").attr("src", data[key][index].image+"?time="+Math.random());
									$("#"+index+"-tool").html(index);
									$("#"+index+"-part").html(data[key][index].part);
									$("#"+index+"-lot").html(data[key][index].lot);
									$("#"+index+"-evr").css("background-color",data[key][index].color_evr);
									$("#"+index+"-evr").html(data[key][index].status_evr);
									$("#"+index+"-ems").css("background-color",data[key][index].color_ems);
                                                                        $("#"+index+"-ems").html(data[key][index].status_ems);
									$("#"+index+"-remain").html('Remain:'+data[key][index].remain);
									$("#"+index+"-wafer").html(data[key][index].wafer);

								});
							});
						                      },
                                                error:function(XMLHttpRequest, textStatus, errorThrown) {
							alert("Lost To Server");
                                                        alert("ajax.state："+XMLHttpRequest.readyState);
                                                        alert("ajax.status："+XMLHttpRequest.status);
                                                        alert("ajax："+textStatus);
                                                }
                                                });


		}
		function pstatus(src){
			src=unescape(src+"?time="+Math.random());
			$("#modal_image").attr("src", src);
			$("#mymodal").modal('show');
		}

	
