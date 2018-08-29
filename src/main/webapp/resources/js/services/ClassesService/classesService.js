/**
 * Created by skatkoori.
 */
(function() {
	'use strict';
	duMockApp
			.factory(
					'classesService',
					[
							'restService',
							function(restService) {
								var getClasses = function() {
									return restService
											.getData("http://dux-services-dev.umuc.edu:8080/demo-0.0.1-SNAPSHOT/my/classes");
								};

								var postClasses = function(data) {
									return restService
											.postData(
													"http://dux-services-dev.umuc.edu:8080/demo-0.0.1-SNAPSHOT/my/editClass", data);
								};

								var addClasses = function(data) {
									return restService
											.postData(
													"http://dux-services-dev.umuc.edu:8080/demo-0.0.1-SNAPSHOT/my/addClasses", data);
								};

								var deleteClasses = function(data) {
									return restService
											.postData("http://dux-services-dev.umuc.edu:8080/demo-0.0.1-SNAPSHOT/my/deleteClass/" + data);
								};

								var deleteAllClasses = function(data) {
									return restService
											.postData(
													"http://dux-services-dev.umuc.edu:8080/demo-0.0.1-SNAPSHOT/my/deleteClasses", data);
								};

								return {
									getClasses : getClasses,
									postClasses : postClasses,
									deleteClasses : deleteClasses,
									deleteAllClasses : deleteAllClasses,
									addClasses : addClasses,
								}
							} ]);
}());
