package com.example.elderguardiancore.dao;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.example.elderguardiancore.pojo.entity.HealthDevice;

public interface HealthDeviceDao extends JpaRepository<HealthDevice, Long> {
    boolean existsHealthDeviceByDeviceName(String deviceName);

    HealthDevice findHealthDeviceByDeviceName(String deviceName);

    // 分页查询设备列表
    @Query("SELECT d FROM HealthDevice d WHERE " +
            "(:deviceName IS NULL OR d.deviceName LIKE %:deviceName%)")
    Page<HealthDevice> findByConditions(
            @Param("deviceName") String deviceName,
            Pageable pageable);
}