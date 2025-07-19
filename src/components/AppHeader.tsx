import React from 'react';
import { IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

interface AppHeaderProps {
  onOpenFilter: () => void;
  mode: 'light' | 'dark';
  onToggleTheme: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ onOpenFilter, mode, onToggleTheme }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', height: 56, minHeight: 56, padding: 16, boxSizing: 'border-box', borderBottom: '1px solid #eee' }}>
      <IconButton onClick={onOpenFilter} color="inherit" aria-label="Open filter modal">
        {/* Filter Icon */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 18h4v-2h-4v2zm-7-8v2h18v-2H3zm3-6v2h12V4H6z" fill="currentColor" />
        </svg>
      </IconButton>
      <IconButton onClick={onToggleTheme} color="inherit" aria-label="Toggle dark mode">
        {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
      </IconButton>
    </div>
  );
};

export default AppHeader; 