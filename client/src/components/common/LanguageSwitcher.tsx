import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { supportedLngs } from '../../i18n/config';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (event: SelectChangeEvent) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <Select
        value={i18n.language}
        onChange={handleLanguageChange}
        displayEmpty
        sx={{
          backgroundColor: 'white',
          '& .MuiSelect-icon': {
            color: 'rgba(0, 0, 0, 0.54)'
          }
        }}
      >
        {Object.entries(supportedLngs).map(([code, name]) => (
          <MenuItem key={code} value={code}>
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LanguageSwitcher; 