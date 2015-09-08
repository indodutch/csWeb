module Simulations {
    export interface ISimulationEngineViewScope extends ng.IScope {
        vm: SimulationEngineViewCtrl;
        engine: csComp.Services.SimulationEngine;
    }

    export class SimulationEngineViewCtrl {
        public static $inject = [
            "$scope",
            "$modal",
            "simulationService",
            "messageBusService"
        ];
        engine: csComp.Services.SimulationEngine;

        constructor(
                private $scope: ISimulationEngineViewScope,
                private $modal: ng.ui.bootstrap.IModalService,
                private $simulationService: csComp.Services.SimulationService,
                private $messageBusService: csComp.Services.MessageBusService
            ) {
                $scope.vm = this;
                this.engine = $scope.engine;
        }

        public configSimulationEngine(): void {
            var modalInstance = this.$modal.open({
                templateUrl: "directives/Simulations/SimEngineConfig.tpl.html",
                controller: Simulations.SimEngineConfigCtrl,
                resolve: {
                    name: () => { return this.engine.name; },
                    launcherURL: () => { return this.engine.launcherURL; },
                    resultsURL: () => { return this.engine.resultsURL; }
                }
            });
            modalInstance.result.then((data: any) => {
                if(data["launcherURL"]!=this.engine.launcherURL || data["resultsURL"]!=this.engine.resultsURL) {
                    this.$simulationService.buildSimulationEngine(data["name"],
                            data["launcherURL"], data["resultsURL"])
                        .then((engine: csComp.Services.SimulationEngine) => {
                            this.engine = engine;
                        }).catch((reason) => {
                            this.$messageBusService.notify("ERROR building simulation engine: " + name,
                                reason["data"] + "\nEngine not updated");
                        });
                }
            });
        }

        public viewDetails(result: csComp.Services.SimulationResult): void {
            this.$simulationService.loadSimulationResult(result)
                .then((data: any) => {
                    result.attachments = data;

                    var rpt = csComp.Helpers.createRightPanelTab("edit", "simresultview", result, "View simulation result");
                    this.$messageBusService.publish("rightpanel", "activate", rpt);

                }).catch((reason) => {
                    this.$messageBusService.notify("ERROR loading simulation results: " + result.name,
                        reason["data"]);
                });
        }

        public launchSimulation():void {
            console.log("Launching new simulation! =============");
            // console.log(this.$simulationService.simulationEngineView.params);
            console.log("=======================================");
        }
    }
}
