// Packages
import React, { useState } from 'react';

// Relatives
import FileUpload from './FileUpload';

export default {
  component: FileUpload,
  title: 'Components/FileUpload'
};

const Template = args => {
  const [files, setFiles] = useState([]);

  const handleChange = data => {
    console.log('weee', Array.from(data));
    setFiles(Array.from(data));
  };

  return (
    <div>
      <FileUpload
        {...args}
        // label="Select a resource file to upload"
        onChange={handleChange}
        types={['jpeg', 'jpg', 'png', 'json']}
        className="p-10"
      />
      {files &&
        files.map((file, i) => (
          <div key={i}>
            {file.type.includes('image') && <img src={URL.createObjectURL(file)} alt="" width={200} height={200} />}
            {file.name}
          </div>
        ))}
    </div>
  );
};

export const BasicUsage = Template.bind({});
BasicUsage.args = {
  ...FileUpload.defaultProps
};
