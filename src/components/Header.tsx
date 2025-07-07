
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const Header: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <FileSpreadsheet className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">
            Ferramenta OPME
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-gray-600">
            <User className="h-4 w-4 mr-2" />
            <span className="text-sm">{user?.email}</span>
          </div>
          <Button
            onClick={signOut}
            variant="outline"
            size="sm"
            className="flex items-center"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </div>
  );
};
