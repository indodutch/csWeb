module csComp.Services {
    'use strict';

    export class SimulationService {
        static $inject = [
            '$http',
            '$q',
            'messageBusService'
        ];

        constructor(
            private $http: ng.IHttpService,
            private $q: ng.IQService,
            private $messageBusService: Services.MessageBusService
        ) {}

        public buildSimulationEngine(name: string, launcherURL: string, resultsURL: string): ng.IPromise<SimulationEngine> {
            var promise = this.$q.all([
                this.$http.get(launcherURL),
                this.$http.get(resultsURL)
            ]).then((results) => {
                var simLauncher = this.parseSimulationLauncher(launcherURL, results[0]['data']);
                var simResults = this.parseSimulationResults(results[1]['data']);
                return new SimulationEngine(name, simLauncher, simResults);
            });
            return promise;
        }

        private parseSimulationLauncher(url: string, data: Object): SimulationLauncher {
            var launcher = new SimulationLauncher(url, data['command']);
            data['parameters'].forEach((row: Object) => {
                var p = new SimulationLauncherParam(row);
                launcher.params.push(p);
            });
            return launcher;
        }

        private parseSimulationResults(data: Object): SimulationResult[] {
            var simResults = [];
            data['rows'].forEach((row: Object) => {
                var value = row['value'];
                var newSim = new SimulationResult(value['id'], value['input']['name'],
                                            value['url'], value['input']);
                simResults.push(newSim);
            });
            return simResults;
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
            // delete this.simulationResults[sim.id];
        }
    }

    // Register service following Johnpapa style. https://github.com/johnpapa/angular-styleguide#services
    angular
        .module('csComp')
        .service('simulationService', csComp.Services.SimulationService);
}
