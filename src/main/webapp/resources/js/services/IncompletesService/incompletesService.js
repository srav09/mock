/**
 * Created by skatkoori.
 */
(function() {
	'use strict';
	duMockApp
			.factory(
					'incompletesService',
					[
							'restService',
							function(restService) {
								var getIncompletes = function() {
									return restService
											.getData("http://dux-services-dev.umuc.edu:8080/demo-0.0.1-SNAPSHOT/my/incompletes");
								};

								var postIncompletes = function(data) {
									return restService
											.postData(
													"http://dux-services-dev.umuc.edu:8080/demo-0.0.1-SNAPSHOT/my/editIncompletes",
													data);
								};

								var addIncompletes = function(data) {
									return restService
											.postData(
													"http://dux-services-dev.umuc.edu:8080/demo-0.0.1-SNAPSHOT/my/addIncompletes",
													data);
								};

								var deleteIncompletes = function(data) {
									return restService
											.postData("http://dux-services-dev.umuc.edu:8080/demo-0.0.1-SNAPSHOT/my/deleteIncomplete/"
													+ data);
								};

								var deleteAllIncompletes = function(data) {
									return restService
											.postData(
													"http://dux-services-dev.umuc.edu:8080/demo-0.0.1-SNAPSHOT/my/deleteIncompletes",
													data);
								};

								return {
									getIncompletes : getIncompletes,
									postIncompletes : postIncompletes,
									deleteIncompletes : deleteIncompletes,
									deleteAllIncompletes : deleteAllIncompletes,
									addIncompletes : addIncompletes,
								}
							} ]);
}());
