import {Button} from "@/components/ui/button.tsx";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {useState} from "react";
import Modal from "@/components/Modal.tsx";
import Task from "@/components/Task.tsx";

interface TaskType {
  title: string;
  description: string;
}

function Home() {
  const [isOpen, setIsOpen] = useState(false)
  const [tasks, setTasks] = useState<TaskType[]>([]);

  const handleCreateTask = (newTask: TaskType) => {
    setTasks((prev) => [...prev, newTask]);
    setIsOpen(false);
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center w-full">
        <h1 className="text-4xl text-[#F2F2F2] font-bold mt-8">My tasks</h1>
        <p className="text-[18px] text-[#BFBFBF] mt-2"><span className="text-[#595959]">Get started</span> and organize your tasks simply and efficiently</p>
      </div>
      <div className="flex justify-center items-center mt-4 gap-48">
        <ToggleGroup variant="outline" size="lg" type="single" defaultValue="all">
          <ToggleGroupItem   className="!text-white hover:!text-white focus:!text-white active:!text-white data-[state=on]:!text-white
               bg-[#0D0D0D] data-[state=on]:bg-[#262626] hover:bg-[#262626] px-6 py-2 border border-[#2C2C2C]
               first:rounded-l-md last:rounded-r-md -ml-px" value="all" aria-label="Mostrar todas">
            All
          </ToggleGroupItem>
          <ToggleGroupItem   className="!text-white hover:!text-white focus:!text-white active:!text-white data-[state=on]:!text-white
               bg-[#0D0D0D] data-[state=on]:bg-[#262626] hover:bg-[#262626] px-6 py-2 border border-[#2C2C2C]
               first:rounded-l-md last:rounded-r-md -ml-px" value="active" aria-label="Mostrar ativas">
            Active
          </ToggleGroupItem>
          <ToggleGroupItem   className="!text-white hover:!text-white focus:!text-white active:!text-white data-[state=on]:!text-white
               bg-[#0D0D0D] data-[state=on]:bg-[#262626] hover:bg-[#262626] px-6 py-2 border border-[#2C2C2C]
               first:rounded-l-md last:rounded-r-md -ml-px" value="completed" aria-label="Mostrar completas">
            Completed
          </ToggleGroupItem>
        </ToggleGroup>
        <Button onClick={() => setIsOpen(true)} size="lg" variant="secondary">Add task</Button>
      </div>

      <div className="flex flex-col">
        {tasks.length === 0 ? (
          <p className="text-[#BFBFBF] text-center mt-32">
            No tasks yet. Create your first one!
          </p>
        ) : (
          tasks.map((task, i) => (
            <Task key={i} title={task.title} description={task.description} />
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

      <div>
        {tasks.map((task, i) => (
          <div key={i}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
          </div>
        ))}
      </div>
    </>
  )
}

export default Home;