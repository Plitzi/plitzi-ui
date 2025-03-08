import classNames from 'classnames';
import { useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';

import ContainerFloating from '@components/ContainerFloating';
import useFloating from '@components/ContainerFloating/hooks/useFloating';
import Flex from '@components/Flex';
import Icon from '@components/Icon';
import InputContainer from '@components/Input/InputContainer';
import useTheme from '@hooks/useTheme';

// Relatives
import { isOptionGroup } from './helpers/utils';
import ListItem from './ListItem';
import SelectInput from './SelectInput';
import SelectList from './SelectList';

import type Select2Styles from './Select2.styles';
import type { variantKeys } from './Select2.styles';
import type { ErrorMessageProps } from '@components/ErrorMessage';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { CSSProperties, RefObject } from 'react';

const optionsDefault: Option[] = [];

export type Option =
  | ({ label: string; value: string } & { [key in Exclude<string, 'options' | 'label' | 'value'>]?: unknown })
  | OptionGroup;

export type OptionGroup = {
  label: string;
  options: Exclude<Option, OptionGroup>[];
};

export type Select2Props = {
  ref?: RefObject<HTMLDivElement | null>;
  className?: string;
  value?: Exclude<Option, OptionGroup> | string;
  options?: Option[] | Promise<Option[]>;
  placeholder?: string;
  disabled?: boolean;
  error?: ErrorMessageProps['message'] | ErrorMessageProps['error'];
  allowCreateOptions?: boolean;
  isSearchable?: boolean;
  clearable?: boolean;
  open?: boolean;
  searchAutoFocus?: boolean;
  onChange?: (value?: Exclude<Option, OptionGroup>) => void;
} & useThemeSharedProps<typeof Select2Styles, typeof variantKeys>;

const Select2 = ({
  ref,
  className = '',
  value,
  options = optionsDefault,
  placeholder = 'Select...',
  size = 'md',
  disabled = false,
  error = false,
  allowCreateOptions = false,
  isSearchable = true,
  clearable = true,
  open: openProp = false,
  searchAutoFocus = true,
  onChange
}: Select2Props) => {
  const classNameTheme = useTheme<typeof Select2Styles, typeof variantKeys, false>('Select2', {
    className,
    componentKey: ['inputContainer', 'placeholder', 'listMessage'],
    variant: { size }
  });
  const [loading, setLoading] = useState(options instanceof Promise);
  const [open, setOpen, handleClickTrigger, triggerRef] = useFloating({ open: openProp, disabled, loading });
  const [optionsLoaded, setOptionsLoaded] = useState(() => (!loading && Array.isArray(options) ? options : []));
  const [optionsCustom, setOptionsCustom] = useState<Option[]>([]);
  useImperativeHandle<HTMLDivElement | null, HTMLDivElement | null>(ref, () => triggerRef.current, [triggerRef]);
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

  const handleSearch = useCallback(
    (value: string) => {
      if (!open && triggerRef.current) {
        triggerRef.current.click();
      }

      setSearch(value);
    },
    [setSearch, open, triggerRef]
  );

  const handleContainerVisible = useCallback((open: boolean) => !open && setSearch(''), []);

  const handleChange = useCallback(
    (newValue?: Exclude<Option, OptionGroup>) => {
      if (disabled) {
        return;
      }

      onChange?.(newValue);
      setSearch('');
      setOpen(false);
    },
    [onChange, disabled, setOpen]
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

  const handleClickClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange?.(undefined);
    },
    [onChange]
  );

  const style = useMemo<CSSProperties>(
    () => {
      const { width } = triggerRef.current?.getBoundingClientRect() ?? { width: undefined };

      return { width };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [triggerRef.current]
  );

  return (
    <ContainerFloating
      ref={triggerRef as RefObject<HTMLDivElement>}
      containerTopOffset={error ? -26 : 0}
      containerLeftOffset={0}
      onOpenChange={handleContainerVisible}
      open={open}
    >
      <ContainerFloating.Trigger className="w-full" onClick={handleClickTrigger}>
        <InputContainer
          size={size}
          clearable={clearable}
          disabled={disabled}
          error={error}
          loading={loading}
          onClear={handleClickClear}
          className={{ iconFloatingContainer: classNameTheme.inputContainer }}
          value={value}
        >
          <Flex justify="between" items="center" className="min-w-0" grow>
            <div
              className={classNames('truncate select-none', {
                'mr-8': !!error || loading,
                [classNameTheme.placeholder]: !optionSelected?.label
              })}
              title={optionSelected?.label ?? placeholder}
            >
              {optionSelected?.label ?? placeholder}
            </div>
            {!open && <Icon icon="fa-solid fa-chevron-down" />}
            {open && <Icon icon="fa-solid fa-chevron-up" />}
          </Flex>
        </InputContainer>
      </ContainerFloating.Trigger>
      <ContainerFloating.Content className="flex flex-col w-full" style={style}>
        {!loading && isSearchable && open && (
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
          <SelectList value={optionSelected?.value} options={optionsFiltered} onChange={handleChange} size={size} />
        )}
        {!loading && allowCreateOptions && search && (
          <ListItem
            className="mx-2.5 mt-2.5"
            prefix="Create:"
            size={size}
            label={search}
            value={search}
            onChange={handleChange}
          />
        )}
        {loading && <div className={classNameTheme.listMessage}>Loading...</div>}
        {!loading && optionsFiltered.length === 0 && <div className={classNameTheme.listMessage}>No Options</div>}
      </ContainerFloating.Content>
    </ContainerFloating>
  );
};

export default Select2;
