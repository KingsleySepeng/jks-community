package com.example.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ServiceApplication {
static Logger log = LoggerFactory.getLogger(ServiceApplication.class);
	public static void main(String[] args) {
		try{
			SpringApplication.run(ServiceApplication.class, args);
		}catch (Exception e){
			log.debug(e.getMessage());
		}
	}

}
