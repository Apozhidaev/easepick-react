// import { DateTime } from "luxon";
import { useMemo, useState } from "react";
import { AmpPlugin } from "easepick-plugin-amp";
import { RangePlugin } from "@easepick/range-plugin";
import { DateTime } from "@easepick/datetime";
import EasePicker, { EasePickOptions } from "../../src";

const lang = "ru-RU";
const format = "DD MMM, YYYY";

function App() {
  const [date, setDate] = useState<string | undefined>("");
  const [start, setStart] = useState<Date | undefined>();
  const [end, setEnd] = useState<Date | undefined>();
  const [strict, setStrict] = useState<boolean>(true);
  const options: EasePickOptions = useMemo(
    () => ({
      lang,
      format,
      readonly: false,
      plugins: [AmpPlugin],
      css: [
        "https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.0/dist/index.css",
      ],
      setup(picker) {
        picker.on("select", (e) => {
          const { date, start, end } = e.detail;
          setDate(date);
          // setDate(new DateTime(date).format(format, lang));
          // setDate(
          //   new DateTime(start).format(format, lang) + " - " + (end
          //     ? new DateTime(end).format(format, lang)
          //     : "")
          // );
          setStart(start);
          setEnd(end);
          console.log('select', { date, start, end });
        });
        picker.on("clear", () => {
          setDate(() => "");
          setStart(() => undefined);
          setEnd(() => undefined);
          console.log('clear');
        });
      },
      AmpPlugin: {
        resetButton: true,
      },
      RangePlugin: {
        strict,
      },
    }),
    [strict]
  );

  console.log("render", date, end);

  return (
    <div className="p-2">
      <button
        onClick={() => {
          setDate(() => undefined);
          // setStart(() => undefined);
          setEnd(() => undefined);
          setStart(() => new DateTime().subtract(11, "day"));
          // setEnd(() => new Date());
        }}
      >
        clear
      </button>
      <EasePicker
        name="fgfg"
        // value={date}
        // onChange={(e) => {
        //   setDate(e.target.value);
        //   console.log("onChange");
        // }}
        date={date}
        // startDate={start}
        // endDate={end}
        options={options}
      />
      <button onClick={() => setStrict(!strict)}>{String(strict)}</button>
    </div>
  );
}

export default App;
