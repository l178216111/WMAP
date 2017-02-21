			$(function(){
                        var id=document.cookie;
                        var regex=/CGISESSID=(\w*)/;
                        if(regex.test(id)){
                          var   sid=RegExp.$1;
                        $.ajax({  //这里是用jquery自带的ajax发送请求。    
                        type:'POST',
                        url:'/cgi-bin/RealView/login.pl',
                        data:{sid:sid},
                        dataType:'json',
                        async:false,    
                        success:function(data){    //这里的json就是从后台获取的借口。  
                                if(data.result!='0'){
                              //  document.getElementById("user").innerHTML=data.result;
				}else{
                                alert('Pls Login');
                                window.location.href='./login.html';
                        	}
                                },
                                                error:function(XMLHttpRequest, textStatus, errorThrown) {
                                                }
                                                });

                        } else{
                                alert('Pls Login');
                                window.location.href='./login.html';
                                }
      
				
                        })     
