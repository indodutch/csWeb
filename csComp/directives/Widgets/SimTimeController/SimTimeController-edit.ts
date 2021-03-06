module SimTimeController {
    /**
      * Config
      */
    var moduleName = 'csComp';

    /**
      * Module
      */
    export var myModule;
    try {
        myModule = angular.module(moduleName);
    } catch (err) {
        // named module does not exist, so create one
        myModule = angular.module(moduleName, []);
    }

    /**
      * Directive to display the available map layers.
      */
    myModule.directive('simtimecontrollerEdit', [function() : ng.IDirective {
            return {
                restrict   : 'E',     // E = elements, other options are A=attributes and C=classes
                scope      : {
                },      // isolated scope, separated from parent. Is however empty, as this directive is self contained by using the messagebus.
                templateUrl: 'directives/Widgets/SimTimeController/SimTimeController-edit.tpl.html',
                replace      : true,    // Remove the directive from the DOM
                transclude   : false,   // Add elements and attributes to the template
                controller   : SimTimeControllerEditCtrl
            }
        }
    ]);
}
