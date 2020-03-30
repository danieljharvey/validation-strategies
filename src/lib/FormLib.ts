////// validators
import { Either, isRight, mapLeft, swap, getOrElse } from "fp-ts/lib/Either";

export type Validator<A, B> = (a: A) => Either<string[], B>;

//// InputState

export interface InputState<A, B = A> {
  events: {
    blurred: boolean;
    changed: boolean;
    valid: boolean;
    submit: boolean;
  };
  value: A;
  validation: Validator<A, B>;
}

/// internals

const emptyEvents: InputState<never, never>["events"] = {
  blurred: false,
  changed: false,
  valid: false,
  submit: false
};

const combineEventProp = (a: boolean, b: boolean): boolean => a || b;

const combineEvents = <A, B = A>(
  oldE: InputState<A, B>["events"],
  newE: InputState<A, B>["events"]
): InputState<A, B>["events"] => ({
  blurred: combineEventProp(oldE.blurred, newE.blurred),
  changed: combineEventProp(oldE.changed, newE.changed),
  valid: combineEventProp(oldE.valid, newE.valid),
  submit: combineEventProp(oldE.submit, newE.submit)
});

const combineState = <A, B = A>(
  oldS: InputState<A, B>,
  newS: InputState<A, B>
): InputState<A, B> => ({
  events: combineEvents(oldS.events, newS.events),
  value: newS.value,
  validation: newS.validation
});

const updateEvents = <A, B = A>(
  state: InputState<A, B>,
  newEvents: InputState<A, B>["events"]
): InputState<A, B> => ({
  ...state,
  events: combineEvents(state.events, newEvents)
});

const showErrors = <A, B = A>(
  events: InputState<A, B>["events"],
  strategy: Strategy
): boolean => {
  switch (strategy) {
    case "OnFirstBlur":
      return events.blurred;
    case "OnFirstChange":
      return events.changed;
    case "OnFirstSuccess":
      return events.valid;
    case "OnFirstSuccessOrFirstBlur":
      return events.valid || events.blurred;
    case "OnSubmit":
      return events.submit;
  }
};

////////////// public api ...

export const emptyState = <A, B = A>(
  value: A,
  validation: Validator<A, B>
): InputState<A, B> => ({
  events: emptyEvents,
  value,
  validation
});

export const updateValue = <A, B = A>(
  state: InputState<A, B>,
  value: A
): InputState<A, B> => ({
  ...state,
  value,
  events: combineEvents(state.events, {
    ...emptyEvents,
    changed: state.value !== value,
    valid: isRight(state.validation(value))
  })
});

export const onBlur = <A, B = A>(state: InputState<A, B>): InputState<A, B> =>
  updateEvents(state, {
    ...emptyEvents,
    blurred: true
  });

export const onSubmit = <A, B = A>(state: InputState<A, B>): InputState<A, B> =>
  combineState(state, {
    ...state,
    events: {
      ...emptyEvents,
      submit: true
    }
  });

export type Strategy =
  | "OnFirstBlur"
  | "OnFirstChange"
  | "OnFirstSuccess"
  | "OnFirstSuccessOrFirstBlur"
  | "OnSubmit";

export const getResult = <A, B = A>(
  state: InputState<A, B>,
  strategy: Strategy
): Either<string[], B> =>
  mapLeft<string[], string[]>(errs =>
    showErrors(state.events, strategy) ? errs : []
  )(state.validation(state.value));

export const getErrors = <B>(result: Either<string[], B>): string[] =>
  getOrElse<B, string[]>(_ => [])(swap(result));

export const getSuccess = <A, B = A>(state: InputState<A, B>): B | null =>
  getOrElse<string[], B | null>(_ => null)(
    getResult(state, undefined as never)
  );
