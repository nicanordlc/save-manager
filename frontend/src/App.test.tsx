import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "@/App";

describe("App.tsx", () => {
  it("renders button to add game save", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>,
    );
    const got = screen.getByTestId("menuMiddleItem");
    const want = screen.getByTestId("addGameSave");

    expect(got).toContainElement(want);
  });

  it("renders not found if invalid path", () => {
    render(
      <MemoryRouter initialEntries={["/bananas"]}>
        <App />
      </MemoryRouter>,
    );
    const got = screen.getByRole("heading", { level: 1 });
    const want = "Not Found";
    expect(got).toHaveTextContent(want);
  });
});
