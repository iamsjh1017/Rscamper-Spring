// 앵귤러 모듈
angular.module("MypageApp")
.controller("MyPostController", function($rootScope, $scope, $http) {
	/** ==================================================== */
	/** 내 포스트 */
	/** ==================================================== */
	// 내 포스트 불러오기
	$scope.getMyPostList = function () {
		$http({
			url: myConfig.serverURL + "/community/select/board/user?page=1&userUid=" + $rootScope.user.userUid,
			method: "GET",
		}).success(function (response) {
			console.log(response)
			$scope.postList = response.boardList;
		}).error(function (error) {
			console.log(error);
		});
	}
	
	$scope.getMyPostList();
	
	// 포스트 삭제하기
	$scope.removePost = function (boardNo) {
		console.log(boardNo);
		// 삭제하시겠습니까
		swal({
			title : "포스트",
			text : "해당 포스트를삭제하시겠습니까?",
			type : "warning",
			showCancelButton : true,
			confirmButtonColor : "#DD6B55",
			confirmButtonText : "네",
			cancelButtonText : "아니오",
			closeOnConfirm : false,
			closeOnCancel : false
		}, function(isConfirm) {
			if (isConfirm) {
				$http({
					url: myConfig.serverURL + "/community/delete/oneBoard?boardNo=" + boardNo,
					method: "DELETE",
				}).success(function (){
					swal("삭제완료!", "해당 포스트가 삭제되었습니다.", "success");
					$scope.getMyPostList();
				}).error(function (error){
					swal("오류발생!", error, "error");
				})
			} else {
				swal("취소됨!", "삭제가 취소되었습니다.", "error");
			}
		});
	};
	
	
	//	메뉴 카운트 조회
	$scope.getMenuCount = function () {
		$http({
			url : myConfig.serverURL + "/mypage/select/menuCount?userUid=" + $rootScope.user.userUid,
			method : "GET"
		}).success(function(response) {
			$scope.menuCount = response;
		}).error(function(error) {
		
		})
	}
	$scope.getMenuCount();
	
	/** ===========프로필 이미지 관련============================ */
	// 프로필 사진 업로드 이미지 미리보기 이벤트
	$('#profileImageFile').on('change', function(){
		if(img_validation(this)) {
			readURL(this, $('#profileImage'));
		} else {
			$(this).val("");
			$('#profileImage').attr('src', '/rscamper-web/resources/img/default/default-image.png');
		};
	});
	// 프로필 사진 변경 모달창 열기
	$scope.updateProfileImage = function () {
		$scope.uploadProfileUrl = myConfig.serverURL + "/user/upload/profileImage"
		$("#profileImage").val("");
		$("#profileImageFile").val("");
		$('#profileImageUploadFormModal').modal('show');
	};
	// 프로필 업로드 완료 콜백
	$scope.uploadProfileCallBack = function (result) {
        var data = JSON.parse(result);
        var userPhoto = {
          userUid: $scope.user.userUid,
          type: data.type,
          path: data.path,
          size: data.size
        }
        $scope.updateImage(userPhoto, "/user/update/profileImage")
	};
	
	// 배경 파일 업로드 이미지 미리보기 이벤트
	$('#BGImageFile').on('change', function(){
		if(img_validation(this)) {
			readURL(this, $('#BGImage'));
		} else {
			$(this).val("");
			$('#BGImage').attr('src', '/rscamper-web/resources/img/default/default-image.png');
		};
	});
	// 배경 사진 변경 모달창 열기
	$scope.updateBGImage = function () {
		$scope.uploadBGUrl = myConfig.serverURL + "/user/upload/bgImage"
		$("#BGImageFile").val("");
		$('#BGImage').attr('src', '/rscamper-web/resources/img/default/default-image.png');
		$('#BGImageUploadFormModal').modal('show');
	};
	// 배경사진 업로드 완료 콜백
	$scope.uploadBGCallBack = function (result) {
        var data = JSON.parse(result);
        var userPhoto = {
          userUid: $scope.user.userUid,
          type: data.type,
          path: data.path,
          size: data.size
        }
        $scope.updateImage(userPhoto, "/user/update/bgImage")
	};
	
	// 사진 데이터베이스 업데이트
    $scope.updateImage = function (userPhoto, url) {
        $http({
          url: myConfig.serverURL + url,
          method: "POST",
          data: $.param({
            userUid: userPhoto.userUid,
            type: userPhoto.type,
            path: userPhoto.path,
            size: userPhoto.size
          }),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
          }
        })
        .success(function () {
         	 $http({
                 url: myConfig.serverURL + "/user/select/oneUser?userUid=" + $scope.user.userUid,
                 method: "GET"
             })
             .success(function (result) {
             	sessionStorageService.setObject("user", result);
             	$scope.user = sessionStorageService.getObject("user");
        		$("#BGImageFile").val("");
        		$('#BGImage').attr('src', '/rscamper-web/resources/img/default/default-image.png');
        		$('#BGImageUploadFormModal').modal('hide');
        		$("#profileImage").attr("src", "/rscamper-web/resources/img/default/default-image.png");
        		$("#profileImageFile").val("");
        		$('#profileImageUploadFormModal').modal('hide');
             });
        });
    };
	/** ===========프로필 이미지 관련============================ */
})

// 왼쪽 메뉴에 액티브 효과주기
$(".list-group-item").removeClass("active");
$("#my_post_menu").addClass("active");
