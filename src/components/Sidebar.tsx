'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: '📊',
    description: 'Overview & Market Summary',
  },
  {
    name: 'Converter',
    href: '/converter',
    icon: '💱',
    description: 'Currency Exchange Calculator',
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: '📈',
    description: 'Charts & Technical Analysis',
  },
  {
    name: 'Watchlist',
    href: '/watchlist',
    icon: '👁️',
    description: 'Monitor Favorite Pairs',
  },
  {
    name: 'Alerts',
    href: '/alerts',
    icon: '🔔',
    description: 'Price Alerts & Notifications',
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn('pb-12 w-64 bg-card border-r', className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mb-4 px-4">
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              FX Monitor
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Real-time Currency Exchange
            </p>
          </div>
          
          <ScrollArea className="h-[300px] px-1">
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'group flex items-start space-x-3 rounded-lg px-3 py-3 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground',
                    pathname === item.href
                      ? 'bg-accent text-accent-foreground shadow-sm'
                      : 'text-muted-foreground'
                  )}
                >
                  <span className="text-lg shrink-0">{item.icon}</span>
                  <div className="flex-1 space-y-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-muted-foreground group-hover:text-accent-foreground">
                      {item.description}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </ScrollArea>
        </div>
        
        <div className="px-3 py-2">
          <div className="px-4 py-3 bg-accent/20 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Market Status</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-600 font-medium">Open</span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Session</span>
                <span className="font-medium">London</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Next Close</span>
                <span className="font-medium">5h 23m</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}