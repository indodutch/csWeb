module csComp.Services {
    'use strict';

    export class SimulationService {
        simulations: { [id: string]: Simulation } = {};
        resultsURL: string = 'http://localhost/couchdb/simcity/_design/matsim_0.3/_view/all_docs';
        serviceURL: string = 'http://localhost/explore/simulate/matsim/0.3';

        static $inject = [
            '$http'
        ];

        constructor(
            private $http: ng.IHttpService
        ) {
            this.loadSimulationResults(this.resultsURL);
        }

        public loadSimulationService(url: string): void {
            this.serviceURL = url;
            console.log('Load simulation parameters from');
        }

        public loadSimulationResults(url: string): void {
            // load from http://localhost/couchdb/simcity/_design/matsim_0.3/_view/all_docs
            this.resultsURL = url;
            this.simulations = {};
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
            data['rows'].forEach((row: Object) => {
                var value = row['value'];
                var newSim = new Simulation(value['id'], value['input']['name'], value['url'], value['input']);
                this.simulations[value['id']] = newSim;
            });
        }

        public delete(sim: Simulation): void {
            console.log('Should send request to url to actually delete');
            // this.$http.post(url,"delete sim.id").then(delete from view);
            delete this.simulations[sim.id];
        }
    }

    // Register service following Johnpapa style. https://github.com/johnpapa/angular-styleguide#services
    angular
        .module('csComp')
        .service('simulationService', csComp.Services.SimulationService);
}
