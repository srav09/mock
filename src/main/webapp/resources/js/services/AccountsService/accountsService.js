/**
 * Created by skatkoori.
 */
(function() {
	'use strict';
	duMockApp
			.factory(
					'accountsService',
					[
							'restService',
							function(restService) {
								var getAccounts = function() {
									return restService
											.getData("http://dux-services-dev.umuc.edu:8080/demo-0.0.1-SNAPSHOT/my/account");
								};

								var postAccounts = function(data) {
									return restService
											.postData(
													"http://dux-services-dev.umuc.edu:8080/demo-0.0.1-SNAPSHOT/my/editAccBal", data);
								};

								var addAccounts = function(data) {
									return restService
											.postData(
													"http://dux-services-dev.umuc.edu:8080/demo-0.0.1-SNAPSHOT/my/addAccBals", data);
								};

								
								var deleteAccounts = function(data) {
									return restService
											.postData("http://dux-services-dev.umuc.edu:8080/demo-0.0.1-SNAPSHOT/my/deleteAccBal/" + data);
								};

								var deleteAllAccounts = function(data) {
									return restService
											.postData(
													"http://dux-services-dev.umuc.edu:8080/demo-0.0.1-SNAPSHOT/my/deleteAccBals", data);
								};

								return {
									getAccounts : getAccounts,
									postAccounts : postAccounts,
									deleteAccounts : deleteAccounts,
									deleteAllAccounts : deleteAllAccounts,
									addAccounts : addAccounts,
								}
							} ]);
}());
