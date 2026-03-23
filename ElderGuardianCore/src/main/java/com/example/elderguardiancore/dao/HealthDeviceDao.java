package com.example.elderguardiancore.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.elderguardiancore.pojo.entity.HealthDevice;

public interface HealthDeviceDao extends JpaRepository<HealthDevice, Long> {
    boolean existsHealthDeviceByDeviceName(String deviceName);

    HealthDevice findHealthDeviceByDeviceName(String deviceName);
}