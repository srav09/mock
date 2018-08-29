/**
 * Created by skatkoori.
 */
(function() {
	'use strict';
	duMockApp
			.directive(
					'todos',
					function($compile) {
						return {
							replace : true,
							restrict : 'E',
							templateUrl : 'views/todos/todos.html',
							link : function(scope, element, attr) {
							},
							controllerAs : 'todosCtrl',
							controller : [
									'$scope',
									'$log',
									'todosService',
									'$uibModal',
									'$timeout',
									'restService',
									function($scope, $log, todosService,
											$uibModal, $timeout, restService) {
										$scope.todosValue = "";
										$scope.selectedCheckBoxes = [];
										todosService
												.getTodos()
												.then(
														function(data) {
															$scope.myTodos = !$scope.myTodos;
															$scope.todosData = data;
														});

										$scope.todosLinkClicked = function(
												$index) {
											$scope.index = $index;
											$scope.todosValue = $scope.todosData[$scope.index];
											$scope.modalInstance = $uibModal
													.open({
														templateUrl : 'views/todos/todosDetail/todosDetail.html',
														scope : $scope,
														controllerAs : 'todosDetailCtrl',
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
																} ],
													})
										}
										
										$scope.selectedTodoTempIds = [];
	
										$scope.selectedTodos = function(todo){
											if(todo.check) {
												$scope.selectedTodoTempIds.push({tempId : todo.tempId});
												}
											else {
												var removeIndex = $scope.selectedTodoTempIds.findIndex(function (i){
													 i.tempId==todo.tempId
												});
												$scope.selectedTodoTempIds.splice(removeIndex, 1);
											}
										}
												
									
										
										$scope.selectAll = false;
										
										$scope.selectAllTodos = function() { 
											$scope.selectedTodoTempIds = [];
											
											if ($scope.selectAll == true) {
												
												angular.forEach($scope.todosData,function(todo) {
															todo.check = true;
															$scope.selectedTodoTempIds.push({tempId : todo.tempId});
														});
												
											} else if ($scope.selectAll == false) {
												angular.forEach(
														$scope.todosData,
														function(item) {
															item.check = false;
														});
												$scope.selectedTodoTempIds = [];
											}
											
										}
										
										
										
										$scope.deleteAllTodos = function() {
										todosService.deleteAllTodos($scope.selectedTodoTempIds).then(
													function(data) {
														$scope.todosData = data;
													});
										}

										$scope.deleteTodos = function(tempId) {
											todosService
													.deleteTodos(tempId)
													.then(function(data) {
														$scope.todosData = data;
													});
										}

										$scope.$on('myTodosEvent', function(event,
												data) {
											$scope.todosValue = data;
										});

										$scope.saveTodos = function() {
											$scope.data = angular
													.copy($scope.todosValue);
													delete $scope.data.check;

											if ($scope.index == undefined) {
												todosService
														.addTodos($scope.data)
														.then(
																function(data) {
																	$scope.todosData = data;
																	$scope.modalInstance
																			.close();
																});
											} else {

												todosService
														.postTodos($scope.data)
														.then(
																function(data) {
																	$scope.todosData = data;
																	$scope.modalInstance
																			.close();
																});
											}
										}
									} ],
						}
					});

	duMockApp.directive('objEdit', function($rootScope) {
		return {
			restrict : 'A',
			scope : {
				obj : '=obj'
			},
			link : function(scope, element, attrs) {
				element.text(JSON.stringify(scope.obj, undefined, 2));
				element.change(function(e) {
					scope.$apply(function() {
						scope.obj = JSON.parse(e.currentTarget.value);
					});
					$rootScope.$broadcast('myTodosEvent', scope.obj);
				})
			}
		}
	});
}());