import { withBemMod, IClassNameProps } from '@bem-react/core';
import { cnCard } from '../Card';
import './Card_type_critical.scss';

interface CardWithModProps extends IClassNameProps {
    type: 'info' | 'critical'
}

export const CardTypeCritical = withBemMod<CardWithModProps>(cnCard(), { type: 'critical' });
