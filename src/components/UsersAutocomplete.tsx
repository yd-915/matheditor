import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { User } from '@/types';
import { useSelector } from '@/store';
import { Chip } from '@mui/material';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function UsersAutocomplete({
  label,
  placeholder,
  value,
  onChange,
}: {
  label?: string;
  placeholder?: string;
  value: User[];
  onChange: (users: (User | string)[]) => void;
}) {
  const handleChange = (event: React.SyntheticEvent, newValue: (User | string)[]) => {
    onChange(newValue);
  };
  const user = useSelector(state => state.user);
  const documents = useSelector(state => state.documents);
  const cloudDocuments = documents.filter(d => d.cloud);

  const users: User[] = cloudDocuments.reduce((users, document) => {
    if (!document.cloud) return users;
    const author = document.cloud.author;
    if (!users.some(u => u.id === author.id) && author.id !== user?.id) users.push(author);
    const coauthors = document.cloud.coauthors;
    coauthors.forEach(coauthor => {
      if (!users.some(u => u.id === coauthor.id) && coauthor.id !== user?.id) users.push(coauthor);
    });
    return users;
  }, [] as User[]);

  return (
    <Autocomplete
      freeSolo
      multiple
      size='small'
      id="users-autocomplete"
      options={users}
      disableCloseOnSelect
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      getOptionLabel={(option) => {
        if (typeof option === 'string') {
          return option;
        }
        return option.email;
      }}
      renderOption={(props, option, { selected }) => {
        const { key, ...rest } = props as any;
        return <li key={key} {...rest}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option.name}
        </li>
      }}
      renderTags={(tagValue, getTagProps) => {
        return tagValue.map((option, index) => (
          <Chip {...getTagProps({ index })} key={option.email} label={option.email} />
        ))
      }}
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder={placeholder} />
      )}

      value={value}
      onChange={handleChange}
    />
  );
}

