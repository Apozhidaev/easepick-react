import {
  memo,
  useRef,
  forwardRef,
  useLayoutEffect,
  useImperativeHandle,
  InputHTMLAttributes,
  createElement,
} from "react";
import { easepick } from "@easepick/bundle";
import { IPickerConfig } from "@easepick/core/dist/types";

export type EasePickInputElement = HTMLInputElement & {
  pickerInstance?: easepick.Core;
};

export type EasePickOptions = Omit<IPickerConfig, "element">;

type Props = InputHTMLAttributes<HTMLInputElement> & {
  options: EasePickOptions;
};

const EasePickWrapper = forwardRef(function EasePicker(
  props: Props,
  ref: React.ForwardedRef<EasePickInputElement>
) {
  const inputRef = useRef<EasePickInputElement>(null);
  useImperativeHandle(ref, () => inputRef.current!);
  const { options, ...inputProps } = props;

  useLayoutEffect(() => {
    const element = inputRef.current;
    if (element) {
      if (element.pickerInstance) {
        element.pickerInstance.destroy();
        if (!props.value) {
          element.value = "";
        }
      }
      element.pickerInstance = new easepick.create({
        ...props.options,
        element,
      });
    }
  }, [options, props.value]);

  return createElement("input", {
    ...inputProps,
    ref: inputRef,
    type: "text",
  });
});

export default memo(EasePickWrapper);
