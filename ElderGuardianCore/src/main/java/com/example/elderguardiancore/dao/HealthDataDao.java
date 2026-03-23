package com.example.elderguardiancore.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.elderguardiancore.pojo.entity.HealthData;

public interface HealthDataDao extends JpaRepository<HealthData, Long> {

}
