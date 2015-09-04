module Simulations {
    export interface ISimulationEngineViewScope extends ng.IScope {
        vm: SimulationEngineViewCtrl;
        engine: csComp.Services.SimulationEngine;
    }

    export class SimulationEngineViewCtrl {
        public static $inject = [
            '$scope',
            '$modal'
        ];
        engine: csComp.Services.SimulationEngine;

        constructor(
                private $scope: ISimulationEngineViewScope,
                private $modal: ng.ui.bootstrap.IModalService
            ) {
                $scope.vm = this;
                this.engine = $scope.engine;
        }

        public configSimulationEngine(): void {
            console.log("Configure simulation engine...");
            console.log("  > get name");
            console.log("  > get launcher URL");
            console.log("  > get results URL");
        }

        public viewDetails(result: csComp.Services.SimulationResult): void {
            console.log(result);
        }

        public launchSimulation():void {
            console.log("Launching new simulation! =============");
            // console.log(this.$simulationService.simulationEngineView.params);
            console.log("=======================================");
        }
    }
}
