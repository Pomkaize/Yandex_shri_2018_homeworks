import { withBemMod, IClassNameProps } from '@bem-react/core';
import { cnCard } from '../Card';
import './Card_type_info.scss';

interface CardWithModProps extends IClassNameProps {
    type: 'info' | 'critical'
}

export const CardTypeInfo = withBemMod<CardWithModProps>(cnCard(), { type: 'info' });
