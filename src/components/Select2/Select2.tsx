import classNames from 'classnames';
import { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';

import ContainerFloating from '@components/ContainerFloating';
import Flex from '@components/Flex';
import Icon from '@components/Icon';
import InputContainer from '@components/Input/InputContainer';
import useTheme from '@hooks/useTheme';

import { isOptionGroup } from './helpers/utils';
import ListItem from './ListItem';
import SelectInput from './SelectInput';
import SelectList from './SelectList';

import type Select2Styles from './Select2.styles';
import type { variantKeys } from './Select2.styles';
import type { ErrorMessageProps } from '@components/ErrorMessage';
import type { useThemeSharedProps } from '@hooks/useTheme';
import type { CSSProperties, ReactNode, RefObject } from 'react';

const optionsDefault: Option[] = [];

export type Option =
  | ({ label: string; value: string; icon?: ReactNode } & {
      [key in Exclude<string, 'options' | 'label' | 'value'>]?: unknown;
    })
  | OptionGroup;

export type OptionGroup = {
  icon?: ReactNode;
  label: string;
  options: Exclude<Option, OptionGroup>[];
};

type Select2PropsBase = {
  ref?: RefObject<HTMLDivElement | null>;
  className?: string;
  id?: string;
  name?: string;
  value?: Exclude<Option, OptionGroup> | string;
  label?: ReactNode;
  options?: Option[] | Promise<Option[]>;
  placeholder?: string;
  disabled?: boolean;
  error?: ErrorMessageProps['message'] | ErrorMessageProps['error'];
  allowCreateOptions?: boolean;
  isSearchable?: boolean;
  autoClose?: boolean;
  clearable?: boolean;
  open?: boolean;
  searchAutoFocus?: boolean;
};

type Select2PropsWithString = Select2PropsBase & {
  valueAsString: true;
  onChange?: (value?: string) => void;
};

type Select2PropsWithObject = Select2PropsBase & {
  valueAsString?: false;
  onChange?: (value?: Exclude<Option, OptionGroup>) => void;
};

export type Select2Props = (Select2PropsWithString | Select2PropsWithObject) &
  useThemeSharedProps<typeof Select2Styles, typeof variantKeys>;

const Select2 = (props: Select2Props) => {
  const {
    ref,
    className = '',
    id,
    name,
    value,
    options = optionsDefault,
    placeholder = 'Select...',
    label = '',
    size,
    disabled = false,
    error = false,
    allowCreateOptions = false,
    isSearchable = true,
    clearable = true,
    open: openProp,
    searchAutoFocus = true,
    autoClose = true,
    onChange
  } = props;
  const [open, setOpen] = useState(openProp);
  const classNameTheme = useTheme<typeof Select2Styles, typeof variantKeys>('Select2', {
    className,
    componentKey: ['inputContainer', 'placeholder', 'listMessage'],
    variants: { size }
  });
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const [triggerRect, setTriggerRect] = useState<DOMRect | undefined>();
  const [loading, setLoading] = useState(options instanceof Promise);
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

  const handleContainerVisible = useCallback((openState: boolean) => {
    setOpen(openState);
    if (!openState) {
      setSearch('');
    }
  }, []);

  const handleChange = useCallback(
    (newValue?: Exclude<Option, OptionGroup>) => {
      if (disabled) {
        return;
      }

      if (props.valueAsString) {
        props.onChange?.(newValue?.value);
      } else {
        props.onChange?.(newValue);
      }

      setSearch('');
      if (autoClose && triggerRef.current) {
        triggerRef.current.click();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [disabled, props.valueAsString, props.onChange, autoClose]
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
    if (open) {
      setTriggerRect(triggerRef.current?.getBoundingClientRect());
    } else {
      setTriggerRect(undefined);
    }
  }, [open]);

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
        return { icon: item.icon, label: item.label, options: item.options.filter(filterItem) };
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

  const style = useMemo<CSSProperties>(() => ({ width: triggerRect?.width }), [triggerRect]);

  return (
    <ContainerFloating
      ref={triggerRef}
      containerTopOffset={error ? -26 : 4}
      containerLeftOffset={0}
      onOpenChange={handleContainerVisible}
      open={openProp}
      loading={loading}
      disabled={disabled}
    >
      <ContainerFloating.Trigger className="w-full">
        <InputContainer
          id={id}
          size={size}
          clearable={clearable}
          disabled={disabled}
          label={label}
          error={error}
          loading={loading}
          onClear={handleClickClear}
          className={{ iconFloatingContainer: classNameTheme.inputContainer }}
          value={value}
        >
          <input type="hidden" name={name} className="hidden invisible" />
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
      {triggerRect && (
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
      )}
    </ContainerFloating>
  );
};

export default Select2;
