import {Store, iState, view} from "../../../framework/Store";
import {iStoreHandler} from "../../../framework/StoreHandler";


interface currentTrack {
    id: number | null,
    length: number | null,
    image: string,
    bandName: string,
    trackName: string,
}

interface playerParams {
    currentTime:number,
    volume: number
}

export interface iStoreState extends iState {
    currentTrack: currentTrack,
    playerParams: playerParams,
    nowUpdating: boolean
}

const initialState: iStoreState = {
    currentTrack: {
    id: null,
    length: 0,
    image: '',
    bandName: '',
    trackName: '',
    },
    playerParams: {
        currentTime:0,
        volume: 80
        },
    nowUpdating: false
    };

const CHANGE_PLAYER_PARAM = 'CHANGE_PLAYER_PARAM';
const TOGGLE_LOADER = 'TOGGLE_LOADER';
const GET_TRACK = 'GET_TRACK';

/* handlers */
const handlers: iStoreHandler[] = [];

const changePlayerParamHandler: iStoreHandler = {
    name: CHANGE_PLAYER_PARAM,
    sync: true,
    handler: (data, state, done) => {
        done({playerParams: { [data.param]: data.value }})
    }
};

handlers.push(changePlayerParamHandler);

const toggleLoader: iStoreHandler = {
    name: TOGGLE_LOADER,
    sync: true,
    handler: (data, state, done) => {
        done({nowUpdating: !state.nowUpdating })
    }
};

handlers.push(toggleLoader);

const getTrackHandler: iStoreHandler = {
    name: GET_TRACK,
    sync: false,
    handler: (data, state, done) => {
        const currentTrackId = state.currentTrack.id;

        fetch('http://localhost:8080/api/player', {
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({currentTrackId})
        }).then(res=>res.json())
          .then(json => {
              if(json.status === 'ok') {
                done({ currentTrack: {...json.track}})
              }
          });
    }
};

handlers.push(getTrackHandler);

/* handlers end */

/* views */

const views:view[] = [];

/* todo check extended class */

/* Логгер в консоль */
const logger = (state:iState):void => {
   console.log(state);
};

views.push(logger);

/* Трек */
const trackView = (state:iState) => {
   const img: HTMLImageElement | null = document.querySelector('.track > img');
   if(img) {
       img.src = state.currentTrack.image || ''
   }
   const trackLengthElement: HTMLElement | null = document.querySelector('.track__time');
   if(trackLengthElement) {

       trackLengthElement.innerHTML = `${Math.floor(state.currentTrack.length/60)}:${Math.floor(state.currentTrack.length % 60)} `
   }
    const trackNameElem: HTMLElement | null = document.querySelector('.track__name');
   if(trackNameElem) {
       trackNameElem.innerText =  `${state.currentTrack.bandName} - ${state.currentTrack.trackName}`
   }

};
views.push(trackView);

/* Прелоадер */
const preloaderView = (state:iState)=> {
    const preloader: HTMLElement = document.getElementsByClassName('player__preloader')[0] as HTMLElement;
    if(state.nowUpdating) {
        preloader.style.display = 'block'
    } else {
        preloader.style.display = 'none'
    }
};

views.push(preloaderView);

/* Уровень звука */
const volume = (state: iState) => {
    const volumeLevel: HTMLElement = document.getElementsByClassName('volume__value')[0] as HTMLElement;
    volumeLevel.innerText = `${state.playerParams.volume}%`
};
views.push(volume);
/* views end*/


/* store init */

const musicCard:HTMLElement = document.getElementsByClassName('card--music')[0] as HTMLElement;

if(musicCard) {
    const preloader = document.createElement('div');
    preloader.style.display = 'none';
    preloader.classList.add('player__preloader');
    musicCard.prepend(preloader)
}

const store = new Store(initialState, handlers, views);
/* store end */

/* actions */
const changePlayerParamAction = (param:string, value:string) => store.dispatch({
    action_type: CHANGE_PLAYER_PARAM,
    data: {
        param,
        value
    }
});

const getTrackAction = () => store.multipleDispatch([
    {
        action_type: TOGGLE_LOADER
    },
    {
        action_type: GET_TRACK
    },
    {
        action_type: TOGGLE_LOADER
    }
]);

/* actions */



/* Code */
/*Получаем первый трек */
getTrackAction();

/* Слушатели на кнопках */
const trackControllers:NodeListOf<HTMLElement> = document.querySelectorAll('.track_control > img');
trackControllers.forEach(trackController=>{
   trackController.addEventListener('click', getTrackAction)
});
/* Инпуты */
const volumeRange: HTMLInputElement = document.getElementsByClassName('volume_range')[0] as HTMLInputElement;

if(volumeRange) {
    volumeRange.addEventListener('change', (e: Event)=> {
        const value = (<HTMLInputElement>e.target).value;
        changePlayerParamAction('volume', value)
    } )
}


