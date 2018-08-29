var duMockApp = angular.module("duMockApp",
		[ "ngRoute", "ngResource", "ui.bootstrap", "smart-table"]).config(
		[ "$routeProvider", function($routeProvider) {
			return $routeProvider.when("/", {
				redirectTo : "/todos"
			}).when("/todos", {
				template : "<todos/>"
			}).when("/holds", { 
				template : "<holds/>"
			}).when("/accounts", {
				template : "<accounts/>"
			}).when("/grades", {
				template : "<grades/>"
			}).when("/classes", {
                template : "<classes/>"
            }).when("/incompletes", {
                template : "<incompletes/>"
            }).when("/profile", {
                template : "<profile/>"
            }).otherwise({
				redirectTo : "/"
			})
		} ]);

duMockApp.filter('prettyJSON', function() {
	function prettyPrintJson(json) {
		return JSON ? JSON.stringify(json, null, ' ')
				: 'your browser doesnt support JSON so cant pretty print';
	}
	return prettyPrintJson;
});

duMockApp.directive("mainMenu", function () {
    return {
        templateUrl: "views/menu.html"
    }
});