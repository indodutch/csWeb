module csComp.Services {
    'use strict';

    export class SimulationService {
        simulationResults: { [id: string]: SimulationResult } = {};
        simulationLauncher: SimulationLauncher;
        resultsURL: string = '/couchdb/simcity/_design/matsim_0.3/_view/all_docs';
        launcherURL: string = '/explore/simulate/matsim/0.3';

        static $inject = [
            '$http',
            'messageBusService'
        ];

        constructor(
            private $http: ng.IHttpService,
            private $messageBusService: Services.MessageBusService
        ) {
            // TODO: remove hard coded URL's
            console.log('SimulationService: resultsURL and launcherURL are hard coded!' );
            this.loadSimulationResults(this.resultsURL);
            this.loadSimulationLauncher(this.launcherURL);
        }

        public loadSimulationLauncher(url: string): void {
            this.launcherURL = url;
            this.$http.get(url)
                .success((data: any) => {
                    this.parseSimulationLauncher(data);
                })
                .error((data, status,a,b) => {
                    this.$messageBusService.notify('ERROR loading simulation service', 'Loading:\n' + url + '\nHTTP status: ' + status);
                });
        }

        private parseSimulationLauncher(data: Object): void {
            // this.simulationService;
            console.log('Parse this: ');
            console.log(data);
            console.log();

            this.simulationLauncher = new SimulationLauncher(data['command']);
            data['parameters'].forEach((row: Object) => {
                console.log('  ' + row['name'] + ' ' + row['type']);
                var p = new SimulationLauncherParam(row);
                this.simulationLauncher.params.push(p);
            });
        }

        public loadSimulationResults(url: string): void {
            // load from http://localhost/couchdb/simcity/_design/matsim_0.3/_view/all_docs
            this.resultsURL = url;
            this.simulationResults = {};
            this.$http.get(url)
                .success((data: any) => {
                    this.parseSimCitySimulation(data);
                })
                .error((data, status,a,b) => {
                    this.$messageBusService.notify('ERROR loading simulation results', 'Loading:\n' + url + '\nHTTP status: ' + status);
                });
        }

        private parseSimCitySimulation(data: Object) {
            data['rows'].forEach((row: Object) => {
                var value = row['value'];
                var newSim = new SimulationResult(value['id'], value['input']['name'],
                                            value['url'], value['input']);
                this.simulationResults[value['id']] = newSim;
                this.loadSimulationAttachments(newSim);
            });
        }

        private loadSimulationAttachments(sim: SimulationResult) {
            this.$http.get(sim.url)
                .success((data: any) => {
                    this.parseSimulationAttachments(data, sim);
                })
                .error((data, status) => {
                    this.$messageBusService.notify('ERROR loading simulation attachments', 'Loading:\n' + sim.url + '\nHTTP status: ' + status);
                });
        }

        private parseSimulationAttachments(data: Object, sim: SimulationResult) {
            sim.attachments = [];
            var attachs = data['_attachments'];
            Object.keys(attachs).forEach((name) => {
                if('content_type' in attachs[name]) {
                    var newAttach = new SimulationAttachment(name, attachs[name]['content_type']);
                    sim.attachments.push(newAttach);
                }
            });
        }

        public delete(sim: SimulationResult): void {
            console.log('Should send request to url to actually delete');
            // this.$http.post(url,"delete sim.id").then(delete from view);
            delete this.simulationResults[sim.id];
        }
    }

    // Register service following Johnpapa style. https://github.com/johnpapa/angular-styleguide#services
    angular
        .module('csComp')
        .service('simulationService', csComp.Services.SimulationService);
}
