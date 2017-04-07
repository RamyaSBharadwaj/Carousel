angular.module('app', ['ui.bootstrap', 'ui.bootstrap.tpls']);

angular.module('app').controller('CarouselController', function($scope) {
    $scope.active = 0;
    var slides = $scope.slides = [];
    var currIndex = 0;

    function chunk(arr, size) {
        var newArr = [];
        var arrayLength = arr.length;
        for (var i = 0; i < arrayLength; i += size) {
            newArr.push(arr.slice(i, i + size));
        }
        return newArr;
    }

    $scope.addSlide = function() {
        var newWidth = 200 + slides.length + 1;
        slides.push({
            image: 'http://lorempixel.com/' + newWidth + '/200',
        });
    };

    for (var i = 0; i < 10; i++) {
        $scope.addSlide();
    }

    $scope.chunkSize = 5;


    $scope.chunkedSlides = chunk($scope.slides, $scope.chunkSize);

    $scope.$on('change-chunk-size', function(event, data) {
        console.log('new chunk size: ' + data);
        if (data !== $scope.chunkSize) {
            $scope.chunkedSlides = chunk($scope.slides, data);
            $scope.chunkSize = data;
        }
    });

    var classMap = {
        5: 'col-sm-2',
        4: 'col-sm-3',
        3: 'col-sm-4',
        2: 'col-sm-5',
    };

    $scope.getSlideClass = function(chunkSize) {
        if (classMap[chunkSize]) {
            return classMap[chunkSize];
        } else {
            return 'col-sm-10';
        }
    }
});

angular.module('app').directive('smartChunking', function($window, SmartChunking) {
    return {
        restrict: 'A',
        link: function($scope) {
            var w = angular.element($window);


            var width = ($window.outerWidth > 0) ? $window.outerWidth : screen.height;
            var chunkSize = SmartChunking.getChunkSize(width);
            if (chunkSize !== 5) {
                $scope.$emit('change-chunk-size', chunkSize);
            }

            $scope.getWidth = function() {
                return ($window.outerWidth > 0) ? $window.outerWidth : screen.width;
            };

            $scope.$watch($scope.getWidth, function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    var chunkSize = SmartChunking.getChunkSize(newValue);
                    $scope.$emit('change-chunk-size', chunkSize);
                }
            });

            w.bind('resize', function() {
                $scope.$apply();
            });
        }
    }
});

angular.module('app').service('SmartChunking', function() {
    var large = 1600;
    var medium = 1200;
    var small = 1024;
    var xsmall = 800;

    this.getChunkSize = function(width) {
        var chunkSize;
        if (width >= large) {
            chunkSize = 5;
        } else if (width >= medium) {
            chunkSize = 4;
        } else if (width >= small) {
            chunkSize = 3;
        } else if (width >= xsmall) {
            chunkSize = 2;
        } else {
            chunkSize = 1;
        }
        return chunkSize;
    }
});