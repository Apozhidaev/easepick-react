# easepick-react

This component is react wrapper for [easepick](https://easepick.com/).



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
    }),
    []
  );

  return <EasePicker options={options} />;
}

export default App;

```