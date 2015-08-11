module csComp.Services {
    'use strict';

    // Move elsewhere ?
    export class Simulation {
        id: string;
        name: string;
        url: string;
        params: { [name: string]: string; } = {};

        constructor(id: string, name: string, url: string, parameters: any) {
            this.id = id;
            this.name = name;
            this.url = url;
            this.params = parameters;
        }
    }
}
