/**
 * Created by skatkoori.
 */
(function() {
	'use strict';
	duMockApp.factory("restService", function($http, $log) {
		var getData = {};
		var postData = {};

		return {
			getData : function(url) {
				return $http({
					url : url,
					method : "GET"
				}).success(function(data) {
					getData = data;
				}).then(function() {
					return getData;
				});
			},
			postData : function(url, obj) { 
				return $http({
					url : url,
					method : "POST",
					data : obj
				}).success(function(data) {	
					postData = data;
				}).then(function() {
					return postData;
				});
			},
			putData : function(url, obj) {
				return $http({
					url : url,
					method : "PUT",
					data : obj
				}).success(function(data) {
					postData = data;
				}).then(function() {
					return postData;
				});
			},
			deleteData : function(url, obj) {
				
				alert(obj);
				return $http({
					url : url,
					method : "DELETE",
					data : obj
				}).success(function(data) {
					postData = data;
				}).then(function() {
					return postData;
				});
			},
			
			deleteAllData : function(url, obj) {
				
				alert(obj);
				return $http({
					url : url,
					method : "POST",
					data : obj
				}).success(function(data) {
					postData = data;
				}).then(function() {
					return postData;
				});
			},
			
		}
	});
}());
