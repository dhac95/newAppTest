(function () {

    'use strict';


    angular
         .module('ERP.service')
         .service('ApproveService', ApproveService);

         ApproveService.$inject = [];

    function ApproveService() {
        this.getRegisteredUsers = getRegisteredUsers;
        this.updateApprove = updateApprove;
        this.deleteApprove = deleteApprove;
       

        /////////////
        function updateApprove($scope, $rootScope, $http, Approve) {
            return $http.post($rootScope.endPoint + 'approve/' , Approve);
        }
        
        function deleteApprove($scope, $rootScope, $http, obj) {
            return $http.post($rootScope.endPoint + 'approve/reject/', obj);
        }

        function getRegisteredUsers($scope, $rootScope, $http, id) {
            return $http.get($rootScope.endPoint + 'loadTeam/registereduser/' + id);
        }

    }

})();