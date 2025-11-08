import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Task from "@/components/Task";

const defaultTaskProps = {
  id: 1,
  title: "Test Task",
  description: "Test description",
  active: true,
  onDelete: vi.fn(),
  onEdit: vi.fn(),
  onToggleActive: vi.fn(),
};

describe("Task component", () => {
  it("renderiza título e descrição corretamente", () => {
    render(<Task {...defaultTaskProps} />);
    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
  });

  it("abre modal ao clicar no botão de editar", () => {
    render(<Task {...defaultTaskProps} />);

    const editButton = screen.getByRole("button", { name: /edit/i });
    fireEvent.click(editButton);

    expect(screen.getByText("Edit task")).toBeInTheDocument();
  });

  it("renderiza botão de deletar", () => {
    render(<Task {...defaultTaskProps} />);

    const deleteButton = screen.getAllByRole("button")[1];
    expect(deleteButton).toBeInTheDocument();
  });
});
