module csComp.Services {

    export interface IButtonActionOptions {
        layer?: string;
        group?: string;
        property?: string;
        [key: string]: any;
    }

    export interface IButtonAction {
        /** Specifies button actions */
        [action: string]: (options: IButtonActionOptions) => void;
    }

    /**
     * The action service can be used to execute certain actions, e.g. when clicking a feature.
     * It comes with some predefined actions, and can be enhanced with other actions from your application.
     */
    export class ActionService {
        private actions: IButtonAction = {};

        public static $inject = [
            'layerService'
        ];

        constructor(private layerService: LayerService) {
            this.initDefaultActions();
        }

        /** Initialize the default actions. */
        private initDefaultActions() {
            this.actions['activate timerange'] = () => {
                console.log('Activate timerange action called');
                this.layerService.project.timeLine.start = new Date().getTime() - 1000 * 60 * 60 * 2;
                this.layerService.project.timeLine.end = new Date().getTime() + 1000 * 60 * 60 * 2;
                this.layerService.project.timeLine.focus = new Date().getTime();
            };

            this.actions['activate layer'] = options => {
                console.log('Activate layer action called');
                var pl = this.layerService.findLayer(options.layer);
                if (typeof pl === 'undefined') return;
                this.layerService.toggleLayer(pl);
            };

            this.actions['activate style'] = options => {
                console.log('Activate style action called');
                var group = this.layerService.findGroupById(options.group);
                if (typeof group === 'undefined') return;
                var propType = this.layerService.findPropertyTypeById(options.property);
                if (typeof propType === 'undefined') return;
                this.layerService.setGroupStyle(group, propType);
            };

            this.actions['activate baselayer'] = options => {
                console.log('Activate baselayer action called');
                var layer: BaseLayer = this.layerService.$mapService.getBaselayer(options.layer);
                this.layerService.activeMapRenderer.changeBaseLayer(layer);
                this.layerService.$mapService.changeBaseLayer(options.layer);
            };
        }

        /** Call an action by name (lowercase), optionally providing it with additional parameters. */
        public execute(actionTitle: string, options: IButtonActionOptions) {
            let action = actionTitle.toLowerCase();
            if (!this.actions.hasOwnProperty(action)) {
                console.log(`Warning: action ${actionTitle} is not defined!`);
                return;
            }
            this.actions[action](options);
        }

        /** Add your own action to the list of all actions. */
        public addAction(actionTitle: string, func: (options: IButtonActionOptions) => void) {
            if (this.actions.hasOwnProperty(actionTitle)) {
                console.log(`Warning: action ${actionTitle} is already defined!`);
                return;
            }
            this.actions[actionTitle.toLowerCase()] = func;
        }

        /** Return a copy of all the actions. */
        public getActions() {
            var copy: IButtonAction;
            ng.copy(this.actions, copy);
            return copy;
        }
    }

    /**
      * Register service
      */
    var moduleName = 'csComp';

    /**
      * Module
      */
    export var myModule;
    try {
        myModule = angular.module(moduleName);
    } catch (err) {
        // named module does not exist, so create one
        myModule = angular.module(moduleName, []);
    }

    myModule.service('actionService', csComp.Services.ActionService);
}
