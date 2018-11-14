import { withBemMod, IClassNameProps } from '@bem-react/core';
import { cnNavMenu } from '../NavMenu';
import './NavMenu_expanded.scss';

interface NavMenuWithModProps extends IClassNameProps {
  expanded?: boolean;
}

export const NavMenuExpanded = withBemMod<NavMenuWithModProps>(cnNavMenu(), { expanded: true });
