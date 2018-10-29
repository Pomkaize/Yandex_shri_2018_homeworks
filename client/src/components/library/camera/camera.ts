interface ContainerParams {
    left:number,
    top:number,
    width: number,
    height: number
}

interface TransformParams {
    scale: number
    translateX: number
    translateY: number
}

interface containerSize {
    calculated:boolean;
    generalContainer: ContainerParams
    videoContainer: ContainerParams
}

interface Constructable<T> {
    new() : T;
}

interface Window
{
    AudioContext: Constructable<AudioContext>;
    webkitAudioContext: Constructable<AudioContext>
}

interface InputRangeEvent extends Event {
    target: HTMLInputElement
}

class CameraController {
    animationLength: number;
    streamUrl: string;
    private animationStart: boolean;
    private readonly video: HTMLVideoElement;
    private readonly videoWrapper: HTMLElement;
    private readonly cardContainer: HTMLElement;
    private cardsContainer: HTMLElement;
    private readonly videoControllers: HTMLElement;
    private readonly brightController: Element;
    private readonly contrastController: Element;
    private readonly soundLevelController: HTMLElement;
    private readonly backButtonController: Element;
    private brightness: number;
    private contrast: number;
    private opened: boolean;
    private directionX!: 1|-1;
    private directionY!: 1|-1;
    private readonly hlsSupported: boolean;
    private containerSize:containerSize;
    private audioCtx!: AudioContext;
    private node!: ScriptProcessorNode;
    private analyser!: AnalyserNode;
    private bands!: Uint8Array;
    private source!: MediaElementAudioSourceNode;
    private timer!: null|any;
    private hls!: Hls;


    constructor(element:HTMLVideoElement, url:string) {

        /* videoState */
        this.streamUrl = url;
        this.animationLength = 250;
        this.animationStart = false;
        this.video = element;
        this.videoWrapper = this.video.parentElement as HTMLElement;
        if(!this.videoWrapper) {
            throw Error('Vide wrapper doesn`t exist');
        }
        this.cardContainer =  this.videoWrapper.parentElement as HTMLElement;
        this.cardsContainer = this.cardContainer.parentElement as HTMLElement;
        if(!this.cardContainer || !this.cardsContainer || !this.videoWrapper) {
            throw Error('Bad params');
        }
        this.videoControllers = this.videoWrapper.lastElementChild as HTMLElement;

        if(!this.videoControllers.firstElementChild || !this.videoControllers.lastElementChild) {
            throw Error('Bad videoControllers');
        }

        this.brightController = this.videoControllers.firstElementChild.children[0] as HTMLElement;
        this.contrastController = this.videoControllers.firstElementChild.children[1] as HTMLElement;
        this.soundLevelController = this.videoControllers.lastElementChild.children[0] as HTMLElement ;
        this.backButtonController = this.videoControllers.lastElementChild.children[1] as HTMLElement;
        this.brightness = 100;
        this.contrast = 100;
        this.opened = false;
        this.containerSize = {
            calculated: false,
            generalContainer: {
                top:0,
                left:0,
                width:0,
                height:0
            },
            videoContainer: {
                top:0,
                left:0,
                width:0,
                height:0
            }
        };
        this.hlsSupported = Hls.isSupported();

        this.init();
    }

    init():void {
        this.startStream(this.streamUrl);
        /* define directions for this.directionX and this.directionY */
        this.defineAnimationDirections();

        this.changeBrightness(this.brightness);

        if(this.video)
        {
            this.video.addEventListener('click', () => {
                if(this.opened) {
                    this.close();
                } else {
                    this.open();
                }
            });
            window.addEventListener("resize", this.onResize.bind(this), false);
        }

        if(this.brightController) {
            this.brightController.addEventListener('change', this.onBrightnessChange.bind(this));
        }
        if(this.contrastController) {
            this.contrastController.addEventListener('change', this.onContrastChange.bind(this));
        }
        if(this.backButtonController) {
            this.backButtonController.addEventListener('click', this.close.bind(this))
        }
    }

