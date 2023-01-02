import type { RangePlugin } from "@easepick/range-plugin";
import {
  memo,
  useRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  InputHTMLAttributes,
  createElement,
} from "react";
import { easepick } from "@easepick/core";
import { DateTime } from "@easepick/datetime";

export type EasePickInputElement = HTMLInputElement & {
  pickerInstance?: easepick.Core;
};

type CreateOptions = ConstructorParameters<typeof easepick.create>[0];
type DateType = string | number | Date;

export type EasePickOptions = Omit<
  CreateOptions,
  "element" | "date" | "startDate" | "endDate"
>;

function getTimeValue(date?: DateType) {
  if (!date) return undefined;
  if (date instanceof Date) return date.getTime();
  return new DateTime(date).getTime();
}

function updateInputValue(value: string, picker: easepick.Core) {
  const rangePlugin: RangePlugin =
    picker.PluginManager.getInstance("RangePlugin");

  if (!value) {
    if (rangePlugin) {
      if (picker.getStartDate()?.getTime() || picker.getEndDate()?.getTime()) {
        picker.clear();
        return;
      }
    } else {
      if (picker.getDate()?.getTime()) {
        picker.clear();
        return;
      }
    }
    return;
  }

  const { format, lang } = picker.options;
  if (rangePlugin) {
    const { delimiter } = rangePlugin.options;
    const [start, end] = value.split(rangePlugin.options.delimiter!);
    const startDate = DateTime.parseDateTime(start, format!, lang);
    const endDate = DateTime.parseDateTime(end, format!, lang);
    const startString = new DateTime(startDate).format(format!, lang);
    const endString = new DateTime(endDate).format(format!, lang);
    if (`${startString}${delimiter}${endString}` === value) {
      if (
        startDate.getTime() !== picker.getStartDate()?.getTime() ||
        endDate.getTime() !== picker.getEndDate()?.getTime()
      ) {
        if (rangePlugin.options.strict) {
          if (startDate && endDate) {
            picker.setDateRange(startDate, endDate);
          }
        } else {
          if (startDate) picker.setStartDate(startDate);
          if (endDate) picker.setEndDate(endDate);
        }
      }
    } else if (
      startString === value ||
      `${startString}${delimiter}` === value
    ) {
      if (
        rangePlugin.options.strict &&
        startDate.getTime() !== picker.getStartDate()?.getTime()
      ) {
        picker.setStartDate(startDate);
      }
    }
  } else {
    const date = DateTime.parseDateTime(value, format!, lang);
    if (new DateTime(date).format(format!, lang) === value) {
      if (date.getTime() !== picker.getDate()?.getTime()) {
        picker.setDate(date);
      }
    }
  }
}

export type EasePickWrapperProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "readOnly" | "value"
> & {
  options: EasePickOptions;
  date?: DateType;
  startDate?: DateType;
  endDate?: DateType;
  value?: string;
};

const EasePickWrapper = forwardRef(function EasePicker(
  props: EasePickWrapperProps,
  ref: React.ForwardedRef<EasePickInputElement>
) {
  const inputRef = useRef<EasePickInputElement>(null);
  useImperativeHandle(ref, () => inputRef.current!);
  const { date, startDate, endDate, options, ...inputProps } = props;
  const { value } = props;

  const dataValue = getTimeValue(date);
  const dataStart = getTimeValue(startDate);
  const dataEnd = getTimeValue(endDate);

  // update options
  useEffect(() => {
    const element = inputRef.current;
    if (!element) {
      return;
    }

    if (element.pickerInstance) {
      element.pickerInstance.destroy();
      element.value = "";
      // if (value === undefined) {
      //   element.value = "";
      // }
    }
    element.pickerInstance = new easepick.create({
      ...options,
      date: dataValue,
      element,
      RangePlugin: {
        ...options.RangePlugin,
        startDate: dataStart ? new DateTime(dataStart) : undefined,
        endDate: dataEnd ? new DateTime(dataEnd) : undefined,
      },
    });
    if (value) {
      updateInputValue(value, element.pickerInstance);
    }
  }, [options]);

  // update date value
  useEffect(() => {
    if (value !== undefined) {
      return;
    }
    const element = inputRef.current;
    if (!element || !element.pickerInstance) {
      return;
    }

    const picker = element.pickerInstance;
    const rangePlugin = picker.PluginManager.getInstance("RangePlugin");

    if (rangePlugin) {
      return;
    }

    if (dataValue !== picker.getDate()?.getTime()) {
      if (dataValue) {
        picker.setDate(dataValue);
      } else {
        picker.clear();
      }
    }
  }, [dataValue]);

  // update startDate and endDate values
  useEffect(() => {
    if (value !== undefined) {
      return;
    }
    const element = inputRef.current;
    if (!element || !element.pickerInstance) {
      return;
    }
    const picker = element.pickerInstance;
    const rangePlugin: RangePlugin =
      picker.PluginManager.getInstance("RangePlugin");

    if (!rangePlugin) {
      return;
    }

    if (
      dataStart !== picker.getStartDate()?.getTime() ||
      dataEnd !== picker.getEndDate()?.getTime()
    ) {
      if (!dataStart) {
        picker.clear();
        return;
      }
      if (rangePlugin.options.strict) {
        if (dataStart && dataEnd) {
          picker.setDateRange(dataStart, dataEnd);
        }
      } else {
        if (dataStart) picker.setStartDate(dataStart);
        if (dataEnd) picker.setEndDate(dataEnd);
      }
    }
  }, [dataStart, dataEnd]);

  // update value
  useEffect(() => {
    if (value === undefined) {
      return;
    }
    const element = inputRef.current;
    if (!element || !element.pickerInstance) {
      return;
    }
    updateInputValue(value, element.pickerInstance);
  }, [value]);

  return createElement("input", {
    ...inputProps,
    ref: inputRef,
    type: "text",
    ...(dataValue !== undefined ? { "data-value": dataValue } : {}),
    ...(dataStart !== undefined ? { "data-start": dataStart } : {}),
    ...(dataEnd !== undefined ? { "data-end": dataEnd } : {}),
  });
});

export default memo(EasePickWrapper);
