import {cn} from "@bem-react/classname";
import React from "react";
import {Image} from "../Image/Image";
import "./Player.scss";

interface iPlayerProps {
    artist: string,
    track: Track,
    volume: string
}

interface Track {
   name: string;
   length: string
}

const cnPlayer = cn('Player');
const cnTrack = cn('Track');
const cnController = cn('Controller');

export const Player: React.FunctionComponent<iPlayerProps> = (props) => {
    return <div className={cnPlayer()}>
                <div className={cnPlayer("Track", ['Track'])}>
                    <Image imageName="album-cover" ext="png" className={cnTrack('Image')}/>
                    <div className={cnTrack('Info')}>
                        <div className={cnTrack('Name')}>
                            {`${props.artist} - ${props.track.name}`}
                        </div>
                        <div className={cnTrack('Timeline')}>
                            <input type="range" className={cnTrack('TimelineRange')} />
                            <div className={cnTrack('Length')}>{props.track.length}</div>
                        </div>
                    </div>
                </div>
                <div className={cnPlayer('Controllers', ["Controllers"])}>
                    <div className={cnController(null, ['Controller-Left'])}>
                        <Image imageName="Prev" className={cnController("Image")} ext="svg"/>
                    </div>
                    <div className={cnController(null, ['Controller-Right'])}>
                        <Image imageName="Prev" className={cnController("Image")} ext="svg"/>
                    </div>
                    <div className={cnController('Volume')}>
                        <input type="range" className={cnController('VolumeRange')}/>
                        <div className={cnController('VolumeValue')}>{props.volume}</div>
                    </div>
                </div>
           </div>
};