import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({ useSearchParams: () => new URLSearchParams() }));
vi.mock("../actions", () => ({ logIn: vi.fn() }));

import LoginPage from "./page";

describe("login page", () => {
  it("renders the wordmark, email + password fields, and a submit button", () => {
    render(<LoginPage />);
    expect(screen.getByText("BILLD")).toBeInTheDocument();
    expect(document.querySelector('input[name="email"]')).toBeInTheDocument();
    expect(document.querySelector('input[name="password"]')).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveClass("billd-btn--primary");
  });
});
