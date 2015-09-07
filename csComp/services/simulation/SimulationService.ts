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
        ) {}

        public buildSimulationEngine(name: string, launcherURL: string, resultsURL: string): ng.IPromise<SimulationEngine> {
            var promise = this.$q.all([
                this.$http.get(launcherURL),
                this.$http.get(resultsURL)
            ]).then((results) => {
                var simLauncher = this.parseSimulationLauncher(results[0]["data"]);
                var simResults = this.parseSimulationResults(results[1]["data"]);
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
                                            value["input"]);
                simResults.push(newSim);
            });
            return simResults;
        }

        public delete(sim: SimulationResult): void {
            console.log("Should send request to url to actually delete");
            // this.$http.post(url,"delete sim.id").then(delete from view);
            // delete this.simulationResults[sim.id];
        }
    }

    // Register service following Johnpapa style. https://github.com/johnpapa/angular-styleguide#services
    angular
        .module("csComp")
        .service("simulationService", csComp.Services.SimulationService);
}
