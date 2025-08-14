export const getFileSizeMB = (size: number) => size / 1000 / 1000;

export const getExtension = (file: File) => {
  return file.name.split('.').pop();
};

export const checkType = (file: File, types: string[]) => {
  const extension = getExtension(file);
  if (!extension) {
    return undefined;
  }

  const loweredTypes = types.map(type => type.toLowerCase());

  return loweredTypes.includes(extension.toLowerCase());
};

export const acceptedExtensions = (types: string[]) => {
  if (types.length === 0) {
    return '';
  }

  return types.map(type => `.${type.toLowerCase()}`).join(',');
};

export const bytesToSize = (bytes: number) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) {
    return '0 Byte';
  }

  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString(), 10);

  return `${Math.round(bytes / 1024 ** i)} ${sizes[i]}`;
};
