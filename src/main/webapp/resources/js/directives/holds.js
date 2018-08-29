/**
 * Created by skatkoori.
 */
(function() {
	'use strict';
	duMockApp
			.directive(
					'holds',
					function($compile) {
						return {
							replace : true,
							restrict : 'E',
							templateUrl : 'views/holds/holds.html',
							link : function(scope, element, attr) {
							},
							controllerAs : 'holdsCtrl',
							controller : [
									'$scope',
									'$log',
									'holdsService',
									'$uibModal',
									'$timeout',
									'restService',
									function($scope, $log, holdsService,
											$uibModal, $timeout, restService) {
										$scope.holdsValue = "";
										$scope.selectedCheckBoxes = [];
										holdsService
												.getHolds()
												.then(
														function(data) {
																$scope.myholds = !$scope.myholds;
																$scope.holdsData = data;
														});

										$scope.holdsLinkClicked = function(
												$index) {
											$scope.index = $index;
											$scope.holdsValue = $scope.holdsData[$scope.index];
											$scope.modalInstance = $uibModal
													.open({
														templateUrl : 'views/holds/holdsDetail/holdsDetail.html',
														scope: $scope,
														controllerAs : 'holdsDetailCtrl',
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
										$scope.selectedHoldTempIds=[];
										$scope.selectedHolds = function(hold) {
											if(hold.check) {
												$scope.selectedHoldTempIds.push({tempId : hold.tempId});
												}
											else {
												var removeIndex = $scope.selectedHoldTempIds.findIndex(function (i){
													 i.tempId==hold.tempId
												});
												$scope.selectedHoldTempIds.splice(removeIndex, 1);
											}
										}		
												
										$scope.selectAll = false;
																			
										$scope.selectAllHolds = function() {
											$scope.selectedHoldTempIds = [];
											
											if ($scope.selectAll == true) {
												
										angular.forEach($scope.holdsData,function(hold) {
															hold.check = true;
															$scope.selectedHoldTempIds.push({tempId : hold.tempId});
														});
												  
											} else if ($scope.selectAll == false) {
												angular.forEach(
														$scope.holdsData,
														function(item) {
															item.check = false;
														});
												$scope.selectedHoldTempIds = [];
											}
											
										}
										
																				
										$scope.deleteAllHolds = function() {
											holdsService.deleteAllHolds($scope.selectedHoldTempIds).then(
														function(data) {
															$scope.holdsData = data;
														});
											}

										
										
										$scope.deleteHolds = function(tempId) {
											holdsService
													.deleteHolds(tempId)
													.then(function(data) {
														$scope.holdsData = data;
													});
										}


											$scope.$on('holdsEvent', function(event,
													data) {
												$scope.holdsValue = data;
											});

											$scope.saveHolds = function() {
												$scope.data = angular
														.copy($scope.holdsValue);
														delete $scope.data.check;
											
												if($scope.index == undefined){	
											holdsService
														.addHolds($scope.data)
														.then(
																function(data) {
																	$scope.holdsData = data;
																	$scope.modalInstance
																			.close();
																});
												}
												else{
													
													holdsService
													.postHolds($scope.data)
													.then(
															function(data) {
																	$scope.holdsData = data;	
																$scope.modalInstance
																		.close();
															});		
												}
											}
										} ],
							}
						});



	duMockApp.directive('holdsEdit', function($rootScope) {
		return {
			restrict : 'A',
			scope : {
				holds : '=holds'
			},
			link : function(scope, element, attrs) {
				element.text(JSON.stringify(scope.holds, undefined, 2));
				element.change(function(e) {
					scope.$apply(function() {
						scope.holds = JSON.parse(e.currentTarget.value);
					});
					$rootScope.$broadcast('holdsEvent', scope.holds);
				})
			}
		}
	});
}());
