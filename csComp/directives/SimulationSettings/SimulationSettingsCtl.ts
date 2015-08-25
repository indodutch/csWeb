module SimulationSettings {
    export interface ISimulationSettingsScope extends ng.IScope {
        vm: SimulationSettingsCtrl;
    }

    export class SimulationSettingsCtrl {
        public static $inject = [
            '$scope',
            '$modal',
            'messageBusService',
            'simulationService'
        ];

        constructor(
                private $scope: ISimulationSettingsScope,
                private $modal: ng.ui.bootstrap.IModalService,
                private $messageBusService: csComp.Services.MessageBusService,
                private $simulationService: csComp.Services.SimulationService
            ) {
            $scope.vm = this;
        }

        public viewDetails(sim: csComp.Services.SimulationResult): void {
            var rpt = csComp.Helpers.createRightPanelTab('edit', 'simulationedit', sim, 'Edit simulation', 'Edit simulation');
            this.$messageBusService.publish('rightpanel', 'activate', rpt);
        }

        public delete(sim: csComp.Services.SimulationResult): void {
            var modalInstance = this.$modal.open({
                templateUrl: 'directives/SimulationSettings/Confirm.tpl.html',
                controller: ConfirmCtrl,
                resolve: {
                    simName: () => { return sim.name; }
                }
            });
            modalInstance.result.then(() => {
                // Modal was OK -- delete simulation
                this.$simulationService.delete(sim);
            });
        }

        private promptForURL(msg: string, url: string, callback: Function): void {
            var modalInstance = this.$modal.open({
                templateUrl: 'directives/SimulationSettings/GetURL.tpl.html',
                controller: GetURLCtrl,
                resolve: {
                    message: () => { return msg; },
                    url: () => { return url; }
                }
            });
            modalInstance.result.then((newURL: string) => {
                callback(newURL);
            });
        }

        public showNewSimulationConfig(): void {
            this.promptForURL('Enter simulation service URL', this.$simulationService.launcherURL,
                (url) => {
                    this.$simulationService.loadSimulationLauncher(url);
                });
        }

        public showResultsConfig(): void {
            this.promptForURL('Enter results URL', this.$simulationService.resultsURL,
                (url) => {
                    this.$simulationService.loadSimulationResults(url);
                });
        }

        public launchSimulation():void {
            console.log("Launching new simulation! =============");
            console.log("  URL   : " + this.$simulationService.resultsURL);
            console.log("  Params: ");
            console.log(this.$simulationService.simulationLauncher.params);
            console.log("=======================================");
        }
    }
}
