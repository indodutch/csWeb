module Simulations {
    function parameterInput($compile): ng.IDirective  {
        var directive = {
            terminal: true,    // do not compile any other internal directives
            restrict: "E",     // E = elements, other options are A=attributes and C=classes
            scope: {
                param: "="
            },
            templateUrl: "directives/Simulations/ParamInput.tpl.html",
            replace: true,    // Remove the directive from the DOM
            controller: ParamInputCtrl
        };
        return directive;
    }

    // Register directives following Johnpapa style. https://github.com/johnpapa/angular-styleguide#directives
    angular
        .module("csComp")
        .directive("simulationParameter", parameterInput);
}