    initAudioAnalyser() {
            /* Audio context*/
            let AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioCtx = new AudioContext();
            this.node = this.audioCtx.createScriptProcessor(2048, 1, 1);

            /* Analyzer */
            this.analyser = this.audioCtx.createAnalyser();
            this.analyser.smoothingTimeConstant = 0.3;
            this.analyser.fftSize = 512;
            this.bands = new Uint8Array(this.analyser.frequencyBinCount);


            /* bindings */
            this.source = this.audioCtx.createMediaElementSource(this.video);
            this.source.connect(this.analyser);
            this.analyser.connect(this.node);
            this.node.connect(this.audioCtx.destination);
            this.source.connect(this.audioCtx.destination);

        /* writing sound data to array */
            this.node.onaudioprocess = () => {
                this.analyser.getByteFrequencyData(this.bands);
            }
    }

    toggleVisualizateSound():void {
        if(!this.timer) {
            this.timer = window.setInterval(()=> {
                let avgLevel:number = this.getAverageFromArray(this.bands);
                if(!this.soundLevelController) {
                    throw Error()
                } else {
                    this.soundLevelController.style.height = `${avgLevel + 20}px`;
                    this.soundLevelController.innerHTML = String(this.getAverageFromArray(this.bands));
                }

            }, 100);
        } else {
            clearInterval(this.timer);
            this.timer = null
        }
    }

    getAverageFromArray(arr:Uint8Array) {
        const sum:number = arr.reduce(function(a, b) { return a + b; });
        return sum > 0 ? Math.round(sum / arr.length) : 0;
    }

