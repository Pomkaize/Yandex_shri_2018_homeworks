import * as React from 'react';
import { cn } from '@bem-react/classname';
import {Image} from "../Image/Image";
import "./Card.scss"
import {CardData} from "../CardData/CardData";

export const cnCard = cn('Card');

export interface iEventCardProps {
    title: string,
    source: string,
    time: string,
    description: string|undefined|null,
    icon: string,
    size: 's'|'l'|'m',
    type?:any,
    data?: any,
    [key:string]:any
}

export interface iCardButton {
    align: 'top' | 'bottom',
    imageName: string,
    white?: boolean|undefined
}

export const Card: React.FunctionComponent<iEventCardProps> = (props) => {
    return <div className={cnCard({type: props.type, size: props.size})}>
                <CardButton imageName="next" align="top" white={props.type === 'critical'}/>
                <CardButton imageName="cross" align="bottom"/>
                <div className={cnCard('Header')}>
                    <Image className={cnCard('Icon')} imageName={props.icon} white={props.type === 'critical'} ext="svg"/>
                    <h3 className={cnCard('Title')}>{props.title}</h3>
                </div>
                <div className={cnCard('Target')}>
                    <div className={cnCard('Source')}>{props.source}</div>
                    <div className={cnCard('Time')}>{props.time}</div>
                </div>
                <CardData data={props.data} description={props.description}/>
           </div>
};


const CardButton: React.FunctionComponent<iCardButton> = ({imageName, white, align}) => {
    return (<div className={cnCard("Button", {align: align})}>
                <Image imageName={imageName} white={white} className={cnCard("ButtonImage")} ext="svg"/>
            </div>)
};
