import React from 'react';
import { Droplets, GraduationCap, Heart, Leaf } from 'lucide-react';

interface CharityPlaceholderImageProps {
  charityId: number;
  charityName: string;
  className?: string;
}

const CharityPlaceholderImage: React.FC<CharityPlaceholderImageProps> = ({
  charityId,
  charityName,
  className = "w-full h-full object-cover"
}) => {
  const getCharityConfig = (id: number) => {
    switch (id) {
      case 0: // Clean Water Foundation
        return {
          gradient: 'from-blue-400 via-cyan-500 to-blue-600',
          icon: Droplets,
          iconColor: 'text-white/90',
          pattern: 'water'
        };
      case 1: // Education for All
        return {
          gradient: 'from-purple-400 via-pink-500 to-purple-600',
          icon: GraduationCap,
          iconColor: 'text-white/90',
          pattern: 'education'
        };
      case 2: // Medical Relief International
        return {
          gradient: 'from-red-400 via-pink-500 to-red-600',
          icon: Heart,
          iconColor: 'text-white/90',
          pattern: 'medical'
        };
      case 3: // Environmental Conservation
        return {
          gradient: 'from-green-400 via-emerald-500 to-green-600',
          icon: Leaf,
          iconColor: 'text-white/90',
          pattern: 'environment'
        };
      default:
        return {
          gradient: 'from-gray-400 via-gray-500 to-gray-600',
          icon: Heart,
          iconColor: 'text-white/90',
          pattern: 'default'
        };
    }
  };

  const config = getCharityConfig(charityId);
  const IconComponent = config.icon;

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient}`} />
      
      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-20">
        {config.pattern === 'water' && (
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm15 0c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px'
          }} />
        )}
        
        {config.pattern === 'education' && (
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '20px 20px'
          }} />
        )}
        
        {config.pattern === 'medical' && (
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M25 25c0-6.9-5.6-12.5-12.5-12.5S0 18.1 0 25s5.6 12.5 12.5 12.5S25 31.9 25 25zm12.5 0c0-6.9-5.6-12.5-12.5-12.5S12.5 18.1 12.5 25s5.6 12.5 12.5 12.5S37.5 31.9 37.5 25z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '25px 25px'
          }} />
        )}
        
        {config.pattern === 'environment' && (
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='44' height='44' viewBox='0 0 44 44' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Cpath d='M22 22c0-6.1-4.9-11-11-11s-11 4.9-11 11 4.9 11 11 11 11-4.9 11-11zm11 0c0-6.1-4.9-11-11-11s-11 4.9-11 11 4.9 11 11 11 11-4.9 11-11z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '22px 22px'
          }} />
        )}
      </div>
      
      {/* Central icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 shadow-lg">
          <IconComponent className={`w-16 h-16 ${config.iconColor}`} />
        </div>
      </div>
      
      {/* Bottom overlay with charity name */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
        <h3 className="text-white font-semibold text-lg truncate">{charityName}</h3>
      </div>
    </div>
  );
};

export default CharityPlaceholderImage;
