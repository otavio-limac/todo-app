// Footer.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Footer from "../components/Footer.tsx";

describe("Footer component", () => {
  it("should render the copyright text", () => {
    render(<Footer />);
    const textElement = screen.getByText(/© 2025 Your App. All rights reserved./i);
    expect(textElement).toBeInTheDocument();
  });
});
