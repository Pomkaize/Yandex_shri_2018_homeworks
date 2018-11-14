import { withBemMod, IClassNameProps } from '@bem-react/core';
import { cnButton } from '../Button';
import './Button_active.scss';

interface ButtonWithModProps extends IClassNameProps {
    primary?: boolean;
}

export const ButtonActive = withBemMod<ButtonWithModProps>(cnButton(), { active: true });