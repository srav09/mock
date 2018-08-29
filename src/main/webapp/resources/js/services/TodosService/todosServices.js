/**
 * Created by skatkoori.
 */
(function() {
	'use strict';
	duMockApp
			.factory(
					'todosService',
					[
							'restService',
							function(restService) {
								var getTodos = function() {
									return restService
										.getData("http://dux-services-dev.umuc.edu:8080/demo-0.0.1-SNAPSHOT/my/todos");
								};

								var postTodos = function(data) {
									return restService
											.postData(
													"http://dux-services-dev.umuc.edu:8080/demo-0.0.1-SNAPSHOT/my/editTodo", data);
								};
								
								var addTodos = function(data) {
									return restService
											.postData(
													"http://dux-services-dev.umuc.edu:8080/demo-0.0.1-SNAPSHOT/my/addTodos", data);
								};

								var deleteTodos = function(data) {
									return restService
										.postData("http://dux-services-dev.umuc.edu:8080/demo-0.0.1-SNAPSHOT/my/deleteTodo/" + data);
								};

								var deleteAllTodos = function(data) {
									return restService
											.postData(
													"http://dux-services-dev.umuc.edu:8080/demo-0.0.1-SNAPSHOT/my/deleteTodos", data);
								};

								return {
									getTodos : getTodos,
									postTodos : postTodos,
									deleteTodos : deleteTodos,
									deleteAllTodos : deleteAllTodos,
									addTodos:addTodos,
								}
							} ]);
}());
