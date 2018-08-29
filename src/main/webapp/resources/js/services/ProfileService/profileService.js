/**
 * Created by skatkoori.
 */
(function() {
	'use strict';
	duMockApp
			.factory(
					'profileService',
					[
							'restService',
							function(restService) {
								var getProfile = function() {
									return restService
											.getData("http://dux-services-dev.umuc.edu:8080/demo-0.0.1-SNAPSHOT/my/profile");
								};

								var postProfile = function(data) {
									return restService
											.postData(
													"http://dux-services-dev.umuc.edu:8080/demo-0.0.1-SNAPSHOT/my/editProfile", data);
								};

								var addProfile = function(data) {
									return restService
											.postData(
													"http://dux-services-dev.umuc.edu:8080/demo-0.0.1-SNAPSHOT/my/addProfile", data);
								};

								var deleteProfile = function(data) {
									return restService
											.postData("http://dux-services-dev.umuc.edu:8080/demo-0.0.1-SNAPSHOT/my/deleteProfile/" + data);
								};

								var deleteAllProfile = function(data) {
									return restService
											.postData(
													"http://dux-services-dev.umuc.edu:8080/demo-0.0.1-SNAPSHOT/my/deleteProfiles", data);
								};

								return {
									getProfile : getProfile,
									postProfile : postProfile,
									deleteProfile : deleteProfile,
									deleteAllProfile : deleteAllProfile,
									addProfile : addProfile,
								}
							} ]);
}());
