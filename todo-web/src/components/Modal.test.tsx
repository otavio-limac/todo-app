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

  const editProps = {
    ...defaultProps,
    titleModal: "Edit task",
    buttonText: "Save",
  };

  const runCommonTests = (props: typeof defaultProps) => {
    it(`renders correctly for title "${props.titleModal}"`, () => {
      render(<Modal {...props} />);
      expect(screen.getByText(props.titleModal)).toBeInTheDocument();
      expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: props.buttonText })).toBeInTheDocument();
    });

    it(`does not render when closed for title "${props.titleModal}"`, () => {
      render(<Modal {...props} open={false} />);
      expect(screen.queryByText(props.titleModal)).not.toBeInTheDocument();
    });

    it(`shows error messages when submitting empty form for title "${props.titleModal}"`, async () => {
      const user = userEvent.setup();
      render(<Modal {...props} />);

      const mainButton = screen.getByRole("button", { name: props.buttonText });
      await user.click(mainButton);

      expect(await screen.findByText(/Title is required/i)).toBeInTheDocument();
      expect(await screen.findByText(/Description is required/i)).toBeInTheDocument();
    });

    it(`updates input values correctly for title "${props.titleModal}"`, async () => {
      const user = userEvent.setup();
      render(<Modal {...props} />);

      const titleInput = screen.getByPlaceholderText("Enter the task title");
      const descInput = screen.getByPlaceholderText("Enter the task description");

      await user.type(titleInput, "Test Task");
      await user.type(descInput, "This is a test description");

      expect(titleInput).toHaveValue("Test Task");
      expect(descInput).toHaveValue("This is a test description");
    });

    it(`clears inputs and errors when modal is closed for title "${props.titleModal}"`, async () => {
      const { rerender } = render(<Modal {...props} />);

      const titleInput = screen.getByPlaceholderText("Enter the task title");
      await userEvent.type(titleInput, "Test Task");

      rerender(<Modal {...props} open={false} />);
      rerender(<Modal {...props} open={true} />);

      expect(screen.getByPlaceholderText("Enter the task title")).toHaveValue("");
      expect(screen.getByPlaceholderText("Enter the task description")).toHaveValue("");
      expect(screen.queryByText(/is required/i)).not.toBeInTheDocument();
    });
  };

  // roda os testes para ambos os casos
  describe("Create Modal", () => runCommonTests(defaultProps));
  describe("Edit Modal", () => runCommonTests(editProps));
});