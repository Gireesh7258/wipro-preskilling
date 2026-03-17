package com.wipro.reactiveprogramming.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


@Document
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Student {


	@Id
	int rollno;
	int age;
	String name;
	
	
}
