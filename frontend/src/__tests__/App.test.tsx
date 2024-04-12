import { render, screen } from "@testing-library/react";
import App from "../App";

describe("App.tsx", () => {
  it("should be defined with hello world", () => {
    const app = render(<App />);
    expect(app).toMatchSnapshot();
  });
});
