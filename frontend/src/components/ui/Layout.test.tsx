import { render, screen } from "@testing-library/react";
import Layout from "@/components/ui/Layout";

describe("Layout.tsx", () => {
  it("should render default layout", () => {
    render(<Layout>Hello m8</Layout>);
    const got = screen.getByTestId("layout");
    const want = "Hello m8";

    expect(got).toHaveTextContent(want);
    expect(got.nodeName).toBe("DIV");
  });

  it("should render tag as container", () => {
    render(<Layout container="section" />);
    const got = screen.getByTestId("layout");
    const want = "SECTION";

    expect(got.nodeName).toBe(want);
  });
});
