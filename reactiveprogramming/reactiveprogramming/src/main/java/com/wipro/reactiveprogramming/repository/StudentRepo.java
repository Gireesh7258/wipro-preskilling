package com.wipro.reactiveprogramming.repository;

import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

import com.wipro.reactiveprogramming.entity.Student;

@Repository
public interface StudentRepo  extends ReactiveCrudRepository<Student, Integer>{

}
