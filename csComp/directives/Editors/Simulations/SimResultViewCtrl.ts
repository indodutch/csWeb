module Simulations {
    export interface ISimResultViewScope extends ng.IScope {
        vm: SimResultViewCtrl;
    }

    export class SimResultViewCtrl {
        private scope: ISimResultViewScope;
        public simResult: csComp.Services.SimulationResult;

        public static $inject = [
            "$scope",
            "layerService"
        ];

        constructor(
                private $scope: ISimResultViewScope,
                private $layerService: csComp.Services.LayerService
            ) {
                $scope.vm = this;
                this.simResult = $scope.$parent["data"];
        }

        public display(attachment: csComp.Services.SimulationAttachment) {
            var attachURL = this.simResult.url + "/" + attachment.name;
            console.log("Should add layer: ");
            console.log("  > " + attachURL);
            console.log("  > but I don't know how to add a layer...");
            console.log("  > So I'm doing all this hacky stuff:");

            var layer = new csComp.Services.ProjectLayer();
            layer.type = "Geojson";
            layer.url = "http://localhost:3002" + attachURL;

            layer.group = new csComp.Services.ProjectGroup();
            this.$layerService.initGroup(layer.group);

            this.$layerService.addLayer(layer);
        }
    }
}
