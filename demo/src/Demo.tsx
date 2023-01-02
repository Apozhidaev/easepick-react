import { useMemo, useState } from "react";
import EasePicker, { EasePickOptions } from "../../src";

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
