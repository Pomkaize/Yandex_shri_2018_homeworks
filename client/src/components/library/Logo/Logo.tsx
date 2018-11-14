import * as React from "react";
import {cn} from "@bem-react/classname";
import {Image} from "../Image/Image";

interface iLogoProps {
    className?:string
}

export const cnLogo = cn('Logo');

export const Logo: React.FunctionComponent<iLogoProps> = (props) => {
    return <div className={cnLogo(null, [props.className])}>
                <Image className={cnLogo('Image')} imageName="logo@1x" ext="png"/>
            </div>
};