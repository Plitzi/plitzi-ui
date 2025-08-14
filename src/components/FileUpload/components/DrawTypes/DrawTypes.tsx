import { useMemo } from 'react';

import { bytesToSize } from '../../helpers/utils';

const typesDefault = ['jpeg', 'jpg', 'png'];

export type DrawTypesProps = {
  className?: string;
  minSize: number;
  maxSize: number;
  types: string[];
};

const DrawTypes = ({ className = '', minSize = 0, maxSize = Infinity, types = typesDefault }: DrawTypesProps) => {
  const title = useMemo(() => {
    const str = [];
    if (maxSize) {
      str.push(`Max size: ${bytesToSize(maxSize)}`);
    }

    if (minSize) {
      str.push(`Min size: ${bytesToSize(minSize)}`);
    }

    str.push(`types: ${types.join(', ')}`);

    return str.join(' | ');
  }, [maxSize, minSize, types]);

  return (
    <div title={title} className={className}>
      {types.join(', ')}
      {maxSize && maxSize !== Infinity && <span className="inline-block uppercase mx-1">({bytesToSize(maxSize)})</span>}
    </div>
  );
};

export default DrawTypes;
