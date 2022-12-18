# easepick-react

This component is react wrapper for [@easepick/bundle](https://easepick.com/packages/bundle.html).



### Attributes

* **options** - easepick options
* **...inputProps[]** - input props


### How to Use

Step 1.
```bash
npm i @easepick/bundle
npm i easepick-react
```

Step 2.
```jsx
import { useMemo } from "react";
import EasePicker, { EasePickOptions } from "easepick-react";

function App() {
  const options: EasePickOptions = useMemo(
    () => ({
      date: new Date(),
      css: [
        'https://cdn.jsdelivr.net/npm/@easepick/core@1.2.0/dist/index.css',
      ],
    }),
    []
  );

  return <EasePicker options={options} />;
}

export default App;

```