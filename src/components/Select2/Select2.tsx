// Packages
import classNames from 'classnames';
import { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';

// Alias
import ContainerFloating from '@components/ContainerFloating';
import Icon from '@components/Icon';
import InputContainer from '@components/Input/InputContainer';
import useTheme from '@hooks/useTheme';

// Relatives
import { isOptionGroup } from './helpers/utils';
import ListItem from './ListItem';
import SelectInput from './SelectInput';
import SelectList from './SelectList';

// Types
import type Select2Styles from './Select2.styles';
import type { variantKeys } from './Select2.styles';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { MouseEvent, Ref } from 'react';

const optionsDefault: Option[] = [];

export type Option =
  | ({
      label: string;
      value: string;
    } & {
      [key in Exclude<string, 'options' | 'label' | 'value'>]?: unknown;
    })
  | OptionGroup;

export type OptionGroup = {
  label: string;
  options: Exclude<Option, OptionGroup>[];
};

export type Select2Props = {
  ref?: Ref<HTMLDivElement | null>;
  className?: string;
  value?: Exclude<Option, OptionGroup> | string;
  options?: Option[] | Promise<Option[]>;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  allowCreateOptions?: boolean;
  isSearchable?: boolean;
  clearable?: boolean;
  menuIsOpen?: boolean;
  searchAutoFocus?: boolean;
  onChange?: (value?: Exclude<Option, OptionGroup>) => void;
} & useThemeSharedProps<typeof Select2Styles, typeof variantKeys>;

const InputContainerClassName = { iconFloatingContainer: 'mr-6' };

const Select2 = ({
  ref,
  className = '',
  value,
  options = optionsDefault,
  placeholder = 'Select...',
  size = 'md',
  disabled = false,
  error = '',
  allowCreateOptions = false,
  isSearchable = true,
  clearable = true,
  menuIsOpen = false,
  searchAutoFocus = true,
  onChange
}: Select2Props) => {
  const classNameTheme = useTheme<typeof Select2Styles, typeof variantKeys, false>('Select2', {
    className,
    componentKey: [],
    variant: { size }
  });
  const [loading, setLoading] = useState(options instanceof Promise);
  const [optionsLoaded, setOptionsLoaded] = useState(() => (!loading && Array.isArray(options) ? options : []));
  const [optionsCustom, setOptionsCustom] = useState<Option[]>([]);
  const refDropdown = useRef<HTMLDivElement | null>(null);
  useImperativeHandle<HTMLDivElement | null, HTMLDivElement | null>(ref, () => refDropdown.current, []);
  const optionSelected = useMemo(() => {
    if (typeof value === 'string') {
      const option = optionsLoaded.find(op => {
        if (isOptionGroup(op)) {
          return op.options.find(gop => gop.value === value);
        }

        return op.value === value;
      });

      if (isOptionGroup(option)) {
        return option.options.find(gop => gop.value === value);
      }

      if (!option && value && allowCreateOptions) {
        return { label: value, value };
      }

      return option;
    }

    return value;
  }, [allowCreateOptions, optionsLoaded, value]);
  const [search, setSearch] = useState('');
  const [containerVisible, setContainerVisible] = useState(false);

  const handleSearch = useCallback(
    (value: string) => {
      if (!containerVisible && refDropdown.current) {
        setContainerVisible(true);
        refDropdown.current.click();
      }

      setSearch(value);
    },
    [setSearch, containerVisible]
  );

  const handleContainerVisible = useCallback((isVisible: boolean) => {
    setContainerVisible(isVisible);
    if (!isVisible) {
      setSearch('');
    }
  }, []);

  const handleChange = useCallback(
    (newValue?: Exclude<Option, OptionGroup>) => {
      if (disabled) {
        return;
      }

      onChange?.(newValue);
      setSearch('');
    },
    [onChange, disabled]
  );

  const loadOptions = useCallback(async () => {
    let opts = options;
    if (opts instanceof Promise) {
      setLoading(true);
      opts = await opts;
      setLoading(false);
    }

    setOptionsLoaded(opts);
  }, [options]);

  useEffect(() => {
    void loadOptions();
  }, [options, loadOptions]);

  useEffect(() => {
    if (!allowCreateOptions || !optionSelected || isOptionGroup(optionSelected)) {
      return;
    }

    if (optionSelected.value && !optionsLoaded.find(op => 'value' in op && op.value === optionSelected.value)) {
      setOptionsCustom(state => {
        if (state.find(op => 'value' in op && op.value === optionSelected.value)) {
          return state;
        }

        const newState = [...state];
        newState.push({ label: optionSelected.label, value: optionSelected.value });

        return newState;
      });
    }

    return () => {
      if (optionSelected.value && !optionsLoaded.find(op => 'value' in op && op.value === optionSelected.value)) {
        setOptionsCustom([]);
      }
    };
  }, [allowCreateOptions, optionSelected, optionsLoaded, value]);

  const optionsFiltered = useMemo(() => {
    const filterItem = (item: Option) =>
      (item.label ? item.label : '').toLowerCase().indexOf(search.toLowerCase()) > -1;
    let result = [...optionsCustom, ...optionsLoaded].map(item => {
      if (isOptionGroup(item)) {
        return { label: item.label, options: item.options.filter(filterItem) };
      }

      return item;
    });

    result = result.filter(item => {
      if (isOptionGroup(item)) {
        return item.options.length > 0;
      }

      return filterItem(item);
    });

    return result;
  }, [optionsLoaded, optionsCustom, search]);

  const handleClosePopupValidator = useCallback((e: Event) => {
    if (!e.target) {
      return false;
    }

    if ((e.target as HTMLElement).classList.contains('select2__search-input') && e.type !== 'click') {
      return true;
    }

    return (e.target as HTMLElement).classList.contains('select2__list-item');
  }, []);

  const handleClickClear = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      onChange?.(undefined);
    },
    [onChange]
  );

  return (
    <ContainerFloating
      ref={refDropdown}
      containerTopOffset={8}
      containerLeftOffset={0}
      autoWidth
      autoHeight
      onContainerVisible={handleContainerVisible}
      popupOpened={menuIsOpen}
      disabled={disabled || loading}
      onCloseValidate={handleClosePopupValidator}
    >
      <ContainerFloating.Content className="w-full">
        <InputContainer
          size={size}
          clearable={clearable}
          disabled={disabled}
          error={error}
          loading={loading}
          onClear={handleClickClear}
          className={InputContainerClassName}
          value={value}
        >
          <div className="flex w-full justify-between items-center">
            <div
              className={classNames('truncate select-none', {
                'mr-8': !!error || loading,
                'text-gray-500': !optionSelected?.label
              })}
            >
              {optionSelected?.label ?? placeholder}
            </div>
            {!containerVisible && <Icon icon="fa-solid fa-chevron-down" />}
            {containerVisible && <Icon icon="fa-solid fa-chevron-up" />}
          </div>
        </InputContainer>
      </ContainerFloating.Content>
      <ContainerFloating.Container
        className="flex flex-col w-full rounded-none rounded-tl-lg rounded-bl-lg"
        shadow="dark"
      >
        {!loading && isSearchable && containerVisible && (
          <SelectInput
            size={size}
            value={search}
            placeholder="Search..."
            disabled={disabled}
            autoFocus={searchAutoFocus}
            allowCreateOptions={allowCreateOptions}
            onChange={handleSearch}
            onSelect={handleChange}
          />
        )}
        {!loading && optionsFiltered.length > 0 && (
          <SelectList value={optionSelected?.value} options={optionsFiltered} onChange={handleChange} />
        )}
        {!loading && allowCreateOptions && search && (
          <ListItem className="mx-2.5 mt-2.5" prefix="Create:" label={search} value={search} onChange={handleChange} />
        )}
        {loading && <div className="py-3 text-gray-500 flex items-center justify-center shrink-0">Loading...</div>}
        {!loading && optionsFiltered.length === 0 && (
          <div className="py-3 text-gray-500 flex items-center justify-center shrink-0">No Options</div>
        )}
      </ContainerFloating.Container>
    </ContainerFloating>
  );
};

export default Select2;
