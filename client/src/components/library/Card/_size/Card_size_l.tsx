import { withBemMod, IClassNameProps } from '@bem-react/core';
import { cnCard } from '../Card';
import './Card_size_l.scss';

interface CardWithModProps extends IClassNameProps {
  size: 's'| 'm'| 'l';
}

export const CardSizeL = withBemMod<IClassNameProps>(cnCard(), { size: 'l' });
