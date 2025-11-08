import { Button } from "@/components/ui/button.tsx";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useEffect, useState } from "react";
import Modal from "@/components/Modal.tsx";
import Task from "@/components/Task.tsx";
import axios from "axios";

interface TaskType {
  id: number;
  title: string;
  description: string;
  active: boolean;
}

function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const fetchTasks = async (filter: "all" | "active" | "completed") => {
    try {
      let url = "http://localhost:8080/tasks";
      if (filter === "active") url = "http://localhost:8080/tasks/completed";
      else if (filter === "completed") url = "http://localhost:8080/tasks/active";

      const res = await axios.get(url);
      const data = Array.isArray(res.data) ? res.data : res.data.content;
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks(filter);
  }, [filter]);

  const handleCreateTask = async (newTask: { title: string; description: string }) => {
    try {
      await axios.post("http://localhost:8080/tasks", newTask);
      fetchTasks(filter);
      setIsOpen(false);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/tasks/${id}`);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleEditTask = async (id: number, updatedTask: { title: string; description: string }) => {
    try {
      await axios.put(`http://localhost:8080/tasks/${id}`, updatedTask);
      setTasks(prev => prev.map(task => task.id === id ? { ...task, ...updatedTask } : task));
    } catch (error) {
      console.error("Error editing task:", error);
    }
  };

  const handleToggleActive = async (id: number) => {
    try {
      const response = await axios.patch(`http://localhost:8080/tasks/${id}/toggle`);
      setTasks(prev =>
        prev.map(task => task.id === id ? { ...task, active: response.data.active } : task)
      );
    } catch (error) {
      console.error("Error toggling active:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center w-full">
        <h1 className="text-4xl text-[#F2F2F2] font-bold mt-8">My tasks</h1>
        <p className="text-[18px] text-[#BFBFBF] mt-2">
          <span className="text-[#595959]">Get started</span> and organize your tasks simply and efficiently
        </p>
      </div>

      <div className="flex justify-center items-center mt-4 gap-48">
        <ToggleGroup
          variant="outline"
          size="lg"
          type="single"
          value={filter}
          onValueChange={(value) => setFilter(value as "all" | "active" | "completed")}
        >
          <ToggleGroupItem
            value="all"
            aria-label="Mostrar todas"
            className="!text-white hover:!text-white focus:!text-white active:!text-white data-[state=on]:!text-white
                       bg-[#0D0D0D] data-[state=on]:bg-[#262626] hover:bg-[#262626] px-6 py-2 border border-[#2C2C2C]
                       first:rounded-l-md last:rounded-r-md -ml-px"
          >
            All
          </ToggleGroupItem>
          <ToggleGroupItem
            value="active"
            aria-label="Mostrar ativas"
            className="!text-white hover:!text-white focus:!text-white active:!text-white data-[state=on]:!text-white
                       bg-[#0D0D0D] data-[state=on]:bg-[#262626] hover:bg-[#262626] px-6 py-2 border border-[#2C2C2C]
                       first:rounded-l-md last:rounded-r-md -ml-px"
          >
            Active
          </ToggleGroupItem>
          <ToggleGroupItem
            value="completed"
            aria-label="Mostrar completas"
            className="!text-white hover:!text-white focus:!text-white active:!text-white data-[state=on]:!text-white
                       bg-[#0D0D0D] data-[state=on]:bg-[#262626] hover:bg-[#262626] px-6 py-2 border border-[#2C2C2C]
                       first:rounded-l-md last:rounded-r-md -ml-px"
          >
            Completed
          </ToggleGroupItem>
        </ToggleGroup>

        <Button onClick={() => setIsOpen(true)} size="lg" variant="secondary">
          Add task
        </Button>
      </div>

      <div className="flex flex-col mt-4 pb-30">
        {tasks.length === 0 ? (
          <p className="text-[#BFBFBF] text-center mt-32">No tasks yet. Create your first one!</p>
        ) : (
          tasks.map((task, i) => (
            <Task
              key={i}
              id={task.id}
              title={task.title}
              description={task.description}
              active={task.active}
              onDelete={handleDeleteTask}
              onEdit={handleEditTask}
              onToggleActive={handleToggleActive}
            />
          ))
        )}
      </div>

      <Modal
        open={isOpen}
        onOpenChange={setIsOpen}
        titleModal="Create new task"
        onCreate={handleCreateTask}
        requireAllFields
      />
    </>
  );
}

export default Home;
