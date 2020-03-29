export interface NavigationBarConfig {
  titleItem: NavigationMenuItem,
  menuItems: NavigationMenuItem[]
}

interface NavigationMenuItem {
  name: string;
  url: string;
  mdiIcon?: string;
}
