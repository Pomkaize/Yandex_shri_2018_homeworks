import {cn} from "@bem-react/classname";
import * as React from "react";
import {Image} from "../Image/Image";
import "./CardData.scss";
import {ButtonActive} from "../Button/_active/Button_active";
import {Button} from "../Button/Button";
import {Player} from "../Player/Player";
import {compose} from "@bem-react/core";

interface iCardData {
    description?: any,
    data?: any
}

const cnCardData = cn('CardData');

const BemButton = compose(ButtonActive)(Button);

export const CardData: React.FunctionComponent<iCardData> = (props) => {
  return <>
            {props.description && <div className={cnCardData()}>
                {/* Description*/}
                <span className={cnCardData('Description')}>{props.description}</span>
                {/* Image*/}
                {props.data && props.data.image && <div className={cnCardData('Image')}>
                                                        <Image imageName={props.data.image} className={cnCardData('ImageContent')}/>
                                                    </div>}
                {/*Microclimate*/}
                {props.data && props.data.temperature && props.data.humidity && <div className={cnCardData('Microclimate')}>
                    <div className={cnCardData('Temperature')}>Температура: <span className="bold">{props.data.temperature}</span> C</div>
                    <div className={cnCardData('Humidity')}>Влажность: <span className="bold">{props.data.humidity}</span>%</div>
                </div>}
                {/* Buttons */}
                {props.data && props.data.buttons && <div className={cnCardData('Buttons')}>
                    {props.data.buttons.map((button:string, index:number) => {
                        return <BemButton active={index === 0}>{button}</BemButton>
                    })}
                </div>}
                {props.data && props.data.volume && <div className={cnCardData('Player')} >
                    <Player {...props.data}/>
                </div>}
                </div>}

        </>
};