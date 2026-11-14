import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button } from "./Button";

describe("Button", () => {
  it("renders a button with its accessible name", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not fire onClick when disabled", async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("merges a custom className last", () => {
    render(<Button className="px-10">Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toHaveClass("ui-button", "ui-button--variant-default", "px-10");
    expect(button.className.endsWith("px-10")).toBe(true);
  });

  it("renders its child element when asChild is set", () => {
    render(
      <Button asChild>
        <a href="/docs">Docs</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Docs" });
    expect(link).toHaveAttribute("data-slot", "button");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
