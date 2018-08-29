/**
 * Created by skatkoori.
 */
(function() {
	'use strict';
	duMockApp
			.directive(
					'grades',
					function($compile) {
						return {
							replace : true,
							restrict : 'E',
							templateUrl : 'views/grades/grades.html',
							link : function(scope, element, attr) {
							},
							controllerAs : 'gradesCtrl',
							controller : [
									'$scope',
									'$log',
									'gradesService',
									'$uibModal',
									'$timeout',
									'restService',
									function($scope, $log, gradesService,
											$uibModal, $timeout, restService) {
										$scope.gradesValue = "";
										$scope.selectedCheckBoxes = [];
										gradesService
												.getGrades()
												.then(
														function(data) {
															$scope.myGrades = !$scope.myGrades;
															$scope.gradesData = data;
														});

										$scope.gradesLinkClicked = function(
												$index) {
											$scope.index = $index;
											$scope.gradesValue = $scope.gradesData;
											$scope.modalInstance = $uibModal
													.open({
														templateUrl : 'views/grades/gradesDetail/gradesDetail.html',
														scope : $scope,
														controllerAs : 'gradesDetailCtrl',
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

	/*									$scope.selectedGrades = function(index,
												isChecked) {
											if (isChecked) {
												$scope.selectedCheckBoxes
														.push(index);
												$scope.gradesData[index].check = true;
											} else {
												$scope.gradesData[index].check = false;
												var removeIndex = $scope.selectedCheckBoxes
														.indexOf(index);
												$scope.selectedCheckBoxes
														.splice(removeIndex, 1);
											}
										}*/
										$scope.selectedGradeTempIds = [];
										$scope.selectedGrades = function(grade) {
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
										$scope.selectAllGrades = function() {
											$scope.selectedGradeTempIds = [];
											
											if ($scope.selectAll == true) {
												
										angular.forEach($scope.gradesData,function(grade) {
															grade.check = true;
															$scope.selectedGradeTempIds.push({tempId : grade.tempId});
														});
												  
											} else if ($scope.selectAll == false) {
												angular.forEach(
														$scope.gradesData,
														function(item) {
															item.check = false;
														});
												$scope.selectedGradeTempIds = [];
											}
											
										}

										$scope.deleteAllGrades = function() {
											
											gradesService
													.deleteAllGrades($scope.selectedGradeTempIds )
													.then(
															function(data) {
																$scope.gradesData = data;
															});
										}

										$scope.deleteGrades = function(tempId) {
											gradesService
													.deleteGrades(tempId)
													.then(
															function(data) {
																$scope.gradesData = data;
															});
										}

										$scope.$on('myEventGrades', function(event,
												data) {
											$scope.gradesValue = data;
										});

										$scope.saveGrades = function() {
											$scope.data = angular
													.copy($scope.gradesValue);
													delete $scope.data.check;

											if ($scope.index == undefined) {
												gradesService
														.addGrades($scope.data)
														.then(
																function(data) {
																	$scope.gradesData = data;
																	if(Object.keys(data).length > 0){		
																		$scope.addData = false;		
																	}
																	$scope.modalInstance
																			.close();
																});
											} else {

												gradesService
														.postGrades($scope.data)
														.then(
																function(data) {
																	$scope.gradesData = data;
																	$scope.modalInstance
																			.close();
																});
											}
										}
									} ],
						}
					});

	duMockApp.directive('gradesEdit', function($rootScope) {
		return {
			restrict : 'A',
			scope : {
				grades : '=grades'
			},
			link : function(scope, element, attrs) {
				element.text(JSON.stringify(scope.grades, undefined, 2));
				element.change(function(e) {
					scope.$apply(function() {
						scope.grades = JSON.parse(e.currentTarget.value);
					});
					$rootScope.$broadcast('myEventGrades', scope.grades);
				})
			}
		}
	});
}());