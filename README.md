# plitzi-ui

to make it works, and included tailwind

in your tailwind.config.js add

```
const { join } = require('path');

content: [
    ...
    join(__dirname, 'node_modules/@plitzi/plitzi-ui/dist/**/!(*.stories|*.spec).{js,html}')
    ...
  ],

```

in your styles include

```
@import '@plitzi/plitzi-ui/style.css';
```


in your eslint.rc

```
  ...
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ...
          ['@plitzi/plitzi-ui/hooks', path.resolve('./node_modules/@plitzi/plitzi-ui/dist/hooks')],
          ['@plitzi/plitzi-ui', path.resolve('./node_modules/@plitzi/plitzi-ui/dist/components')]
        ],
        extensions: ['.ts', '.js', '.jsx']
      }
    }
  },
```
