module csComp.Services {
    "use strict";

    export class SimulationService {
        static $inject = [
            "$http",
            "$q"
        ];

        constructor(
            private $http: ng.IHttpService,
            private $q: ng.IQService
        ) {
        }

        public buildSimulationEngine(name: string, launcherURL: string, resultsURL: string): ng.IPromise<SimulationEngine> {
            var promise = this.$q.all([
                this.$http.get(launcherURL),
                this.$http.get(resultsURL)
            ]).then((results) => {
                try {
                    var simLauncher = this.parseSimulationLauncher(results[0]["data"]);
                } catch(e) {
                    return this.$q.reject({data: "Unable to parse simulation launcher from: " + launcherURL});
                }
                try {
                    var simResults = this.parseSimulationResults(results[1]["data"]);
                } catch(e) {
                    return this.$q.reject({data: "Unable to parse simulation results from: " + resultsURL});
                }
                return new SimulationEngine(name, launcherURL, simLauncher, resultsURL, simResults);
            });
            return promise;
        }

        private parseSimulationLauncher(data: Object): SimulationLauncher {
            var launcher = new SimulationLauncher(data["command"]);
            data["parameters"].forEach((row: Object) => {
                var p = new SimulationLauncherParam(row);
                launcher.params.push(p);
            });
            return launcher;
        }

        private parseSimulationResults(data: Object): SimulationResult[] {
            var simResults = [];
            data["rows"].forEach((row: Object) => {
                var value = row["value"];
                var newSim = new SimulationResult(value["id"], value["input"]["name"],
                                            value["input"], value["url"]);
                simResults.push(newSim);
            });
            return simResults;
        }

        public loadSimulationResult(result: csComp.Services.SimulationResult): ng.IPromise<SimulationAttachment[]> {
            return this.$http.get(result.url)
                .then((response: any) => {
                    var attachments: SimulationAttachment[];
                    attachments = [];
                    var attachs = response["data"]["_attachments"];

                    Object.keys(attachs).forEach((name) => {
                        if("content_type" in attachs[name]) {
                            var newAttach = new SimulationAttachment(name, attachs[name]["content_type"]);
                            attachments.push(newAttach);
                        }
                    });
                    return attachments;
                });
        }
    }

    // Register service following Johnpapa style. https://github.com/johnpapa/angular-styleguide#services
    angular
        .module("csComp")
        .service("simulationService", csComp.Services.SimulationService);
}
