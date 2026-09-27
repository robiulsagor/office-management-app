import { MenuTypes } from '@/types';
import SidebarItem from './sidebar-item';

const SidebarMenuItems = ({visibleMenu, showSidebar}: {visibleMenu: MenuTypes[], showSidebar: boolean}) => {
  return (
     <ul className="mt-6 px-4 md:px-0 space-y-1">
            {visibleMenu.map((item) => (
              <li key={item.id}>
                <SidebarItem menu={item} showSidebar={showSidebar} />
              </li>
            ))}
          </ul>
  )
}

export default SidebarMenuItems
