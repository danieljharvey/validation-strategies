import * as React from "react";
import { swap, getOrElse } from "fp-ts/lib/Either";
import {
  InputState,
  Strategy,
  updateValue,
  onBlur,
  getResult,
  getErrors
} from "./lib/FormLib";

interface ErrorProps {
  errors: string[];
}

const Error: React.FC<ErrorProps> = ({ errors }) =>
  errors.length > 0 ? (
    <div>
      {errors.map((err, key) => (
        <div key={key}>
          <span>⚠️</span>
          <span>&nbsp;{err}</span>
        </div>
      ))}
    </div>
  ) : null;

interface InputProps<B> {
  state: InputState<string, B>;
  setState: (a: InputState<string, B>) => void;
  strategy: Strategy;
}

const getAllErrors = <A, B = A>(state: InputState<A, B>): string[] =>
  getOrElse<B, string[]>(_ => [])(swap(state.validation(state.value)));

const LittleText: React.FC = ({ children }) => (
  <p style={{ fontSize: "10px" }}>{children}</p>
);

export function Input<B>({ state, setState, strategy }: InputProps<B>) {
  const validationErrors = getErrors(getResult(state, strategy));
  const allErrors = getAllErrors(state);
  return (
    <div>
      <input
        style={{
          boxShadow:
            validationErrors.length > 0 ? "0px 0px 0px 3px red" : "none",
          fontSize: "20px",
          height: "24px"
        }}
        type="text"
        onBlur={() => setState(onBlur(state))}
        onChange={evt => setState(updateValue(state, evt.target.value))}
      />
      <Error errors={validationErrors} />
      <LittleText>{JSON.stringify(state.events)}</LittleText>
      <div>
        {allErrors.map((err, key) => (
          <LittleText key={key}>{err}</LittleText>
        ))}
      </div>
    </div>
  );
}
