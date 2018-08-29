/**
 * Created by skatkoori.
 */
(function() {
	'use strict';
	duMockApp
			.directive(
					'accounts',
					function($compile) {
						return {
							replace : true,
							restrict : 'E',
							templateUrl : 'views/accounts/accounts.html',
							link : function(scope, element, attr) {
							},
							controllerAs : 'accountsCtrl',
							controller : [
									'$scope',
									'$log',
									'accountsService',
									'$uibModal',
									'$timeout',
									'restService',
									function($scope, $log, accountsService, $uibModal, $timeout, restService) {
										$scope.accountsValue = "";
										$scope.selectedCheckBoxes = [];
										$scope.addData = false;

										//service calling get account data
										accountsService
												.getAccounts()
												.then(
														function(data) {
																$scope.myAccounts = !$scope.myAccounts;
																$scope.accountsData = data;
																if(Object.keys(data).length === 0){
																	$scope.addData = true;
																	$scope.accountsData = " Add New Data";
																}
														});

										$scope.showButton = function(data){
											
											if($scope.accountsData == " Add New Data"){
												return false;
											}
											return true;
										}


										//Pop up Modal display Detail Page				
										$scope.accountsLinkClicked = function(data) {
											$scope.accountsValue = data;
											$scope.index = data;
											$scope.modalInstance = $uibModal
													.open({
														templateUrl : 'views/accounts/accountsDetail/accountsDetail.html',
														scope: $scope,
														controllerAs : 'accountsDetailCtrl',
														controller : [
																'$scope',
																'$uibModalInstance',
																function(
																		$scope,
																		$uibModalInstance) {
																	$scope.closeModal = function() {
																		$uibModalInstance
																				.dismiss();
																	};
																} ]
													})
										}

										//selected ,unselected check box TempIds to delete the accounts
										$scope.selecteAccountTempIds = [];
										$scope.selectedAccounts = function(account) {
											if(account.check) {
												$scope.selecteAccountTempIds.push({tempId : account.tempId});
												}
											else {
												var removeIndex = $scope.selecteAccountTempIds.findIndex(function (i){
													 i.tempId==account.tempId
												});
												$scope.selecteAccountTempIds.splice(removeIndex, 1);
											}
										}

										//select all and  un select all check boxes											
										$scope.selectAll=false;
										$scope.selectAllAccounts = function() {
											$scope.selecteAccountTempIds = [];
											
											if ($scope.selectAll == true) {
												
										angular.forEach($scope.accountsData,function(account) {
															account.check = true;
															$scope.selecteAccountTempIds.push({tempId : account.tempId});
														});
												  
											} else if ($scope.selectAll == false) {
												angular.forEach(
														$scope.accountsData,
														function(item) {
															item.check = false;
														});
												$scope.selecteAccountTempIds = [];
											}
											
										}										
										
                                       //delete all accounts by using selecteAccountTempIds
											$scope.deleteAllAccounts = function() {
												accountsService.deleteAllAccounts(
														$scope.selecteAccountTempIds).then(
														function(data) {
															$scope.accountsData = data;
														});
											}

											// single account deletion using only the particular TempId
											$scope.deleteAccounts = function(tempId) {
												accountsService
														.deleteAccounts(tempId)
														.then(function(data) {
															$scope.accountsData = data;
															if(Object.keys(data).length <= 0){
																$scope.addData = true;
																$scope.accountsData = " Add New Data";
															}

														});
											}

											
											$scope.$on('myAccount', function(event,
													data) {
												$scope.accountsValue = data;
											});

											//Edit and save single account // creating a copy of accountsValue with out effecting in array
											$scope.saveAccounts = function() {
												$scope.data = angular
														.copy($scope.accountsValue);
												
												if($scope.index == undefined){
														accountsService
															.addAccounts($scope.data)
															.then(
																	function(data) {
																		$scope.accountsData = data;
																		if(Object.keys(data).length > 0){
																			$scope.addData = false;
																		}
																		$scope.modalInstance
																				.close();
																	});
												   }
												else {
													accountsService
													.postAccounts($scope.data)
													.then(
															function(data) {
																$scope.accountsData = data;
																if(Object.keys(data).length > 0){
																	$scope.addData = false;
																}
																$scope.modalInstance
																		.close();
															});		
										 		}

											}
										} ],
							}
						});

// stringify the text and sent the user edit text values to controller ,It will trigger at the time of user editing	the text															
	duMockApp.directive('accountsEdit', function($rootScope) {
		return {
			restrict : 'A',
			scope : {
				accounts : '=accounts'
			},
			link : function(scope, element, attrs) {
				element.text(JSON.stringify(scope.accounts, undefined, 2));
				element.change(function(e) {
					scope.$apply(function() {
						scope.accounts = JSON.parse(e.currentTarget.value);
					});
					$rootScope.$broadcast('myAccount', scope.accounts);
				})
			}
		}
	});
}());