package com.wipro.TestingReactiveApp.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Document
@AllArgsConstructor
public class Product {
	@Id
	int id;
	String name, price;
}
