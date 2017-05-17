'use strict';
module.exports = ['$q', '$http', '$rootScope',
    function($q, $http, $rootScope) {
        return {
            apiRequest: function apiRequest(ApiObj) {
                var deffered = $q.defer();
                $http({
                        method: ApiObj.method || 'GET',
                        url: ApiObj.url || '',
                        params: ApiObj.params || {},
                        data: ApiObj.data || {}
                    })
                    .then(function(data) {
                        // deffered.resolve(data);
                        if (data.status === 200) {
                            deffered.resolve(data);
                        } else {
                            deffered.reject(data);
                        }
                    }, function(error) {
                        deffered.reject(error);
                    });
                return deffered.promise;
            }
        };
    }
];
