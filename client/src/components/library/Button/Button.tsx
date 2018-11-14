import * as React from 'react';
import { cn } from '@bem-react/classname'
import "./Button.scss"
import "./_active/Button_active.scss"

import {MouseEventHandler} from "react";

export const cnButton = cn('Button');

export interface iButtonProps {
    onClick?: MouseEventHandler<HTMLButtonElement>,
    children?: string
    active?: boolean
}

export const Button: React.FunctionComponent<iButtonProps> = ({ onClick, children, active }) => {
    return <button className={cnButton({active:active})}
                   onClick={onClick}>
                    {children}
            </button>
};
