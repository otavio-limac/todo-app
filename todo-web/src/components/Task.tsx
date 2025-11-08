import { Card, CardDescription, CardTitle } from "@/components/ui/card.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Pencil, Trash } from "lucide-react";
import Modal from "@/components/Modal.tsx";
import {useState} from "react";

interface TaskProps {
  title: string;
  description: string;
}

function Task({ title, description }: TaskProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex flex-col justify-center items-center mt-4">
      <Card className="flex flex-row bg-[#1e1e1e] border-[#333333] w-152 gap-4 p-4 rounded-md">
        <Checkbox className="ml-4" />
        <div className="flex flex-col">
          <CardTitle className="text-[#F2F2F2]">{title}</CardTitle>
          <CardDescription className="mt-2">{description}</CardDescription>
        </div>
        <div className="flex gap-2 ml-auto">
          <Button
            onClick={() => setIsOpen(true)}
            variant="default"
            size="icon"
            aria-label="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <Button
            variant="destructive"
            size="icon"
            aria-label="Delete"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      <Modal
        open={isOpen}
        onOpenChange={setIsOpen}
        titleModal="Edit task"
        onCreate={() => alert("Deu boa")}
        requireAllFields={false}
      />
    </div>
  );
}

export default Task;