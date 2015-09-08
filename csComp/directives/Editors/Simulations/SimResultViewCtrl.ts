module Simulations {
    export interface ISimResultViewScope extends ng.IScope {
        vm: SimResultViewCtrl;
    }

    export class SimResultViewCtrl {
        private scope: ISimResultViewScope;
        public simResult: csComp.Services.SimulationResult;

        public static $inject = [
            "$scope",
        ];

        constructor(
                private $scope: ISimResultViewScope
            ) {
                $scope.vm = this;
                this.simResult = $scope.$parent["data"];
        }
    }
}
