
import React from 'react';
import { User, UserRole } from '../types';
import { INITIAL_USERS } from '../data/mockData';
import { Shield, User as UserIcon, Users, Building, Terminal, Award } from 'lucide-react';

interface RoleSwitcherProps {
  onRoleSwitch: (user: User) => void;
  currentUser: User | null;
}

const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ onRoleSwitch, currentUser }) => {
  const roles = [
    { label: 'Super', role: UserRole.SUPER_ADMIN, icon: <Award size={10} /> },
    { label: 'Admin', role: UserRole.ADMIN, icon: <Shield size={10} /> },
    { label: 'Club', role: UserRole.CLUB, icon: <Building size={10} /> },
    { label: 'Coach', role: UserRole.COACH, icon: <Users size={10} /> },
    { label: 'Player', role: UserRole.PLAYER, icon: <UserIcon size={10} /> },
  ];

  const handleSwitch = (role: UserRole) => {
    localStorage.setItem('padel_active_role', role);
    
    const mockUser = INITIAL_USERS.find(u => u.role === role);

    if (mockUser) {
      onRoleSwitch({
        ...mockUser,
        role: role
      });
    } else {
      /* Fix: added missing required property 'gender' to match the User interface */
      onRoleSwitch({
        id: `temp_${role}`,
        name: `TEST ${role.toUpperCase().replace('_', ' ')}`,
        email: `${role.toLowerCase()}@padelclub.ma`,
        role: role,
        gender: 'Other'
      });
    }
  };

  return (
    <div className="flex items-center gap-1.5 h-full">
      <div className="flex items-center gap-1.5 px-2 py-1 bg-[#95f122]/5 border border-[#95f122]/10 rounded-sm">
        <Terminal size={10} className="text-[#95f122] opacity-70" />
        <span className="text-[7px] font-black uppercase tracking-[0.1em] text-[#95f122]/70">TEST</span>
      </div>

      <div className="flex bg-white/[0.03] border border-white/[0.05] rounded-sm p-0.5">
        {roles.map((item) => (
          <button
            key={item.role}
            onClick={() => handleSwitch(item.role)}
            className={`px-2 py-1 text-[7px] font-black uppercase tracking-widest transition-all rounded-[1px] flex items-center gap-1.5 ${
              currentUser?.role === item.role
                ? 'bg-[#95f122] text-[#040812] shadow-sm'
                : 'text-slate-600 hover:text-slate-300 hover:bg-white/5'
            }`}
            title={`Switch to ${item.label}`}
          >
            {item.icon}
            <span className="hidden xl:inline">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RoleSwitcher;
