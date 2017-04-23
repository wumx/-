$(function(){
/*********加载工具栏***********/
	$('#tools').load("com.html #tool_wapper",function(){

		//划入效果
		$('.tool_hide').mouseenter(function(){
			$(this).find('.tool_show').css('display',"block");
			$(this).css('background',"#fff");
		});
		//划出效果
		$('#tool_wapper').find('.tool_hide').mouseleave(function(){
			$(this).find('.tool_show').css('display',"none");
			$(this).css('background',"#f7f7f7");
		});
	});

	//加载尾部
	$('#footer').load("com.html .foot_wapper");

/***********注册验证*************/
	$('.login_warp').on('focus','.gt',function(){
		$(this).find('li').eq(0).addClass('show').siblings().removeClass('show');
	});
	var btnTest = 0;
	//用户名验证
	$('#userID').blur(function(){
		var str = $('#userID').val();
		var s = str.search(/^[a-zA-Z_]\w{5,19}$/);
		liShow(s,0);
	});
	//密码验证
	$('#password1').blur(function(){
		var str = $('#password1').val();
		var s = str.search(/^[a-zA-Z][a-zA-Z0-9_]{5,19}$/);
		liShow(s,1)
	})
	//确认密码验证
	$('#password2').blur(function(){
		var str1 = $('#password1').val();
		var str2 = $('#password2').val();
		if(str1 != str2){
			liShow(-1,2)
		}else{
			liShow(1,2)
		}
	})
	//验证码切换
	var arr = ['48dj','234d','dif3','246e','5f4g','4ua3','4f6g','dd3e','3f55','da35']; //验证码数组
	$('.yzm').click(function(){
		var verifyIndex = parseInt(Math.random()*10);       //随机显示验证码的下标
		$('.yzm').html(arr[verifyIndex]);
	})
	//验证码的验证
	$('#test').blur(function(){
		var str1 = $('#test').val();
		var str2 = $('.yzm').text();
		if( str1 != str2){
			liShow(-1,3)
		}else{
			liShow(1,3)
		}
	})
	//邮箱验证
	$('#email').blur(function(){
		var str = $('#email').val();
		var s = str.search(/^\w+@\w+(\.\w+)+$/);
		liShow(s,4);
	})
	//验证信息显示函数
	function liShow(s,index){
		if(s == -1){
			$('.gt').eq(index).find('li').eq(1).addClass('show').siblings().removeClass('show')
		}else{
			btnTest++;
			$('.gt').eq(index).find('li').eq(2).addClass('show').siblings().removeClass('show')
		}
	}
	//同意并完成注册
	var iFlat = true;
	$('.login-remember').find('i').click(function(){
		$('.login-remember').find('i').toggleClass('i1');
		if($('.login-remember').find('i').attr('class').split(' ')[1]){
			iFlat = true;
		}else{
			iFlat = false;
		}
		console.log($('.login-remember').find('i').attr('class').split(' ')[1]);
	});
	//注册完成按钮
	$('input[type=button]').click(function(){
		var ID = $('input[type=text]').eq(0).val();
		var password = $('input[type=text]').eq(1).val();
		if(btnTest >= 5 && iFlat){
			$.cookie("userId",ID);
			$.cookie("passId" , password);
			window.location.href="./bl_login.html";
		}

	});
});
