module SimulationEdit {
    export interface ISimulationEditScope extends ng.IScope {
        vm: SimulationEditCtrl;
    }

    export class SimulationEditCtrl {
        private scope: ISimulationEditScope;
        public simulation: csComp.Services.SimulationResult;

        public static $inject = [
            '$scope',
        ];

        constructor(
                private $scope: ISimulationEditScope
            ) {
                $scope.vm = this;
                this.simulation = $scope.$parent["data"];
        }
    }
}
