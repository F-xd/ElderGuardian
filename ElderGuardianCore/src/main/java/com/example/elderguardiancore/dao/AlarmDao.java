package com.example.elderguardiancore.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.elderguardiancore.pojo.entity.Alarm;

public interface AlarmDao extends JpaRepository<Alarm, Integer> {

}
