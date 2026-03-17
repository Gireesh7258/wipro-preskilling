package com.wipro.reactiveprogramming.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wipro.reactiveprogramming.entity.Student;
import com.wipro.reactiveprogramming.service.StudentService;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/app")   // http://localhost:8080/app/
public class StudentController {

	@Autowired
	StudentService service;
	
	@PostMapping
	public Mono<Student> addNewStudent(@RequestBody Student obj) {
		return service.addStudent(obj);
	}
	
	
	@GetMapping("{rollno}")
	public Mono<Student>  getStudent(@PathVariable  int rollno)
	{
		return service.getStudent(rollno);
	}
	
	
	
	@GetMapping
	public Flux<Student>  getStudent()
	{
		return service.getAllStudents();
	}
	
	
	
}
