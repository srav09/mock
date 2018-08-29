/**
 * Created by skatkoori.
 */
(function() {
	'use strict';
	duMockApp
			.factory(
					'holdsService',
					[
							'restService',
							function(restService) {
								
								var getHolds = function() {
									return restService
									.getData("http://dux-services-dev.umuc.edu:8080/demo-0.0.1-SNAPSHOT/my/holds");
								};
								
								var postHolds = function(data) {
									return restService
											.postData(
													"http://dux-services-dev.umuc.edu:8080/demo-0.0.1-SNAPSHOT/my/editHold", data);
								};
								
								var addHolds = function(data) {
									return restService
											.postData(
													"http://dux-services-dev.umuc.edu:8080/demo-0.0.1-SNAPSHOT/my/addHolds", data);
								};
								
								var deleteHolds = function(data) {
									return restService
										.postData("http://dux-services-dev.umuc.edu:8080/demo-0.0.1-SNAPSHOT/my/deleteHold/" + data);
								};
								
								var deleteAllHolds = function(data) {
									return restService
											.postData(
													"http://dux-services-dev.umuc.edu:8080/demo-0.0.1-SNAPSHOT/my/deleteHolds", data);
								};
								
								return {
									getHolds : getHolds,
									postHolds : postHolds,
									deleteHolds : deleteHolds,
									deleteAllHolds : deleteAllHolds,
									addHolds:addHolds
								}
							} ]);
}());