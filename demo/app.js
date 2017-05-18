var app = angular.module('floatingLabelApp', []);

app.controller('MainCtrl', function($scope) {
    $scope.user = {};
});

app.directive('withFloatingLabel', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function ($scope, $element, attrs, ctrl) {
            var placeholder = attrs.placeholder,
                isASelectElement = false,
                selectHasAPlaceholderOption = false;
            if ( 'SELECT' === $element[0].tagName ){
                isASelectElement = true;
                if( $element.val().toString().length < 1 ) {
                    angular.forEach(
                            $element.find('option'),
                            function(opt){
                                var option = angular.element(opt);
                                if ( option.val() == '' ) {
                                    if ( option.prop('disabled') || $scope.$eval( option.attr('ng-disabled') ) ) {
                                        placeholder = option.text();
                                        option.text('');
                                        selectHasAPlaceholderOption = true;
                                    }
                                }
                            }
                        );
                }
            }
            
            var template = '<div class="floating-label">' + placeholder +'</div>';
            
            //append floating label template
            $element.after(template);

            //remove placeholder
            $element.removeAttr('placeholder');

            //hide label tag assotiated with given input (if only they exist)
            var element = document.querySelector('label[for="' +  attrs.id +  '"]');
            if ( element )
                element.style.display = 'none';

            if ( !isASelectElement || selectHasAPlaceholderOption ) {
                $scope.$watch(
                    function () { return ctrl.$viewValue; },
                    function (newValue) {
                        if( angular.isUndefined(newValue) || (newValue.toString().length < 1) ) {
                            $element.addClass('empty');
                        } else {
                            $element.removeClass('empty');
                        }
                    }
                );
            } else {
                $element.removeClass('empty');
            }
        }
    };
});