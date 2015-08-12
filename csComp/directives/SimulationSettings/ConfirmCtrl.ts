module SimulationSettings {
    export interface IConfirmCtrlScope extends ng.IScope {
        vm: ConfirmCtrl;
    }

    export class ConfirmCtrl {
        public static $inject = [
            '$scope',
            '$modalInstance',
            'simName'
        ];

        constructor(
            private $scope: IConfirmCtrlScope,
            private $modalInstance: ng.ui.bootstrap.IModalServiceInstance,
            private simName: string
        ) {
            $scope.vm = this;
        }

        public ok() {
            this.$modalInstance.close("done");
        }

        public cancel() {
            this.$modalInstance.dismiss("cancel");
        }
    }
}
