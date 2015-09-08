module Simulations {
    export interface ISimulationListScope extends ng.IScope {
        vm: SimulationListCtrl;
    }

    export class SimulationListCtrl {
        public static $inject = [
            "$scope",
            "$modal",
            "simulationService",
            "messageBusService"
        ];

        public engines = [ ];

        constructor(
                private $scope: ISimulationListScope,
                private $modal: ng.ui.bootstrap.IModalService,
                private $simulationService: csComp.Services.SimulationService,
                private $messageBusService: csComp.Services.MessageBusService
            ) {
                $scope.vm = this;

                console.log("SimulationList: simulation launchers hard coded...");
                this.addSimulationEngine(
                    "Engine1",
                    "http://localhost:3002/explore/simulate/matsim/0.3",
                    "http://localhost:3002/couchdb/simcity/_design/matsim_0.3/_view/all_docs"
                );
                this.addSimulationEngine(
                    "Engine2",
                    "http://localhost:3002/explore/simulate/matsim/0.4",
                    "http://localhost:3002/couchdb/simcity/_design/matsim_0.4/_view/all_docs"
                );
        }

        public addSimulationEngine(name: string, launcherURL: string, resultsURL: string) {
            this.$simulationService.buildSimulationEngine(name, launcherURL, resultsURL)
                .then(
                    (engine: csComp.Services.SimulationEngine) => {
                        this.engines.push(engine);
                    }
                ).catch((reason) => {
                    this.$messageBusService.notify("ERROR building simulation engine: " + name, reason["data"]);
                });
        }

        public addNewSimulationEngine(): void {
            var modalInstance = this.$modal.open({
                templateUrl: "directives/Simulations/SimEngineConfig.tpl.html",
                controller: Simulations.SimEngineConfigCtrl,
                resolve: {
                    name: () => { return ""; },
                    launcherURL: () => { return ""; },
                    resultsURL: () => { return ""; },
                }
            });
            modalInstance.result.then((data: any) => {
                this.addSimulationEngine(data["name"], data["launcherURL"], data["resultsURL"]);
            });
        }
    }
}
