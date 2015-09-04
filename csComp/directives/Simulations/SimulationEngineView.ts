module Simulations {
    function simulationEngineView($compile): ng.IDirective  {
        var directive = {
            terminal: true,    // do not compile any other internal directives
            restrict: 'E',     // E = elements, other options are A=attributes and C=classes
            scope: {
                engine: '='
            },
            templateUrl: 'directives/Simulations/SimulationEngineView.tpl.html',
            replace: true,    // Remove the directive from the DOM
            controller: SimulationEngineViewCtrl
        };
        return directive;
    }

    // Register directives following Johnpapa style. https://github.com/johnpapa/angular-styleguide#directives
    angular
        .module('csComp')
        .directive('simulationEngineView', simulationEngineView);
}
