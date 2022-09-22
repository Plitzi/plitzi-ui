export const getFileSizeMB = size => size / 1000 / 1000;

export const getExtension = file => {
  return file.name.split('.').pop();
};

export const checkType = (file, types) => {
  const extension = getExtension(file);
  const loweredTypes = types.map(type => type.toLowerCase());

  return loweredTypes.includes(extension.toLowerCase());
};

export const acceptedExtensions = types => {
  if (types === undefined) {
    return '';
  }

  return types.map(type => `.${type.toLowerCase()}`).join(',');
};

export const bytesToSize = bytes => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) {
    return '0 Byte';
  }

  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);

  return `${Math.round(bytes / 1024 ** i, 2)} ${sizes[i]}`;
};
