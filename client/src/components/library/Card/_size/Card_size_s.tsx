import { withBemMod, IClassNameProps } from '@bem-react/core';
import { cnCard } from '../Card';
import './Card_size_s.scss';

interface CardWithModProps extends IClassNameProps {
  size: 's'| 'm'| 'l';
}

export const CardSizeS = withBemMod<IClassNameProps>(cnCard(), { size: 'l' });
