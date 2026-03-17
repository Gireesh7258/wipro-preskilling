package com.wipro.reactiveprogramming.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.wipro.reactiveprogramming.entity.Student;
import com.wipro.reactiveprogramming.repository.StudentRepo;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class StudentService {

	@Autowired
	StudentRepo repo;
	
	
	public Mono<Student> addStudent(Student obj) {
		return repo.save(obj);
	}
	
	public Mono<Student> getStudent(int rollno)
	{
		return repo.findById(rollno);
	}
	
	
	public Flux<Student>  getAllStudents()
	{
		return repo.findAll();
	}
	
}
