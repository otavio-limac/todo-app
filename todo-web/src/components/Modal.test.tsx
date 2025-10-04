import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Modal from "./Modal";
import { vi } from "vitest";

describe("Modal component", () => {
  it("renders correctly when open", () => {
    render(<Modal open={true} onOpenChange={vi.fn()} />);
    expect(screen.getByText("Create new task")).toBeInTheDocument();
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Create/i })).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(<Modal open={false} onOpenChange={vi.fn()} />);
    expect(screen.queryByText("Create new task")).not.toBeInTheDocument();
  });

  it("shows error messages when submitting empty form", async () => {
    const user = userEvent.setup();
    render(<Modal open={true} onOpenChange={vi.fn()} />);

    const createButton = screen.getByRole("button", { name: /Create/i });
    await user.click(createButton);

    expect(await screen.findByText(/Title is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Description is required/i)).toBeInTheDocument();
  });

  it("updates input values correctly", async () => {
    const user = userEvent.setup();
    render(<Modal open={true} onOpenChange={vi.fn()} />);

    const titleInput = screen.getByPlaceholderText("Enter the task title");
    const descInput = screen.getByPlaceholderText("Enter the task description");

    await user.type(titleInput, "Test Task");
    await user.type(descInput, "This is a test description");

    expect(titleInput).toHaveValue("Test Task");
    expect(descInput).toHaveValue("This is a test description");
  });

  it("clears inputs and errors when modal is closed", async () => {
    const { rerender } = render(<Modal open={true} onOpenChange={vi.fn()} />);

    // Type something
    const titleInput = screen.getByPlaceholderText("Enter the task title");
    await userEvent.type(titleInput, "Test Task");

    // Close the modal
    rerender(<Modal open={false} onOpenChange={vi.fn()} />);

    // Open again to check if cleared
    rerender(<Modal open={true} onOpenChange={vi.fn()} />);
    expect(screen.getByPlaceholderText("Enter the task title")).toHaveValue("");
    expect(screen.getByPlaceholderText("Enter the task description")).toHaveValue("");
    expect(screen.queryByText(/is required/i)).not.toBeInTheDocument();
  });
});
