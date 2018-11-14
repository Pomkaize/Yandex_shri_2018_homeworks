import * as React from "react";
import {cn} from "@bem-react/classname";

interface Props {
    imageName: string,
    white?: boolean,
    className? : string,
    ext: 'svg'|'png'
}

const cnImage = cn('Image');

const imagesPath =  './images/compressed/';

export const Image: React.FunctionComponent<Props> = ({imageName, white, className, ext}) => {
    const postfix = white ? '-white' : '';
    return <div className={cnImage({},[className])}>
                <img src={`${imagesPath}${imageName}${postfix}.${ext}`} alt={`${imageName}`}/>
           </div>
};