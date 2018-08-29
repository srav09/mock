/**
 * Created by skatkoori.
 */
(function() {
	'use strict';
	duMockApp
			.directive(
					'incompletes',
					function($compile) {
						return {
							replace : true,
							restrict : 'E',
							templateUrl : 'views/incompletes/incompletes.html',
							link : function(scope, element, attr) {
							},
							controllerAs : 'incompletesCtrl',
							controller : [
									'$scope',
									'$log',
									'incompletesService',
									'$uibModal',
									'$timeout',
									'restService',
									function($scope, $log, incompletesService,
											$uibModal, $timeout, restService) {
										$scope.incompletesValue = "";
										$scope.selectedCheckBoxes = [];
										$scope.addData = false
										incompletesService
												.getIncompletes()
												.then(
														function(data) {
															$scope.myIncompletes = !$scope.myIncompletes;
															$scope.incompletesData = data;
															if(Object.keys(data).length === 0){
																$scope.addData = true;
																$scope.incompletesData = " Add New Data";
															}
														});
										
										$scope.showEdit = function(data,$index){
											var middle = Math.round((data.length - 1) / 2);
											
											if(middle === $index){
												return true;
											}
											return false;
										}

										$scope.incompletesLinkClicked = function(
												$index) {
											$scope.index = $index;
											$scope.incompletesValue = $scope.incompletesData;
											$scope.modalInstance = $uibModal
													.open({
														templateUrl : 'views/incompletes/incompletesDetail/incompletesDetail.html',
														scope : $scope,
														controllerAs : 'incompletesDetailCtrl',
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

										$scope.selectedGradeTempIds = [];
										$scope.selectedIncompletes = function(grade) {
											if(grade.check) {
												$scope.selectedGradeTempIds.push({tempId : grade.tempId});
												}
											else {
												var removeIndex = $scope.selectedGradeTempIds.findIndex(function (i){
													 i.tempId==grade.tempId
												});
												$scope.selectedGradeTempIds.splice(removeIndex, 1);
											}
										}
										

										$scope.selectAll = false;
										$scope.selectAllIncompletes = function() {
											$scope.selectedGradeTempIds = [];
											
											if ($scope.selectAll == true) {
												
										angular.forEach($scope.incompletesData,function(grade) {
															grade.check = true;
															$scope.selectedGradeTempIds.push({tempId : grade.tempId});
														});
												  
											} else if ($scope.selectAll == false) {
												angular.forEach(
														$scope.incompletesData,
														function(item) {
															item.check = false;
														});
												$scope.selectedGradeTempIds = [];
											}
											
										}

										$scope.deleteAllIncompletes = function() {
											
											incompletesService
													.deleteAllIncompletes($scope.selectedGradeTempIds )
													.then(
															function(data) {
																$scope.incompletesData = data;
															});
										}

										$scope.deleteIncompletes = function(tempId) {
											incompletesService
													.deleteIncompletes(tempId)
													.then(
															function(data) {
																$scope.incompletesData = data;
															});
										}

										$scope.$on('myEventIncompletes', function(event,
												data) {
											$scope.incompletesValue = data;
										});

										$scope.saveIncompletes = function() {
											//debugger;
											$scope.data = angular
													.copy($scope.incompletesValue);
											delete $scope.data.check;

											if ($scope.index == undefined) {
												incompletesService
														.addIncompletes($scope.data)
														.then(
																function(data) {
																	$scope.incompletesData = data;
																	if(Object.keys(data).length > 0){
																		$scope.addData = false;
																	}
																	$scope.modalInstance
																			.close();
																});
											} else {

												incompletesService
														.postIncompletes($scope.data)
														.then(
																function(data) {
																	$scope.incompletesData = data;
																	$scope.modalInstance
																			.close();
																	if(Object.keys(data).length > 0){
																		$scope.addData = false;
																	}
																});
											}
										}
									} ],
						}
					});

	duMockApp.directive('incompletesEdit', function($rootScope) {
		return {
			restrict : 'A',
			scope : {
				incompletes : '=incompletes'
			},
			link : function(scope, element, attrs) {
				element.text(JSON.stringify(scope.incompletes, undefined, 2));
				element.change(function(e) {
					scope.$apply(function() {
						scope.incompletes = JSON.parse(e.currentTarget.value);
					});
					$rootScope.$broadcast('myEventIncompletes', scope.incompletes);
				})
			}
		}
	});
}());