module csComp.Services {
    'use strict';

    export class SimulationService {
        simulations: Simulation[] = [];

        static $inject = [
            '$http'
        ];

        constructor(
            private $http: ng.IHttpService
        ) {
            this.loadSimulations('http://localhost/couchdb/simcity/_design/matsim_0.3/_view/all_docs');
        }

        public loadSimulations(url: any): void {
            // load from http://localhost/couchdb/simcity/_design/matsim_0.3/_view/all_docs
            this.$http.get(url)
                .success((data: any) => {
                    this.parseSimCitySimulation(data);
                })
                .error((data, status) => {
                    console.log("Unable to load url: " + url);
                    console.log("          HTTP status: " + status);
                });
        }

        private parseSimCitySimulation(data: Object) {
            this.simulations = [];
            data['rows'].forEach((row: Object) => {
                var value = row['value'];
                var newSim = new Simulation(value['id'], value['input']['name'], value['url'], value['input']);
                this.simulations.push(newSim);
            });
        }
    }

    // Register service following Johnpapa style. https://github.com/johnpapa/angular-styleguide#services
    angular
        .module('csComp')
        .service('simulationService', csComp.Services.SimulationService);
}
