import {
  IconUser,
  IconBriefcase,
  IconTimeline,
  IconCode,
  IconMail,
} from '@tabler/icons-react'

export type NavItem = {
  name: string
  link: string
  icon?: React.ReactElement
}

export const NAV_ITEMS: NavItem[] = [
  { name: 'About', link: '#about', icon: <IconUser size={16} /> },
  { name: 'Projects', link: '#projects', icon: <IconBriefcase size={16} /> },
  { name: 'Experience', link: '#experience', icon: <IconTimeline size={16} /> },
  { name: 'Skills', link: '#skills', icon: <IconCode size={16} /> },
  { name: 'Contact', link: '#contact', icon: <IconMail size={16} /> },
]
