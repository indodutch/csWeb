module SimTimeController {
    export enum PlayState {
        Stopped,
        Playing,
        Paused
    }

    export enum SimCommand {
        Start,
        Pause,
        Stop,
        Run,
        Finish,
        Exit
    }

    export interface ISimTimeMessage {
        simTime: string;
        simSpeed: string;
        simCmd: string;
        type: string;
    }

    export interface ISimTimeControllerScope extends ng.IScope {
        vm: SimTimeControllerCtrl;
    }

    export class SimTimeControllerCtrl {
        private scope: ISimTimeControllerScope;
        private fsm: FSM.FiniteStateMachine<PlayState>;
        /** REST endpoint method */
        private httpMethod: string;
        /** REST endpoint */
        private url: string;
        private speed = 1;
        /** Start time, e.g. when restarting */
        private startTime = new Date();
        /** Current time */
        private time = this.startTime;
        private editorData: SimTimeControllerEditorData;

        // DateTimePicker
        private isOpen = false;
        private timeOptions = {
            readonlyInput: false,
            showMeridian: false
        };

        // For the view's status
        public isPlaying = false;
        public isPaused = false;
        public isStopped = true;

        // $inject annotation.
        // It provides $injector with information about dependencies to be in  jected into constructor
        // it is better to have it close to the constructor, because the parameters must match in count and type.
        // See http://docs.angularjs.org/guide/di
        public static $inject = [
            '$scope',
            '$http',
            'messageBusService',
            '$timeout'
        ];

        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        constructor(
            private $scope: ISimTimeControllerScope,
            private $http: ng.IHttpService,
            private messageBusService: csComp.Services.MessageBusService,
            private $timeout: ng.ITimeoutService
        ) {
            $scope.vm = this;

            var par = <any>$scope.$parent;
            this.editorData = <SimTimeControllerEditorData>par.widget.data;

            this.httpMethod = 'POST';
            if (this.editorData.hasOwnProperty('httpMethod') && this.editorData.httpMethod.hasOwnProperty('name'))
                this.httpMethod = this.editorData.httpMethod.name.toUpperCase();
            this.url = this.editorData.url || 'api/keys/simTime';

            this.fsm = new FSM.FiniteStateMachine<PlayState>(PlayState.Stopped);
            this.fsm.from(PlayState.Stopped).to(PlayState.Playing).on(SimCommand.Start);
            this.fsm.from(PlayState.Playing).to(PlayState.Stopped).on(SimCommand.Stop);
            this.fsm.from(PlayState.Playing).to(PlayState.Paused).on(SimCommand.Pause);
            this.fsm.from(PlayState.Paused).to(PlayState.Stopped).on(SimCommand.Stop);
            this.fsm.from(PlayState.Paused).to(PlayState.Playing).on(SimCommand.Start);

            this.fsm.onTransition = (fromState: PlayState, toState: PlayState) => {
                console.log(`Moving from ${PlayState[fromState]} to ${PlayState[toState]}.`)
            }

            this.fsm.onEnter(PlayState.Stopped, (from: PlayState) => {
                this.$timeout(() => {
                    this.isStopped = true;
                    this.isPlaying = false;
                    this.isPaused = false;
                }, 0);
                this.sendSimTimeMessage(SimCommand.Stop);
                return true;
            });

            this.fsm.onEnter(PlayState.Playing, (from: PlayState) => {
                this.$timeout(() => {
                    this.isPlaying = true;
                    this.isStopped = false;
                    this.isPaused = false;
                }, 0);
                this.sendSimTimeMessage(SimCommand.Start);
                return true;
            });

            this.fsm.onEnter(PlayState.Paused, (from: PlayState) => {
                this.$timeout(() => {
                    this.isPaused = true;
                    this.isStopped = false;
                    this.isPlaying = false;
                }, 0);
                this.sendSimTimeMessage(SimCommand.Pause);
                return true;
            });

            messageBusService.serverSubscribe('Sim.SimTime.', 'key', (title: string, data: any) => {
                console.log(`Server subscription received: ${title}, ${JSON.stringify(data, null, 2) }.`);
                if (!data
                    || !data.hasOwnProperty('data')
                    || !data.data.hasOwnProperty('keyId')
                    || !data.data.hasOwnProperty('item')
                    || !data.data.item
                    || data.data.keyId.indexOf('SimTime') < 0) return;
                this.$timeout(() => {
                    this.time = new Date(data.data.item);
                    messageBusService.publish('timeline', 'setFocus', this.time);
                    //console.log(`TIME: ${this.time} (input: ${JSON.stringify(data.data.item, null, 2)})`);
                }, 0);
            })

            // messageBusService.publish('timeline', 'setFocus', this.time);

            // messageBusService.subscribe('Sim', (action: string, data: any) => {
            //     console.log(`action: ${action}, data: ${JSON.stringify(data, null, 2) }`);
            // });
        }

        play() {
            this.fsm.trigger(SimCommand.Start);
        }

        pause() {
            this.fsm.trigger(SimCommand.Pause);
        }

        stop() {
            this.fsm.trigger(SimCommand.Stop);
        }

        increaseSpeed() {
            this.speed *= 2;
            this.speedChanged();
        }

        decreaseSpeed() {
            this.speed /= 2;
            this.speedChanged();
        }

        setSpeed(newSpeed: number) {
            this.speed = newSpeed;
            this.speedChanged();
        }

        setTime(newTime: number) {
            if (this.fsm.currentState !== PlayState.Stopped) return;
            this.startTime = this.time = new Date(newTime);
        }

        openCalendar(e: Event) {
            e.preventDefault();
            e.stopPropagation();

            this.isOpen = true;
        };

        private speedChanged() {
            if (this.fsm.currentState === PlayState.Playing) this.sendSimTimeMessage(SimCommand.Start);
        }

        private sendSimTimeMessage(cmd: SimCommand) {
            var msg: ISimTimeMessage = {
                simTime: this.time.valueOf().toString(),
                simSpeed: this.speed.toString(),
                simCmd: SimCommand[cmd],
                type: 'simTime'
            };

            switch (this.httpMethod) {
                case 'POST':
                    this.$http.post(this.url, msg)
                        .error((err) => alert("Failed to deliver message: " + JSON.stringify({ err: err })));
                    break;
                case 'PUT':
                    this.$http.put(this.url, msg)
                        .error((err) => alert("Failed to deliver message: " + JSON.stringify({ err: err })));
                    break;
            }
            //
            // this.$http.post( '/api/keys/simTime', msg)
            //     .error((err) => alert( "Failed to deliver message: " + JSON.stringify({err: err})));
        }

    }
}
