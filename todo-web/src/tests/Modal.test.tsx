import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Modal from "../components/Modal";
import { vi } from "vitest";

describe("Modal component", () => {
  const onOpenChangeMock = vi.fn();
  const onCreateMock = vi.fn();

  const defaultProps = {
    open: true,
    onOpenChange: onOpenChangeMock,
    titleModal: "Create new task",
    onCreate: onCreateMock,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly", () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByText(defaultProps.titleModal)).toBeInTheDocument();
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Create/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cancel/i })).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(<Modal {...defaultProps} open={false} />);
    expect(screen.queryByText(defaultProps.titleModal)).not.toBeInTheDocument();
  });

  it("shows error messages when submitting empty form", async () => {
    const user = userEvent.setup();
    render(<Modal {...defaultProps} />);

    const createButton = screen.getByRole("button", { name: /Create/i });
    await user.click(createButton);

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

  it("clears inputs and errors when modal is closed and reopened", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Modal {...defaultProps} />);

    const titleInput = screen.getByPlaceholderText("Enter the task title");
    await user.type(titleInput, "Test Task");

    rerender(<Modal {...defaultProps} open={false} />);
    rerender(<Modal {...defaultProps} open={true} />);

    expect(screen.getByPlaceholderText("Enter the task title")).toHaveValue("");
    expect(screen.getByPlaceholderText("Enter the task description")).toHaveValue("");
    expect(screen.queryByText(/is required/i)).not.toBeInTheDocument();
  });

  it("calls onCreate with correct data when form is valid", async () => {
    const user = userEvent.setup();
    render(<Modal {...defaultProps} />);

    await user.type(screen.getByPlaceholderText("Enter the task title"), "My Task");
    await user.type(screen.getByPlaceholderText("Enter the task description"), "My Description");

    await user.click(screen.getByRole("button", { name: /Create/i }));

    expect(onCreateMock).toHaveBeenCalledWith({
      title: "My Task",
      description: "My Description",
    });
  });

  it("allows empty fields when requireAllFields is false", async () => {
    const user = userEvent.setup();
    render(<Modal {...defaultProps} requireAllFields={false} />);

    await user.click(screen.getByRole("button", { name: /Create/i }));

    expect(screen.queryByText(/required/i)).not.toBeInTheDocument();
    expect(onCreateMock).toHaveBeenCalledWith({ title: "", description: "" });
  });

  it("clears error message when user fixes input", async () => {
    const user = userEvent.setup();
    render(<Modal {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: /Create/i }));
    expect(await screen.findByText(/Title is required/i)).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText("Enter the task title"), "Fixed Title");

    expect(screen.queryByText(/Title is required/i)).not.toBeInTheDocument();
  });

  it("does not call onCreate when validation fails", async () => {
    const user = userEvent.setup();
    render(<Modal {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: /Create/i }));

    expect(onCreateMock).not.toHaveBeenCalled();
  });

  it("calls onOpenChange when clicking Cancel", async () => {
    const user = userEvent.setup();
    render(<Modal {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: /Cancel/i }));

    expect(onOpenChangeMock).toHaveBeenCalledWith(false);
  });
});