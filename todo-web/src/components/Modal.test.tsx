import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Modal from "./Modal";
import { vi } from "vitest";

describe("Modal component", () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    titleModal: "Create new task",
    buttonText: "Create",
  };

  it("renders correctly", () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByText(defaultProps.titleModal)).toBeInTheDocument();
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: defaultProps.buttonText })).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(<Modal {...defaultProps} open={false} />);
    expect(screen.queryByText(defaultProps.titleModal)).not.toBeInTheDocument();
  });

  it("shows error messages when submitting empty form", async () => {
    const user = userEvent.setup();
    render(<Modal {...defaultProps} />);

    const mainButton = screen.getByRole("button", { name: defaultProps.buttonText });
    await user.click(mainButton);

    expect(await screen.findByText(/Title is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Description is required/i)).toBeInTheDocument();
  });

  it("updates input values correctly", async () => {
    const user = userEvent.setup();
    render(<Modal {...defaultProps} />);

    const titleInput = screen.getByPlaceholderText("Enter the task title");
    const descInput = screen.getByPlaceholderText("Enter the task description");

    await user.type(titleInput, "Test Task");
    await user.type(descInput, "This is a test description");

    expect(titleInput).toHaveValue("Test Task");
    expect(descInput).toHaveValue("This is a test description");
  });

  it("clears inputs and errors when modal is closed", async () => {
    const { rerender } = render(<Modal {...defaultProps} />);

    const titleInput = screen.getByPlaceholderText("Enter the task title");
    await userEvent.type(titleInput, "Test Task");

    rerender(<Modal {...defaultProps} open={false} />);
    rerender(<Modal {...defaultProps} open={true} />);

    expect(screen.getByPlaceholderText("Enter the task title")).toHaveValue("");
    expect(screen.getByPlaceholderText("Enter the task description")).toHaveValue("");
    expect(screen.queryByText(/is required/i)).not.toBeInTheDocument();
  });
});