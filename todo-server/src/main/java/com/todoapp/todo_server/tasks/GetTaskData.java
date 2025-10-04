package com.todoapp.todo_server.tasks;

import lombok.Getter;

public record GetTaskData(
        Long id,
        String title,
        String description
) {
}
