package com.todoapp.todo_server.tasks;

public record GetTaskData(
        Long id,
        String title,
        String description,
        boolean active
) {
}
