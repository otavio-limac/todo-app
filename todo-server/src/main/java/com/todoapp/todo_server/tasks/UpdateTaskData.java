package com.todoapp.todo_server.tasks;

public record UpdateTaskData(
        String title,
        String description
) {
}
