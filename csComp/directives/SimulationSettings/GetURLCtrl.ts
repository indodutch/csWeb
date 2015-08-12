module SimulationSettings {
    export interface IGetURLScope extends ng.IScope {
        vm: GetURLCtrl;
    }

    export class GetURLCtrl {
        public static $inject = [
            '$scope',
            '$modalInstance',
            'message',
            'url'
        ];

        constructor(
            private $scope: IGetURLScope,
            private $modalInstance: ng.ui.bootstrap.IModalServiceInstance,
            private message: string,
            private url: string
        ) {
            $scope.vm = this;
        }

        public ok() {
            this.$modalInstance.close(this.url);
        }

        public cancel() {
            this.$modalInstance.dismiss("cancel");
        }
    }
}
