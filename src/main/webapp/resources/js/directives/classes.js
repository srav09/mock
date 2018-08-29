/**
 * Created by skatkoori.
 */
(function() {
	'use strict';
	duMockApp
			.directive(
					'classes',
					function($compile) {
						return {
							replace : true,
							restrict : 'E',
							templateUrl : 'views/classes/classes.html',
							link : function(scope, element, attr) {
							},
							controllerAs : 'classesCtrl',
							controller : [
									'$scope',
									'$log',
									'classesService',
									'$uibModal',
									'$timeout',
									'restService',
									function($scope, $log, classesService,
											$uibModal, $timeout, restService) {
										$scope.classesValue = "";
										$scope.selectedCheckBoxes = [];
										$scope.addData = false
										classesService
												.getClasses()
												.then(
														function(data) {
															$scope.myClasses = !$scope.myClasses;
															$scope.classesData = data;
															if(Object.keys(data).length === 0){
																$scope.addData = true;
																$scope.classesData = " Add New Data";
															}
														});
										
										$scope.showButton = function(data,$index){
											var middle = Math.round((data.length - 1) / 2);
											
											if(middle === $index){
												return true;
											}
											return false;
										}

										$scope.classesLinkClicked = function(
												$index) {
											$scope.index = $index;
											$scope.classesValue = $scope.classesData;
											$scope.modalInstance = $uibModal
													.open({
														templateUrl : 'views/classes/classesDetail/classesDetail.html',
														scope : $scope,
														controllerAs : 'classesDetailCtrl',
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
										$scope.selectedClasses = function(grade) {
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
										$scope.selectAllClasses = function() {
											$scope.selectedGradeTempIds = [];
											
											if ($scope.selectAll == true) {
												
										angular.forEach($scope.classesData,function(grade) {
															grade.check = true;
															$scope.selectedGradeTempIds.push({tempId : grade.tempId});
														});
												  
											} else if ($scope.selectAll == false) {
												angular.forEach(
														$scope.classesData,
														function(item) {
															item.check = false;
														});
												$scope.selectedGradeTempIds = [];
											}
											
										}

										$scope.deleteAllClasses = function() {
											
											classesService
													.deleteAllClasses($scope.selectedGradeTempIds )
													.then(
															function(data) {
																$scope.classesData = data;
															});
										}

										$scope.deleteClasses = function(tempId) {
											classesService
													.deleteClasses(tempId)
													.then(
															function(data) {
																$scope.classesData = data;
																if(Object.keys(data).length === 0){
																	$scope.addData = true;
																	$scope.classesData = " Add New Data";
																}
															});
										}

										$scope.$on('myEventClasses', function(event,
												data) {
											$scope.classesValue = data;
										});

										$scope.saveClasses = function() {
											//debugger;
											$scope.data = angular
													.copy($scope.classesValue);
											delete $scope.data.check;

											if ($scope.index == undefined) {
												classesService
														.addClasses($scope.data)
														.then(
																function(data) {
																	$scope.classesData = data;
																	if(Object.keys(data).length > 0){
																		$scope.addData = false;
																	}
																	$scope.modalInstance
																			.close();
																});
											} else {

												classesService
														.postClasses($scope.data)
														.then(
																function(data) {
																	$scope.classesData = data;
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

	duMockApp.directive('classesEdit', function($rootScope) {
		return {
			restrict : 'A',
			scope : {
				classes : '=classes'
			},
			link : function(scope, element, attrs) {
				element.text(JSON.stringify(scope.classes, undefined, 2));
				element.change(function(e) {
					scope.$apply(function() {
						scope.classes = JSON.parse(e.currentTarget.value);
					});
					$rootScope.$broadcast('myEventClasses', scope.classes);
				})
			}
		}
	});
}());