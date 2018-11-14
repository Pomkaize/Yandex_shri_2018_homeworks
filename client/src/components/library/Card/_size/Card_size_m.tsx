import { withBemMod, IClassNameProps } from '@bem-react/core';
import { cnCard } from '../Card';
import './Card_size_m.scss';

interface CardWithModProps extends IClassNameProps {
  size: 's'| 'm'| 'l';
}

export const CardSizeM = withBemMod<IClassNameProps>(cnCard(), { size: 'm' });
