module csComp.Services {
    "use strict";

    export class SimulationEngine {
        id: string;
        name: string;
        launcherURL: string;
        launcher: SimulationLauncher;
        resultsURL: string;
        results: SimulationResult[];

        constructor(name: string, launcherURL: string, launcher: SimulationLauncher,
                    resultsURL: string, results: SimulationResult[]) {
            this.id = name.replace(" ", "_");
            this.name = name;
            this.launcherURL = launcherURL;
            this.launcher = launcher;
            this.resultsURL = resultsURL;
            this.results = results;
        }

        public static deserialize(input: Object): SimulationEngine {
            return new SimulationEngine(input["name"],
                input["launcherURL"], input["launcher"],
                input["resultsURL"], input["results"]);
        }
    }

    export class SimulationResult {
        id: string;
        name: string;
        params: { [name: string]: string; } = {};
        url: string;
        attachments: SimulationAttachment[];

        constructor(
            id: string,
            name: string,
            parameters: any,
            url: string
        ) {
            this.id = id;
            this.name = name;
            this.params = parameters;
            this.url = url;
        }
    }

    export class SimulationAttachment {
        name: string;
        contentType: string;

        constructor(name: string,contentType: string) {
            this.name = name;
            this.contentType = contentType;
        }

        public isVisible(): boolean {
            return this.contentType==="application/json";
        }

        public display(): void {
            console.log("Display " + this.name + " in layer...");
        }
    }

    export class SimulationLauncher {
        command: string;
        params: SimulationLauncherParam[];

        constructor(command: string) {
            this.command = command;
            this.params = [];
        }
    }

    export class SimulationLauncherParam {
        name: string;
        type: string;
        title: string;
        min_length: number;
        min: number;
        max: number;
        default: number;
        description: string;

        value: any; // Resulting value

        constructor(data: Object) {
            this.name = data["name"];
            this.type = data["type"];
            this.title = data["title"];
            this.min_length = ("min_length" in data) ? data["min_length"]:0;
            this.min = ("min" in data) ? data["min"]:0;
            this.max = ("max" in data) ? data["max"]:0;
            this.default = ("default" in data) ? data["default"]:0;
            this.description = ("description" in data) ? data["description"]:"";
        }
    }
}
