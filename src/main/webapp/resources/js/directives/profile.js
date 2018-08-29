/**
 * Created by skatkoori.
 */
(function() {
    'use strict';
    duMockApp
            .directive(
                    'profile',
                    function($compile) {
                        return {
                            replace : true,
                            restrict : 'E',
                            templateUrl : 'views/profile/profile.html',
                            link : function(scope, element, attr) {
                            },
                            controllerAs : 'profileCtrl',
                            controller : [
                                    '$scope',
                                    '$log',
                                    'profileService',
                                    '$uibModal',
                                    '$timeout',
                                    'restService',
                                    function($scope, $log, profileService,
                                            $uibModal, $timeout, restService) {
                                        $scope.profileValue = "";
                                        $scope.selectedCheckBoxes = [];
                                        $scope.addData = false;
                                        
                                        //service calling get profile data
                                        profileService
                                                .getProfile()
                                                .then(
                                                        function(data) {
                                                                $scope.myProfile = !$scope.myProfile;
                                                                $scope.profileData = data;
                                                                /*console.log(JSON.stringify($scope.profileData));*/
                                                                if(Object.keys(data).length === 0){
                                                                    $scope.addData = true;
                                                                    $scope.profileData = " Add New Data";
                                                                }
                                                        });

                                        $scope.showButton = function(data){
                                            if($scope.profileData == " Add New Data"){
                                                return false;
                                            }
                                            return true;
                                        }


                                        //Pop up Modal display Detail Page              
                                        $scope.profileLinkClicked = function(data) {
                                            $scope.profileValue = data;
                                            $scope.index = data;
                                            $scope.modalInstance = $uibModal
                                                    .open({
                                                        templateUrl : 'views/profile/profileDetail/profileDetail.html',
                                                        scope: $scope,
                                                        controllerAs : 'profileDetailCtrl',
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

                                        //selected ,unselected check box TempIds to delete the profile
                                        $scope.selecteProfileTempIds = [];
                                        $scope.selectedProfile = function(profile) {
                                            if(profile.check) {
                                                $scope.selecteProfileTempIds.push({tempId : profile.tempId});
                                                }
                                            else {
                                                var removeIndex = $scope.selecteProfileTempIds.findIndex(function (i){
                                                     i.tempId==profile.tempId
                                                });
                                                $scope.selecteProfileTempIds.splice(removeIndex, 1);
                                            }
                                        }

                                        //select all and  un select all check boxes                                         
                                        $scope.selectAll=false;
                                        $scope.selectAllProfile = function() {
                                            $scope.selecteProfileTempIds = [];
                                            
                                            if ($scope.selectAll == true) {
                                                
                                        angular.forEach($scope.profileData,function(profile) {
                                                            profile.check = true;
                                                            $scope.selecteProfileTempIds.push({tempId : profile.tempId});
                                                        });
                                                  
                                            } else if ($scope.selectAll == false) {
                                                angular.forEach(
                                                        $scope.profileData,
                                                        function(item) {
                                                            item.check = false;
                                                        });
                                                $scope.selecteProfileTempIds = [];
                                            }
                                            
                                        }                                       
                                        
                                       //delete all profile by using selecteProfileTempIds
                                            $scope.deleteAllProfile = function() {
                                                profileService.deleteAllprofile(
                                                        $scope.selecteProfileTempIds).then(
                                                        function(data) {
                                                            $scope.profileData = data;
                                                        });
                                            }

                                            // single profile deletion using only the particular TempId
                                            $scope.deleteProfile = function(tempId) {
                                                profileService
                                                        .deleteProfile(tempId)
                                                        .then(function(data) {
                                                            $scope.profileData = data;
                                                            if(Object.keys(data).length <= 0){
                                                                $scope.addData = true;
                                                                $scope.profileData = " Add New Data";
                                                            }

                                                        });
                                            }

                                            
                                            $scope.$on('myProfile', function(event,
                                                    data) {
                                                $scope.profileValue = data;
                                            });

                                            //Edit and save single profile // creating a copy of profileValue with out effecting in array
                                            $scope.saveProfile = function() {
                                                $scope.data = angular
                                                        .copy($scope.profileValue);
                                                
                                                if($scope.index == undefined){
                                                        profileService
                                                            .addProfile($scope.data)
                                                            .then(
                                                                    function(data) {
                                                                        $scope.profileData = data;
                                                                        if(Object.keys(data).length > 0){
                                                                            $scope.addData = false;
                                                                        }
                                                                        $scope.modalInstance
                                                                                .close();
                                                                    });
                                                   }
                                                else {
                                                    profileService
                                                    .postProfile($scope.data)
                                                    .then(
                                                            function(data) {
                                                                $scope.profileData = data;
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

// stringify the text and sent the user edit text values to controller ,It will trigger at the time of user editing the text                                                            
    duMockApp.directive('profileEdit', function($rootScope) {
        return {
            restrict : 'A',
            scope : {
                profile : '=profile'
            },
            link : function(scope, element, attrs) {
                element.text(JSON.stringify(scope.profile, undefined, 2));
                element.change(function(e) {
                    scope.$apply(function() {
                        scope.profile = JSON.parse(e.currentTarget.value);
                    });
                    $rootScope.$broadcast('myProfile', scope.profile);
                })
            }
        }
    });
}());