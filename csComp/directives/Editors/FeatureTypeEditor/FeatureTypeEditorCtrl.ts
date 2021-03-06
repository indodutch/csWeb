module FeatureTypeEditor {

    import IFeature = csComp.Services.IFeature;

    export interface IFeatureTypeEditorScope extends ng.IScope {
        vm: FeatureTypeEditorCtrl;
        data: IFeature;
        featureType: csComp.Services.IFeatureType;
        featureTypeId : string;
    }

    export class FeatureTypeEditorCtrl {
        private scope: IFeatureTypeEditorScope;

        public selectedResourceUrl: string;
        public selectedResource: csComp.Services.ITypesResource

        // $inject annotation.
        // It provides $injector with information about dependencies to be in  jected into constructor
        // it is better to have it close to the constructor, because the parameters must match in count and type.
        // See http://docs.angularjs.org/guide/di
        public static $inject = [
            '$scope',
            'layerService',
            'messageBusService'
        ];

        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        constructor(
            private $scope: IFeatureTypeEditorScope,
            private $layerService: csComp.Services.LayerService,
            private $messageBusService: csComp.Services.MessageBusService
            ) {
            this.$scope.vm = this;
            if ((<any>this.$scope.$parent.$parent).vm.hasOwnProperty('selectedFeatureType'))
            {
                $scope.featureType = (<any>this.$scope.$parent.$parent).vm.selectedFeatureType;
            } else if (this.$scope.$root.hasOwnProperty('data')) {
                $scope.featureType = (<any>$scope.$root).data;                
            }
            else {
                console.log('no feature type');
            }
        }

        /** force features to be updated */
        public updateFeatureTypes(ft: csComp.Services.IFeatureType) {
            if (!_.isUndefined(ft._resource)) this.$layerService.saveResource(ft._resource);
                        
            console.log('updating ..'); 
            this.$layerService.updateFeatureTypes(ft);            
        };
        
        /** apply updates to features, don't return or save back to api */ 
        public apply()
        {
            this.$layerService.updateFeatureTypes(this.$scope.featureType);            
        }
        
        public cancel()
        {
             this.$messageBusService.publish("featuretype","stopEditing");  
        }
        
         /** save a resource (back to api and update features) */
        public saveFeatureType() {
            if (!this.$scope.featureType._isInitialized) {
                this.$scope.featureType.id = this.$scope.featureType.name;
                this.$layerService.initFeatureType(this.$scope.featureType, null);
                this.$scope.featureType._resource.featureTypes[this.$scope.featureType.id] = this.$scope.featureType;
            }
            this.$layerService.saveResource(this.$scope.featureType._resource);
            this.$layerService.updateFeatureTypes(this.$scope.featureType);
            this.$messageBusService.publish("featuretype","stopEditing");            
        }


    }
}
