module Simulations {
    export interface ISimulationListScope extends ng.IScope {
        vm: SimulationListCtrl;
    }

    export class SimulationListCtrl {
        public static $inject = [
            "$scope",
            "simulationService"
        ];

        public engines = [ ];

        constructor(
                private $scope: ISimulationListScope,
                private $simulationService: csComp.Services.SimulationService
            ) {
                $scope.vm = this;
                this.addSimulationLauncher(
                    "Engine1",
                    "http://localhost:3002/explore/simulate/matsim/0.3",
                    "http://localhost:3002/couchdb/simcity/_design/matsim_0.3/_view/all_docs"
                );
                this.addSimulationLauncher(
                    "Engine2",
                    "http://localhost:3002/explore/simulate/matsim/0.4",
                    "http://localhost:3002/couchdb/simcity/_design/matsim_0.4/_view/all_docs"
                );
        }

        public addSimulationLauncher(name: string, launcherURL: string, resultsURL: string) {
            this.$simulationService.buildSimulationEngine(name, launcherURL, resultsURL)
                .then(
                    (engine: csComp.Services.SimulationEngine) => {
                        this.engines.push(engine);
                    }
                );
        }
    }
}