    startStream(url:string) {
        if (this.hlsSupported) {
            try {
            this.hls = new Hls();
            this.hls.loadSource(url);
            this.hls.attachMedia(this.video);
            this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
                this.video.play();
            });
            } catch (e) {
                console.log(e)
            }
        } else if (this.video.canPlayType('application/vnd.apple.mpegurl')) {
            this.video.src = url;
            this.video.addEventListener('loadedmetadata', () => {
                this.video.play();
            });
        }
    }
    /* get true/false */
    changeQualityStream(toQualityMax:boolean):void {
        if(this.hlsSupported) {
            try {
                let videoQualityLevels:Array<string> = Object.keys(this.hls.levels);
                if(toQualityMax) {
                    this.hls.nextLevel = Number(videoQualityLevels[videoQualityLevels.length - 1])
                }
                else {
                    this.hls.nextLevel = Number(videoQualityLevels[0])
                }
            } catch (e) {
                console.log(e)
            }

        }
    }

    open():void {
        if(!this.opened && !this.animationStart) {
            this.animationStart = true;
            /* set up translate */
            this.toggleTranslate();
            /* scale and translate css */
            this.setContainerTransform();
            /* add z-index class*/
            this.toggleOpenClassName();
            setTimeout(()=> {
               this.opened = true;
               this.animationStart = false;
               /* delete transition */
               this.toggleTranslate();
               this.toggleCameraControllers();
               this.changeQualityStream(true);
               !this.source ? this.initAudioAnalyser(): null;
               this.toggleVisualizateSound();
            }, this.animationLength)
        }
    }

    close():void {
        if(this.opened && !this.animationStart) {
            this.animationStart = true;
            this.videoWrapper.style.transform = null;
            /* set up translate */
            this.toggleTranslate();
            /* Camera controls*/
            this.toggleCameraControllers();
            /* clear visualization */
            this.toggleVisualizateSound();

            setTimeout(() => {
                /* set up z-index*/
                this.toggleOpenClassName();
                /* set up translate */
                this.toggleTranslate();
                /* up quality stream */
                this.changeQualityStream(false);
                this.opened = false;
                this.animationStart = false;
            }, this.animationLength);
        }
    }

    toggleCameraControllers():void {
        if(this.videoControllers.classList.contains('camera_controllers--opened')) {
            this.videoControllers.classList.remove('camera_controllers--opened')
        } else {
            this.videoControllers.classList.add('camera_controllers--opened')
        }
    }
    /*delete for preventing slow changes when resizing window*/
    toggleTranslate():void {
        if(this.videoWrapper.style.transition) {
            this.videoWrapper.style.transition = null
        } else {
            this.videoWrapper.style.transition = `transform  ${this.animationLength/1000}s ease-out`;
        }

    }

    toggleOpenClassName():void {
        if(this.videoWrapper.classList.contains('opened')) {
            this.videoWrapper.classList.remove('opened');
        } else {
            this.videoWrapper.classList.add('opened');
        }
    }

    setContainerTransform():void {
            let params = this._calculateTransformParams();
            this.videoWrapper.style.transform = 'scale(' + params.scale + ') translate(' + this.directionX*params.translateX + 'px,' + this.directionY*params.translateY + 'px)';
    }

    onResize():void {
        if(this.opened) {
            this.setContainerTransform();
        }
    }

    onBrightnessChange(e:InputRangeEvent):void {
            let value = Number(e.target.value)*2;
            this.changeBrightness(value);
    }
    changeBrightness(value:number):void {
        this.brightness = value;
        this.video.style.filter = `brightness(${value}%) contrast(${this.contrast}%)`
    }

    onContrastChange(e:InputRangeEvent):void {
        let value = Number(e.target.value)*2;
        this.changeContrast(value);
    }
    changeContrast(value:number):void {
        this.contrast = value;
        this.video.style.filter = `brightness(${this.brightness}%) contrast(${value}%)`
    }

    defineAnimationDirections():void {
        if(!this.containerSize.calculated) {
            this._calculateTransformParams();
        }

        const generalCenterX:number = this.containerSize.generalContainer.left + this.containerSize.generalContainer.width/2;
        const generalCenterY:number = this.containerSize.generalContainer.top + this.containerSize.generalContainer.height/2;

        const videoCenterX:number = this.containerSize.videoContainer.left + this.containerSize.videoContainer.width/2;
        const videoCenterY:number = this.containerSize.videoContainer.top + this.containerSize.videoContainer.height/2;

       this.directionX = videoCenterX > generalCenterX ? -1 : 1;
       this.directionY = videoCenterY > generalCenterY ? -1 : 1;

    }

    _calculateTransformParams():TransformParams {

        let domRectVideo:ClientRect = this.cardContainer.getBoundingClientRect(),
            domRectContainer:ClientRect = this.cardsContainer.getBoundingClientRect();

        let videoContainer:ContainerParams = {
            top: domRectVideo.top,
            left: domRectVideo.left,
            width: domRectVideo.width,
            height: domRectVideo.height
        };

        let generalContainer:ContainerParams = {
            top: domRectContainer.top,
            left: domRectContainer.left,
            width: domRectContainer.width,
            height: domRectContainer.height
        };

        this.containerSize = {
            calculated: true,
            videoContainer: videoContainer,
            generalContainer: generalContainer
        };

        const scale:number = Math.ceil(generalContainer.width/videoContainer.width*10)/10;

        return {
            scale: scale,
            translateX: Math.ceil(videoContainer.width * (scale - 1)/4 - Math.ceil((videoContainer.width*scale - generalContainer.width)/2)),
            translateY:  Math.ceil(videoContainer.height * (scale - 1)/4 - Math.ceil((videoContainer.height*scale - generalContainer.height)/2))
        }
    }
}

let cameras:NodeListOf<HTMLVideoElement> = document.querySelectorAll('.camera video');
let streams:Array<string> = [
    'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fsosed%2Fmaster.m3u8',
    'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fcat%2Fmaster.m3u8',
    'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fdog%2Fmaster.m3u8',
    'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fhall%2Fmaster.m3u8'
];

cameras.forEach((camera, index)=>new CameraController(camera, streams[index]));



