'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  MagnifyingGlassIcon,
  NewspaperIcon,
  Squares2X2Icon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import {
  MagnifyingGlassIcon as MagnifyingGlassSolid,
  NewspaperIcon as NewspaperSolid,
  Squares2X2Icon as Squares2X2Solid,
  UserCircleIcon as UserCircleSolid,
} from '@heroicons/react/24/solid';
import HomeIcon from '@heroicons/react/24/outline/HomeIcon';
import HomeIconSolid from '@heroicons/react/24/solid/HomeIcon';

const tabs = [
  {
    label: 'Home',
    href: '/',
    icon: HomeIcon,
    activeIcon: HomeIconSolid,
  },
  {
    label: 'Explore',
    href: '/explore',
    icon: MagnifyingGlassIcon,
    activeIcon: MagnifyingGlassSolid,
  },
  {
    label: 'Feed',
    href: '/feed',
    icon: NewspaperIcon,
    activeIcon: NewspaperSolid,
  },
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: Squares2X2Icon,
    activeIcon: Squares2X2Solid,
  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const userInitials = session?.user?.email
    ? session.user.email.slice(0, 2).toUpperCase()
    : null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-t border-slate-700/60">
      <div className="flex items-center justify-around max-w-lg mx-auto px-2 py-2">

        {tabs.map(({ label, href, icon: Icon, activeIcon: ActiveIcon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-0.5 px-3 py-1 min-w-[56px]"
            >
              {active
                ? <ActiveIcon className="w-6 h-6 text-white" />
                : <Icon className="w-6 h-6 text-slate-400" />
              }
              <span className={`text-[10px] font-medium ${active ? 'text-white' : 'text-slate-400'}`}>
                {label}
              </span>
            </Link>
          );
        })}

        {/* Profile tab — shows initials if signed in, user icon if not */}
        <Link
          href={status === 'authenticated' ? '/profile' : '/log-in'}
          className="flex flex-col items-center gap-0.5 px-3 py-1 min-w-[56px]"
        >
          {status === 'authenticated' && userInitials ? (
            <>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold
                  ${isActive('/profile') ? 'bg-white text-slate-900' : 'bg-slate-500 text-white'}`}
              >
                {userInitials}
              </div>
              <span className={`text-[10px] font-medium ${isActive('/profile') ? 'text-white' : 'text-slate-400'}`}>
                Profile
              </span>
            </>
          ) : (
            <>
              {isActive('/log-in')
                ? <UserCircleSolid className="w-6 h-6 text-white" />
                : <UserCircleIcon className="w-6 h-6 text-slate-400" />
              }
              <span className={`text-[10px] font-medium ${isActive('/log-in') ? 'text-white' : 'text-slate-400'}`}>
                Sign In
              </span>
            </>
          )}
        </Link>

      </div>
    </nav>
  );
}