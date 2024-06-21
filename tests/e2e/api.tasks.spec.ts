import { describe, it, expect } from 'vitest';
import axios from 'axios';

const BASE_URL = 'http://localhost:7450';

describe('Task API E2E Tests', () => {

  it('should get a list of tasks', async () => {
    const startTime = performance.now();
    const response = await axios.get(`${BASE_URL}/tasks`);
    const endTime = performance.now();
    const duration = endTime - startTime;

    expect(response.status).toBe(200);
    
    expect(duration).toBeLessThan(200)

    const json = response.data;
    
    expect(json).toHaveProperty('data')
    expect(json).toHaveProperty('total')
    expect(json).toHaveProperty('page')
    expect(json).toHaveProperty('perPage')

    expect(Array.isArray(json.data)).toBe(true)
  });

  it('should create a new task', async () => {

    const input = {
      title: "Sample Task",
      description: "This is a sample task description.",
      status: "To do"
    }

    const startTime = performance.now();
    const response = await axios.post(`${BASE_URL}/tasks`, input);
    const endTime = performance.now();
    const duration = endTime - startTime;

    expect(response.status).toBe(201);
    
    expect(duration).toBeLessThan(200)

    const json = response.data;
    
    expect(json).toHaveProperty('id')
  });

  
  it('should create a new task', async () => {

    const input = {
      title: "Sample Task",
      description: "This is a sample task description.",
      status: "To do"
    }

    const startTime = performance.now();
    const response = await axios.post(`${BASE_URL}/tasks`, input);
    const endTime = performance.now();
    const duration = endTime - startTime;

    expect(response.status).toBe(201);
    
    expect(duration).toBeLessThan(200)

    const json = response.data;

    expect(json).toHaveProperty('id')
  });

  it('should get a single tasks', async () => {
    const testId = '093ae92d-0133-4144-aa6a-f96dcba59231'
    const startTime = performance.now();
    const response = await axios.get(`${BASE_URL}/tasks/${testId}`);
    const endTime = performance.now();
    const duration = endTime - startTime;

    expect(response.status).toBe(200);
    
    expect(duration).toBeLessThan(200)

    const json = response.data;
    
    expect(json).toHaveProperty('id')
    expect(json).toHaveProperty('title')
    expect(json).toHaveProperty('description')
    expect(json).toHaveProperty('status')
  });

  it('should delete an existing task', async () => {

    const input = {
      title: "Delete this task",
      description: "This task goal is to be deleted",
      status: "To do"
    }

    let response = await axios.post(`${BASE_URL}/tasks`, input);
    expect(response.status).toBe(201);
    const json = response.data;
    expect(json).toHaveProperty('id')
    const targetId = json.id

    const startTime = performance.now();
    response = await axios.delete(`${BASE_URL}/tasks/${targetId}`);
    const endTime = performance.now();
    const duration = endTime - startTime;

    expect(response.status).toBe(200);
    expect(duration).toBeLessThan(200)
  });

  it('should update an existing task', async () => {

    const input = {
      title: "Update this task",
      description: "This task goal is to be updated",
      status: "To do"
    }
// Create task
    let response = await axios.post(`${BASE_URL}/tasks`, input);
    expect(response.status).toBe(201);
    const json = response.data;
    expect(json).toHaveProperty('id')
    const targetId = json.id
// Update task
    const startTime = performance.now();
    response = await axios.patch(`${BASE_URL}/tasks/${targetId}`,{status: "In Progress"});
    const endTime = performance.now();
    const duration = endTime - startTime;

    expect(response.status).toBe(200);
    expect(duration).toBeLessThan(200)
  });

});
