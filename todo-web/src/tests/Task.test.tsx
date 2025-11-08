import { render, screen, fireEvent } from "@testing-library/react";
import Task from "@/components/Task";

describe("Task component", () => {
  it("renders title and description correctly", () => {
    render(<Task title="Test Task" description="Test description" />);
    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
  });

  it("opens modal when edit button is clicked", () => {
    render(<Task title="Edit Me" description="Editable task" />);

    const editButton = screen.getByRole("button", { name: /edit/i });
    fireEvent.click(editButton);

    expect(screen.getByText("Edit task")).toBeInTheDocument();
  });

  it("renders delete button (trash icon)", () => {
    render(<Task title="Task X" description="Description Y" />);

    const deleteButton = screen.getAllByRole("button")[1];
    expect(deleteButton).toBeInTheDocument();
  });
});