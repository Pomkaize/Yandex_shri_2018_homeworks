import * as React from 'react';
import { cn } from '@bem-react/classname';
import { IClassNameProps } from '@bem-react/core';
import './NavMenu.scss';

export const cnNavMenu = cn('NavMenu');

export const NavMenu: React.SFC<IClassNameProps> = ({ className }) => {
  const menuItems = [
    { id: 1, href: "/", title: "События" },
    { id: 2, href: "#", title: "Сводка" },
    { id: 3, href: "#", title: "Устройства" },
    { id: 4, href: "#", title: "Сценарии" },
    { id: 5, href: "#", title: "Видеонаблюдение" },
  ];

  return (
    <ul className={cnNavMenu(null, [className])}>
      {menuItems.map(item => (
        <li key={item.id} className={cnNavMenu('Item')}>
          <a
            href={item.href}
            className={cnNavMenu('ItemLink', { active: item.href === location.pathname })}
          >
            {item.title}
          </a>
        </li>
      ))}
    </ul>
  );
}
