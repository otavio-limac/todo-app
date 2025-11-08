package com.todoapp.todo_server.controller;

import com.todoapp.todo_server.tasks.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TaskController.class)
class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TaskRepository repository;

    // ===================== GET /tasks/{id} =====================
    @Test
    void shouldReturnTaskById() throws Exception {
        Task task = new Task();
        task.setId(1L);
        task.setTitle("Test Task");
        task.setDescription("Task description");
        task.setActive(true);

        given(repository.findById(1L)).willReturn(Optional.of(task));

        mockMvc.perform(get("/tasks/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test Task"))
                .andExpect(jsonPath("$.description").value("Task description"))
                .andExpect(jsonPath("$.active").value(true));
    }

    @Test
    void shouldReturn404IfTaskNotFound() throws Exception {
        given(repository.findById(999L)).willReturn(Optional.empty());

        mockMvc.perform(get("/tasks/999"))
                .andExpect(status().isNotFound());
    }

    // ===================== GET /tasks =====================
    @Test
    void shouldReturnPageOfTasks() throws Exception {
        Task task = new Task();
        task.setId(1L);
        task.setTitle("Task 1");
        task.setDescription("Desc 1");
        task.setActive(true);

        Page<Task> page = new PageImpl<>(List.of(task));
        given(repository.findAll(any(Pageable.class))).willReturn(page);

        mockMvc.perform(get("/tasks")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].title").value("Task 1"));
    }

    // ===================== POST /tasks =====================
    @Test
    void shouldCreateTask() throws Exception {
        PostTaskData data = new PostTaskData("New Task", "Description");
        Task saved = new Task(data);
        saved.setId(1L);
        saved.setActive(true);

        given(repository.save(any(Task.class))).willReturn(saved);

        mockMvc.perform(post("/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "title": "New Task",
                                    "description": "Description"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(header().exists("Location"))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("New Task"));
    }

    // ===================== PUT /tasks/{id} =====================
    @Test
    void shouldUpdateTask() throws Exception {
        Task existing = new Task();
        existing.setId(1L);
        existing.setTitle("Old");
        existing.setDescription("Old desc");
        existing.setActive(true);

        given(repository.findById(1L)).willReturn(Optional.of(existing));
        given(repository.save(any(Task.class))).willReturn(existing);

        mockMvc.perform(put("/tasks/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "title": "Updated Task",
                                    "description": "Updated desc"
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Task"))
                .andExpect(jsonPath("$.description").value("Updated desc"));
    }

    @Test
    void shouldReturn404WhenUpdatingNonExistingTask() throws Exception {
        given(repository.findById(999L)).willReturn(Optional.empty());

        mockMvc.perform(put("/tasks/999")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "title": "Updated Task",
                                    "description": "Updated desc"
                                }
                                """))
                .andExpect(status().isNotFound());
    }

    // ===================== PATCH /tasks/{id}/toggle =====================
    @Test
    void shouldToggleTaskActiveStatus() throws Exception {
        Task task = new Task();
        task.setId(1L);
        task.setTitle("Toggle Task");
        task.setDescription("To be toggled");
        task.setActive(true);

        given(repository.findById(1L)).willReturn(Optional.of(task));
        given(repository.save(any(Task.class))).willReturn(task);

        mockMvc.perform(patch("/tasks/1/toggle"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.active").value(false));
    }

    @Test
    void shouldReturn404WhenTogglingNonExistingTask() throws Exception {
        given(repository.findById(999L)).willReturn(Optional.empty());

        mockMvc.perform(patch("/tasks/999/toggle"))
                .andExpect(status().isNotFound());
    }

    // ===================== DELETE /tasks/{id} =====================
    @Test
    void shouldDeleteTask() throws Exception {
        Task task = new Task();
        task.setId(1L);

        given(repository.findById(1L)).willReturn(Optional.of(task));

        mockMvc.perform(delete("/tasks/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void shouldReturn404WhenDeletingNonExistingTask() throws Exception {
        given(repository.findById(999L)).willReturn(Optional.empty());

        mockMvc.perform(delete("/tasks/999"))
                .andExpect(status().isNotFound());
    }
}