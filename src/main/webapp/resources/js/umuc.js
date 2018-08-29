// ensure page is not loaded from cache when using the back button
// especially important if the user is hitting "Back" from the
// sso logout page.
window.onpageshow = function(event) {
	if (event.persisted) {
		window.location.reload()
	}
};
// ensure no conflicts with use of $
$.noConflict();

(function() {
	'use strict';
	angular
			.module('umuc', [ 'ngResource', 'ngRoute', 'appServices' ])

			.config(
					[
							'$resourceProvider',
							'$httpProvider',
							'$routeProvider',
							'$compileProvider',
							'environmentProviderProvider',
							function($resourceProvider, $httpProvider,
									$routeProvider, $compileProvider,
									environmentProviderProvider) {
								var envVars = environmentProviderProvider
										.$get().getEnvironmentVariables();
								// turn off debugging if this isn't a development environment
								if (envVars.arrDevEnvironments
										.indexOf(envVars.domain) == -1)
									$compileProvider.debugInfoEnabled(false);

								// by default, angular strips trailing slashes
								// setting this to false will honor the trailing slash
								// if it is explicitly included
								$resourceProvider.defaults.stripTrailingSlashes = false;
								$httpProvider.defaults.withCredentials = true;
								$httpProvider.interceptors
										.push([
												'$q',
												'$rootScope',
												function($q, $rootScope) {
													return {
														'response' : function(
																response) {
															return response;
														},
														'responseError' : function(
																rejection) {
															// add some data to resource to get back to module
															$rootScope
																	.errorHandler(rejection);
															return $q
																	.reject(rejection);
														}
													};
												} ]);
							} ])

			.run(
					[
							'$rootScope',
							'environmentProvider',
							'authFactory',
							'psStatusFactory',
							function($rootScope, environmentProvider,
									authFactory, psStatusFactory) {
								var envVars = environmentProvider
										.getEnvironmentVariables(), logoutDomain = '';
								if (envVars.arrDevEnvironments
										.indexOf(envVars.domain) > -1)
									logoutDomain = 'https://campus-dev.umuc.edu';
								else if (envVars.arrQAEnvironments
										.indexOf(envVars.domain) > -1)
									logoutDomain = 'https://campus-qa.umuc.edu';
								else
									logoutDomain = 'https://campus.umuc.edu';

								$rootScope.settings = {
									currentYear : new Date().getFullYear()
								};

								$rootScope.umucAppStatus = {
									loadingMessage : ' Initializing',
									loading : true,
									appError : false
								};

								$rootScope.urls = {
									studentCenter : 'https://'
											+ envVars.peopleSoftDomain.domain
											+ '/psp/'
											+ envVars.peopleSoftDomain.pointer
											+ '/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES.SSS_STUDENT_CENTER.GBL?FolderPath='
											+ 'PORTAL_ROOT_OBJECT.UC_SA_SSS_STUDENT_CENTER&IsFolder=false&IgnoreParamTempl='
											+ 'FolderPath%2cIsFolder',
									login : 'https://' + envVars.ssoDomain
											+ '/cas/login?method=POST&service=',
									logout : logoutDomain
											+ '/Shibboleth.sso/Logout'
								};

								// Put full value URLs into array, e.g., for comparison
								// in the error handler when an HTTP call returns an error.
								$rootScope.errorHandler = function(error) {
									if (error.status === 403) {
										// hopefully complete logout will be implemented transparently via the /auth endpoint.
										authFactory
												.login($rootScope.urls.login);
										return false;
									}
									if (error.status === 404) {
										// check if 404 is OK for any requests
										if (error.config.url
												.indexOf('educationcenter') > -1
												|| error.config.url
														.indexOf('dutystation') > -1)
											return false;
									}
									if (error.status >= 400
											&& error.status !== 400) {
										$rootScope.umucAppStatus.appError = true;
										$rootScope.umucAppStatus.loading = false;
										$rootScope.umucAppStatus.loadingMessage = '';
									}
								}

								// check if data layer is down for scheduled maintenance
								psStatusFactory.get({
									url : envVars.dataCheckDomain
											+ 'forms/data-check/'
								}).$promise
										.then(function(data) {
											if (data.psStatus == 'available') {
												$rootScope.umucAppStatus.loading = false;
												$rootScope.umucAppStatus.loadingMessage = '';
												$rootScope
														.$broadcast('psStatus::available');
											} else
												$rootScope.umucAppStatus.appError = true;
										});
							} ])
})();