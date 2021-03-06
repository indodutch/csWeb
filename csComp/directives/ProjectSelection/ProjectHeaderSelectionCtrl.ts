module ProjectHeaderSelection {
  export interface IProjectHeaderSelectionScope extends ng.IScope {
    vm: ProjectHeaderSelectionCtrl; //DashboardSelectionCtrl;
  }

  export class ProjectHeaderSelectionCtrl {
    public scope: any;
    public project: csComp.Services.SolutionProject;

    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    public static $inject = [
      '$scope',
      'layerService',
      'dashboardService',
      'mapService',
      'messageBusService'
    ];

    // dependencies are injected via AngularJS $injector
    // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
    constructor(
      private $scope: any,
      public $layerService: csComp.Services.LayerService,
      public $dashboardService: csComp.Services.DashboardService,
      private $mapService: csComp.Services.MapService,
      public $messageBusService: csComp.Services.MessageBusService
      ) {
        $scope.vm = this;
    }
  }
}
