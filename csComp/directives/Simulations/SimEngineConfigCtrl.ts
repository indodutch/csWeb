module Simulations {
    export interface ISimEngineConfigScope extends ng.IScope {
        vm: SimEngineConfigCtrl;
    }

    export class SimEngineConfigCtrl {
        public static $inject = [
            "$scope",
            "$modalInstance",
            "name",
            "launcherURL",
            "resultsURL"
        ];

        constructor(
            private $scope: ISimEngineConfigScope,
            private $modalInstance: ng.ui.bootstrap.IModalServiceInstance,
            private name: string,
            private launcherURL: string,
            private resultsURL: string
        ) {
            $scope.vm = this;
        }

        public ok() {
            this.$modalInstance.close({
                name: this.name,
                launcherURL: this.launcherURL,
                resultsURL: this.resultsURL
            });
        }

        public cancel() {
            this.$modalInstance.dismiss("cancel");
        }
    }
}
