module Simulations {
    export interface IParamInputCtrlScope extends ng.IScope {
        vm: ParamInputCtrl;
        param: csComp.Services.SimulationLauncherParam;
    }

    /**
     * Directive controller for simulation parameter input.
     */
    export class ParamInputCtrl {
        public static $inject = [
            "$scope"
        ];
        parameter: csComp.Services.SimulationLauncherParam;

        constructor(private $scope: IParamInputCtrlScope) {
            $scope.vm = this;
            this.parameter = $scope.param;
        }
    }
}
