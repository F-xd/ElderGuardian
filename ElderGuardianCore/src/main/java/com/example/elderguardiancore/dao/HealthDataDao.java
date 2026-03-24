package com.example.elderguardiancore.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.example.elderguardiancore.pojo.entity.HealthData;

public interface HealthDataDao extends JpaRepository<HealthData, Long> {
    @Query("SELECT d FROM HealthData d WHERE " +
            "(:deviceId IS NULL OR d.deviceId = :deviceId) " +
            "AND d.time >= :minTime " +
            "AND d.time <= :maxTime " +
            "ORDER BY d.time ASC")
    List<HealthData> findByConditions(
            @Param("deviceId") Long deviceId,
            @Param("minTime") long minTime,
            @Param("maxTime") long maxTime);
}
