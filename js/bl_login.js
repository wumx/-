$(function(){
	
/*****验证码部分******/
	var arr = ['48dj','234d','dif3','246e','5f4g','4ua3','4f6g','dd3e','3f55','da35']; //验证码数组
	//验证码函数
	function verify(){
		var verifyIndex = parseInt(Math.random()*10);       //随机显示验证码的下标
		$('.verify').children().eq(1).html(arr[verifyIndex]);
	}
	$('.verify').children().eq(1).click(verify);     //点击切换
	
/******其他登录方式logo的划入划出效果*****/
	$('.login_logo').on('mouseenter','a',function(){
		$(this).css('background-position-y','top');
	})
	$('.login_logo').on('mouseleave','a',function(){
		$(this).css('background-position-y','bottom');
	});
/****账号密码的验证*****/	
	$('.login_btn').children().eq(0).click(function(){	
			var user = $('#userID').val();
			var pass = $('#password').val();

			var str1 =  $('.verify').children().eq(0).val();     //用户输入的验证码
				var str2 =  $('.verify').children().eq(1).text();	//提供的验证码
				if(str1 == str2){
							
			$.ajax({
				url:"http://datainfo.duapp.com/shopdata/userinfo.php",
				type:"POST",
				data:{
					status:"login",
					userID:user,
					password:pass
				},
				success:function(res){
					switch(res){
						case 0: test(0);break;
						case 2: test(2);break;
						default:test();
					}

					
						function test(num){
							$('.userTest').eq(0).addClass('error');
							if(num == 0){
								$('.userTest').children().eq(0).text('用户名不存在');
							}else{
								$('.userTest').children().eq(0).text('用户名与密码不符');
							}
						}


					function succ(){
						console.log(user)
						$.cookie('user',user,{expires:7,path:'/'});
						window.location.href = "index.html";
					}

				}
		});
	}else{
		$('.userTest').eq(0).addClass('error');
		$('.userTest').children().eq(0).text('验证码不正确');
	}
	
	});
	
});
