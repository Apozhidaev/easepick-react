# easepick-react

This component is react wrapper for [easepick](https://easepick.com/).



### Attributes

* **date** - date value
* **startDate** - start date (for RangePlugin)
* **endDate** - end date (for RangePlugin)
* **options** - easepick options
* **...inputProps[]** - input props


### How to Use

Step 1.
```bash
npm i @easepick/core
npm i easepick-react
```

Step 2.
```jsx
import { useMemo, useState } from "react";
import EasePicker, { EasePickOptions } from "easepick-react";

function Demo() {
  const [date, setDate] = useState<Date | undefined>();
  const options: EasePickOptions = useMemo(
    () => ({
      css: [
        'https://cdn.jsdelivr.net/npm/@easepick/core@1.2.0/dist/index.css',
      ],
      setup(picker) {
        picker.on("select", (e) => {
          const { date } = e.detail;
          setDate(date);
        });
      },
    }),
    []
  );

  return <EasePicker date={date} options={options} />;
}

export default Demo;
```
