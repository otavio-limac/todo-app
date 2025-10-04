package com.todoapp.todo_server.controller;

import com.todoapp.todo_server.tasks.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/tasks")
public class TaskController {
    @Autowired
    private TaskRepository repository;

    @GetMapping
    public ResponseEntity<Page<GetTaskData>> getTasks(Pageable pageable) {
        Page<GetTaskData> page = repository.findAll(pageable)
                .map(task -> new GetTaskData(
                        task.getId(),
                        task.getTitle(),
                        task.getDescription()
                ));

        return ResponseEntity.ok(page);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GetTaskData> getTaskById(@PathVariable Long id) {
        return repository.findById(id)
                .map(task -> new GetTaskData(task.getId(), task.getTitle(), task.getDescription()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Task> postTask(@Valid @RequestBody PostTaskData data) {
        Task savedTask = repository.save(new Task(data));

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(savedTask.getId())
                .toUri();

        return ResponseEntity.created(location).body(savedTask);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GetTaskData> updateTask(
            @PathVariable Long id,
            @RequestBody UpdateTaskData data) {

        return repository.findById(id)
                .map(task -> {
                    task.setTitle(data.title());
                    task.setDescription(data.description());
                    repository.save(task);
                    return new GetTaskData(task.getId(), task.getTitle(), task.getDescription());
                })
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        return repository.findById(id)
                .map(task -> {
                    repository.deleteById(id);
                    return ResponseEntity.noContent().<Void>build();
                }).orElse(ResponseEntity.notFound().build());
    }
}
