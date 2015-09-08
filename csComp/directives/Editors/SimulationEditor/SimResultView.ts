module Simulations {
    function simResultView($compile): ng.IDirective  {
        var directive = {
            terminal: true,    // do not compile any other internal directives
            restrict: "E",     // E = elements, other options are A=attributes and C=classes
            scope: {},      // isolated scope, separated from parent. Is however empty, as this directive is self contained by using the messagebus.
            templateUrl: "directives/Editors/Simulations/SimResultView.tpl.html",
            replace: true,    // Remove the directive from the DOM
            controller: SimResultViewCtrl
        };
        return directive;
    }

    // Register directives following Johnpapa style. https://github.com/johnpapa/angular-styleguide#directives
    angular
        .module("csComp")
        .directive("simresultview", simResultView);
}
