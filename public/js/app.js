var app = angular.module("myApp", ["ngRoute", 'oitozero.ngSweetAlert']);

app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "list.html",
            controller: "listController"
        })
        .when("/add", {
            templateUrl: "productAdd.html",
            controller: "addController"
        })
        .when("/edit/:id", {
            templateUrl: "productEdit.html",
            controller: "editController"

        })
        .otherwise({redirectTo : "/"});
});


app.controller("listController", function ($scope, $http, $window, $timeout, $route, SweetAlert) {



    var messageDelTimer = false,
        displayDelDuration = 2000;
    $scope.showDelMessage = false;
    $scope.doDelGreeting = function () {
        if (messageDelTimer) {
            $timeout.cancel(messageDelTimer);
        }

        $scope.showDelMessage = true;

        messageDelTimer = $timeout(function () {
            $scope.showDelMessage = false;
        }, displayDelDuration);

    };

    $http.get("/records")
        .then(function (response) {
            $scope.myProducts = response.data;
        });



    $scope.productDelete = function (id) {


        SweetAlert.swal({
            title: "Are you sure?", //Bold text
            text: "This record will be deleted permenantly!", //light text
            type: "warning", //type -- adds appropiriate icon
            showCancelButton: true, // displays cancel btton
            confirmButtonColor: "rgb(255, 141, 0)",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: false, //do not close popup after click on confirm, usefull when you want to display a subsequent popup
            closeOnCancel: false
        },
            function (isConfirm) { //Function that triggers on user action.
                if (isConfirm) {
                    // console.log(isConfirm);
                    $http({
                        method: 'DELETE',
                        url: "/records/" + id,
                        data: {

                        },
                        headers: {
                            'Content-type': 'application/json;charset=utf-8'
                        }
                    })
                        .then(function (response) {
                            //console.log(response.data);
                            // $scope.doDelGreeting();
                            $route.reload();
                        }, function (rejection) {
                            console.log(rejection.data);
                        });
                    SweetAlert.swal("Deleted!");
                } else {
                    // console.log("Sorry!!!!");
                    SweetAlert.swal("Your record is safe!");
                }
            });


    };


});


app.controller("addController", function ($scope, $http, $window, $timeout) {
    $scope.product1 = {};
    var messageTimer = false,
        displayDuration = 2000;
    $scope.showMessage = false;
    $scope.doGreeting = function () {
        if (messageTimer) {
            $timeout.cancel(messageTimer);
        }

        $scope.showMessage = true;

        messageTimer = $timeout(function () {
            $scope.showMessage = false;
        }, displayDuration);
    };
    $scope.submitForm = function () {

        $http({
            url: "/records",
            method: "POST",
            data: $scope.product1
        })
            .then(function (response) {
                $scope.doGreeting();
            }, function (response) {
                alert("error");
            });
    };
});

app.controller("editController", function ($scope, $http, $routeParams, $window, $timeout) {
    $scope.myProduct = {};

    var messageTimer = false,
        displayDuration = 2000;
    $scope.showMessage = false;
    $scope.doGreeting = function () {
        if (messageTimer) {
            $timeout.cancel(messageTimer);
        }

        $scope.showMessage = true;

        messageTimer = $timeout(function () {
            $scope.showMessage = false;
        }, displayDuration);
    };


    $http({
        url: "/records/" + $routeParams.id,
        method: "GET"
    })
        .then(function (response) {
            $scope.myProduct = response.data;

        });





    $scope.sendItem = function (id) {

        $http({
            url: "/records/" + id,
            method: "PUT",
            data: $scope.myProduct
        })
            .then(function (response) {
                // alert("success");
                $scope.doGreeting();
            }, function (response) {
                alert("error");
            });
    };
});