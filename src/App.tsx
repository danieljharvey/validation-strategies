import React from "react";
import "./App.css";
import { Input } from "./Input";
import { emptyState, onSubmit, getSuccess } from "./lib/FormLib";

import { validation, ValidPassword } from "./lib/Validation";

interface SuccessBoxProps {
  first: ValidPassword;
  second: ValidPassword;
  third: ValidPassword;
  fourth: ValidPassword;
  fifth: ValidPassword;
}

const SuccessBox: React.FC<SuccessBoxProps> = ({
  first,
  second,
  third,
  fourth,
  fifth
}) => (
  <div>
    {[first, second, third, fourth, fifth].map((i, key) => (
      <div key={key}>
        <span>👍</span>
        <span>&nbsp;{i}</span>
      </div>
    ))}
  </div>
);

function App() {
  const [first, setFirst] = React.useState(
    emptyState("" as string, validation)
  );
  const [second, setSecond] = React.useState(
    emptyState("" as string, validation)
  );
  const [third, setThird] = React.useState(
    emptyState("" as string, validation)
  );
  const [fourth, setFourth] = React.useState(
    emptyState("" as string, validation)
  );
  const [fifth, setFifth] = React.useState(
    emptyState("" as string, validation)
  );
  const [submitted, setSubmitted] = React.useState(false);

  const setSubmit = () => {
    setFirst(onSubmit(first));
    setSecond(onSubmit(second));
    setThird(onSubmit(third));
    setFourth(onSubmit(fourth));
    setFifth(onSubmit(fifth));
    setSubmitted(true);
  };
  const firstResult = getSuccess(first);
  const secondResult = getSuccess(second);
  const thirdResult = getSuccess(third);
  const fourthResult = getSuccess(fourth);
  const fifthResult = getSuccess(fifth);
  return (
    <div className="App">
      <header className="App-header">
        <p>
          <span>OnFirstBlur</span>
          <Input strategy="OnFirstBlur" state={first} setState={setFirst} />
        </p>
        <p>
          <span>OnFirstChange</span>
          <Input strategy="OnFirstChange" state={second} setState={setSecond} />
        </p>
        <p>
          <span>OnFirstSuccess</span>
          <Input strategy="OnFirstSuccess" state={third} setState={setThird} />
        </p>
        <p>
          <span>OnFirstSuccessOrFirstBlur</span>
          <Input
            strategy="OnFirstSuccessOrFirstBlur"
            state={fourth}
            setState={setFourth}
          />
        </p>
        <p>
          <span>OnSubmit</span>
          <Input strategy="OnSubmit" state={fifth} setState={setFifth} />
        </p>
        <button onClick={() => setSubmit()}>Submit</button>
        {firstResult &&
          secondResult &&
          thirdResult &&
          fourthResult &&
          fifthResult &&
          submitted && (
            <SuccessBox
              first={firstResult}
              second={secondResult}
              third={thirdResult}
              fourth={fourthResult}
              fifth={fifthResult}
            />
          )}
      </header>
    </div>
  );
}

export default App;
