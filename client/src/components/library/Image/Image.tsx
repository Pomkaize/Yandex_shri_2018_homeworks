import * as React from "react";
import {cn} from "@bem-react/classname";
import './Image.scss'

interface Props {
    imageName: string,
    white?: boolean,
    className? : string,
    ext?: 'svg'|'png'|'jpg'|null
}

const cnImage = cn('Image');

const imagesPath =  './images/compressed/';

export const Image: React.FunctionComponent<Props> = ({imageName, white, className, ext}) => {
    const postfix = white ? '-white' : '';
    const extParam = ext ? `.${ext}`: '';
    return <div className={cnImage(null,[className])}>
                <img className={cnImage('Content')} src={`${imagesPath}${imageName}${postfix}${extParam}`} alt={`${imageName}`}/>
           </div>
};