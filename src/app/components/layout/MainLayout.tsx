import { Outlet, useNavigate, useLocation } from 'react-router';
import { Play, CheckCircle, FileText, CreditCard, HelpCircle, UserCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Sidebar, SidebarBody, SidebarLink } from '../ui/animated-sidebar';
import { cn } from '../ui/utils';

export function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Removed authentication requirement - Playground is now accessible to all users

  const links = [
    {
      label: "Playground",
      href: "/playground",
      icon: <Play className="h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Completed",
      href: "/completed",
      icon: <CheckCircle className="h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Usage",
      href: "/usage",
      icon: <FileText className="h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Billing",
      href: "/billing",
      icon: <CreditCard className="h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Support",
      href: "/support",
      icon: <HelpCircle className="h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Account",
      href: "/account",
      icon: <UserCircle className="h-5 w-5 flex-shrink-0" />,
    },
  ];

  return (
    <div className="min-h-screen flex w-full" style={{ fontFamily: 'var(--font-sans)', backgroundColor: '#cccccc' }}>
      <Sidebar open={true} setOpen={() => {}}>
        <SidebarBody className="justify-between gap-10" style={{ width: '300px' }}>
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {/* Logo */}
            <div className={cn("mb-8")}>
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-2xl"
                style={{ fontFamily: 'var(--font-cursive)' }}
              >
                AI Book Translation
              </motion.h2>
            </div>

            {/* Menu Links */}
            <div className="flex flex-col gap-2">
              {links.map((link) => (
                <SidebarLink
                  link={link}
                  onClick={() => navigate(link.href)}
                  isActive={location.pathname === link.href}
                />
              ))}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main Content */}
      <div className="flex-1 ml-[300px] transition-all duration-300">
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="pt-20 md:pt-12 px-6 lg:px-12 pb-12 min-h-screen"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}