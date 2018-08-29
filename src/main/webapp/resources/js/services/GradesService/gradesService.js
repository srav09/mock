/**
 * Created by skatkoori.
 */
(function() {
	'use strict';
	duMockApp
			.factory(
					'gradesService',
					[
							'restService',
							function(restService) {
								var getGrades = function() {
									return restService
											.getData("http://dux-services-dev.umuc.edu:8080/demo-0.0.1-SNAPSHOT/my/grades");
								};

								var postGrades = function(data) {
									return restService
											.postData(
													"http://dux-services-dev.umuc.edu:8080/demo-0.0.1-SNAPSHOT/my/editGrade", data);
								};

								var addGrades = function(data) {
									return restService
											.postData(
													"http://dux-services-dev.umuc.edu:8080/demo-0.0.1-SNAPSHOT/my/addGrades", data);
								};

								var deleteGrades = function(data) {
									return restService
											.postData("http://dux-services-dev.umuc.edu:8080/demo-0.0.1-SNAPSHOT/my/deleteGrade/" + data);
								};

								var deleteAllGrades = function(data) {
									return restService
											.postData(
													"http://dux-services-dev.umuc.edu:8080/demo-0.0.1-SNAPSHOT/my/deleteGrades", data);
								};

								return {
									getGrades : getGrades,
									postGrades : postGrades,
									deleteGrades : deleteGrades,
									deleteAllGrades : deleteAllGrades,
									addGrades : addGrades,
								}
							} ]);
}());
