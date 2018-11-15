import * as React from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps, compose } from '@bem-react/core';
import { Logo } from '../Logo/Logo';
import { NavMenu } from '../NavMenu/NavMenu';
import { NavMenuExpanded } from '../NavMenu/_expanded/NavMenu_expanded';
import './Header.scss';

const cnHeader = cn('Header');

export interface iHeaderProps {
    menuExpanded: boolean;
    className?: string
}

const NavMenuWithMod = compose(NavMenuExpanded)(NavMenu);

export const Header: React.FunctionComponent<iHeaderProps> = (props) => (
            <header className={cnHeader(null, [props.className])}>
                <Logo className={cnHeader('Logo')} />
                <nav className={cnHeader('Nav')}>
                    <NavMenuWithMod className={cnHeader('NavMenu')} expanded={props.menuExpanded} />
                </nav>
            </header>
        );