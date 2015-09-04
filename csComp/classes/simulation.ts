module csComp.Services {
    'use strict';

    export class SimulationEngine {
        name: string;
        launcher: SimulationLauncher;
        results: SimulationResult[];

        constructor(name: string, launcher: SimulationLauncher, results: SimulationResult[]) {
            this.name = name;
            this.launcher = launcher;
            this.results = results;
        }

        public static deserialize(input: Object): SimulationEngine {
            return new SimulationEngine(input["name"], input["launcher"], input["results"]);
        }
    }

    export class SimulationResult {
        id: string;
        name: string;
        url: string;
        params: { [name: string]: string; } = {};
        attachments: SimulationAttachment[];

        constructor(
            id: string,
            name: string,
            url: string,
            parameters: any
        ) {
            this.id = id;
            this.name = name;
            this.url = url;
            this.params = parameters;
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
            return this.contentType==='application/json';
        }

        public display(): void {
            console.log('Display ' + this.name + ' in layer...');
        }
    }

    export class SimulationLauncher {
        url: string;
        command: string;
        params: SimulationLauncherParam[];

        constructor(url: string, command: string) {
            this.url = url;
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
            this.name = data['name'];
            this.type = data['type'];
            this.title = data['title'];
            this.min_length = ('min_length' in data) ? data['min_length']:0;
            this.min = ('min' in data) ? data['min']:0;
            this.max = ('max' in data) ? data['max']:0;
            this.default = ('default' in data) ? data['default']:0;
            this.description = ('description' in data) ? data['description']:"";
        }
    }
}
