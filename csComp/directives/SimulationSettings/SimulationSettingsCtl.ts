module SimulationSettings {
    export interface ISimulationSettingsScope extends ng.IScope {
        vm: SimulationSettingsCtrl;
    }

    export class SimulationSettingsCtrl {
        public static $inject = [
            '$scope',
            'messageBusService',
            'simulationService'
        ];

        constructor(
                private $scope: ISimulationSettingsScope,
                private $messageBusService: csComp.Services.MessageBusService,
                private $simulationService: csComp.Services.SimulationService
            ) {
            $scope.vm = this;
        }

        public viewDetails(sim: csComp.Services.Simulation): void {
            var rpt = csComp.Helpers.createRightPanelTab('edit', 'simulationedit', sim, 'Edit simulation', 'Edit simulation');
            this.$messageBusService.publish('rightpanel', 'activate', rpt);
        }
    }
}
