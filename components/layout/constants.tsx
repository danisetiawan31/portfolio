import {
  IconBriefcase,
  IconTimeline,
  IconCode,
  IconMail,
  IconCertificate,
  IconBrandGithub,
  IconBrandLinkedin,
} from '@tabler/icons-react'

export type NavItem = {
  name: string
  link: string
  icon?: React.ReactElement
}

export const NAV_ITEMS: NavItem[] = [
  { name: 'Projects', link: '/#projects', icon: <IconBriefcase size={16} /> },
  {
    name: 'Experience',
    link: '/#experience',
    icon: <IconTimeline size={16} />,
  },
  { name: 'Skills', link: '/#skills', icon: <IconCode size={16} /> },
  {
    name: 'Certificates',
    link: '/#certificates',
    icon: <IconCertificate size={16} />,
  },
  { name: 'Contact', link: '/#contact', icon: <IconMail size={16} /> },
]

export const SOCIAL_LINKS = [
  {
    name: 'GitHub',
    url: 'https://github.com/danisetiawan31',
    icon: <IconBrandGithub size={18} />,
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/ahmaddhanisetiawan',
    icon: <IconBrandLinkedin size={18} />,
  },
]
