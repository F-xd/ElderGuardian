package com.example.elderguardiancore.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.elderguardiancore.dao.HealthDataDao;
import com.example.elderguardiancore.pojo.entity.HealthData;
import com.example.elderguardiancore.service.interfaces.IHealthDataService;

@Service
public class HealthDataService implements IHealthDataService {
    @Autowired
    private HealthDataDao healthDataDao;

    @Override
    public void addHealthData(HealthData healthData) {
        healthDataDao.save(healthData);
    }
}
