package com.example.elderguardiancore.pojo.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum AlarmEvent implements ICodeEnum {
    SMOKE_WARNING(0, "浓烟预警"),
    HIGH_TEMPERATURE_WARNING(1, "高温预警"),
    LOW_TEMPERATURE_WARNING(2, "低温预警"),
    HUMIDITY_WARNING(3, "潮湿预警"),
    DRY_WARNING(4, "干燥预警"),
    HEART_RATE_ABNORMAL(5, "心率异常"),
    BLOOD_OXYGEN_ABNORMAL(6, "血氧异常"),
    FALL_HELP(7, "跌倒求助");

    private final int id;
    private final String name;

    AlarmEvent(int id, String name) {
        this.id = id;
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    @JsonCreator
    public static AlarmEvent fromId(Object input) {
        return ICodeEnum.fromValue(input, AlarmEvent.class, AlarmEvent::getId);
    }
}