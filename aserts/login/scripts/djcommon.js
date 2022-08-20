$(document).ready(function () {

	/*获取窗体宽高*/
	var windowHeight = $(window).height();
	var windowWidth = $(window).width();

	/*通过JS垂直居中*/
	var loginHeigtHalf = 170;

	var windowHeightHalf = Math.ceil(windowHeight / 2);
	if (windowHeightHalf > loginHeigtHalf) {
		var domLogin_y = windowHeightHalf - loginHeigtHalf;
		$(".wrap-body").css("padding-top", domLogin_y + "px");
	}

	/*验证是否记住登陆（本地存储）*/

	var localStorageData = JSON.parse(localStorage.getItem('linfos'));

	if (localStorageData) {

		var uName = localStorageData.uname;
		var uPwd = localStorageData.upwd;

		$("#uname").val(uName);
		$("#upwd").val(uPwd);
		$("input[name='remember']").prop('checked', true);
	}

	/*登陆验证*/
	$("#adminlogin").submit(function () {
		var userName = $("#uname").val().trim();
		var userPwd = $("#upwd").val().trim();
		if (!userName || !userPwd) {
			$(".resinfo").show().text('请输入用户名和密码!');
		} else {
			$.ajax({
				url: '/admin/loginDo',
				type: 'post',
				dataType: 'text',
				data: { 'uname': userName, 'upwd': userPwd },
				beforeSend: function () {
				},
				success: function (data) {
					switch (data) {
						case 'error3':
							$(".resinfo").text('抱歉，您填写的用户名或密码错误！');
							break;
						case 'error17':
							$(".resinfo").text('抱歉，登陆失败！');
							break;
						case 'success':
							$(".resinfo").text('');
							doesAfterSuccess(userName, userPwd);
							break;
						default:
							$(".resinfo").text('');
					}

				}
			});
		}

		return false;
	});

	/*更多操作*/
	function doesAfterSuccess(u, p) {

		/*记住密码 本地存储*/
		var ischecked = $("input[name='remember']").prop('checked');
		if (!ischecked) {

			//删除本地存储
			localStorage.removeItem('linfos');

		} else {

			const info = {
				uname: u,
				upwd: p
			}

			//创建本地存储
			localStorage.setItem('linfos', JSON.stringify(info));
		}

		//跳转到后台主页
		location.href = "/admin";

	}

});